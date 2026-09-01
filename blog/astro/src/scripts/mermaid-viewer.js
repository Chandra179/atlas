// Client-side mermaid renderer with pan/zoom.
//
// remark-mermaid-preserve.js leaves each diagram in the HTML as:
//   <div class="mermaid-diagram" data-orientation="..."><pre class="mermaid">source</pre></div>
//
// This module renders `source` in the browser via the mermaid runtime and,
// except in pdf-mode, wraps the SVG in a pannable/zoomable viewport with
// on-hover controls (wheel zoom, drag pan, pinch zoom, fullscreen).
//
// PDF path: the worker stamps a `pdf-mode` class on <html> and feeds the
// page to Browser Run. In pdf-mode we render with the light theme, skip the
// interactive viewport, and top-level-await the render so the window `load`
// event only fires after every diagram exists in the DOM — Browser Run
// waits for `load` before snapshotting the PDF.
//
// Dark mode: the rendered theme follows the `.dark` class on <html>; a
// MutationObserver re-renders all diagrams when it flips.

const isPdfMode = () => document.documentElement.classList.contains('pdf-mode');
const prefersDark = () => document.documentElement.classList.contains('dark');

let mermaidMod = null;
async function loadMermaid() {
  if (!mermaidMod) {
    mermaidMod = (await import('mermaid')).default;
  }
  return mermaidMod;
}

let renderCounter = 0;

function toSvg(svgString) {
  return new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
}

function naturalSize(svg) {
  const vb = svg.getAttribute('viewBox');
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { w: parts[2], h: parts[3] };
    }
  }
  return { w: 800, h: 600 };
}

const activeViewports = new Set();

class MermaidViewport {
  constructor(wrapper, pre, svg) {
    this.wrapper = wrapper;
    this.pre = pre;
    this.size = naturalSize(svg);
    this.scale = 1;
    this.tx = 0;
    this.ty = 0;
    this.pointers = new Map();
    this.pinch = null;

    svg.setAttribute('width', String(this.size.w));
    svg.setAttribute('height', String(this.size.h));

    this.viewport = document.createElement('div');
    this.viewport.className = 'mermaid-viewport';
    this.stage = document.createElement('div');
    this.stage.className = 'mermaid-stage';
    this.stage.appendChild(svg);
    this.viewport.appendChild(this.stage);
    this.viewport.appendChild(this.buildControls());

    pre.hidden = true;
    wrapper.appendChild(this.viewport);

    this.viewport.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    this.viewport.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.viewport.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.viewport.addEventListener('pointerup', (e) => this.onPointerUp(e));
    this.viewport.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    activeViewports.add(this);
    this.fit();
  }

  buildControls() {
    const div = document.createElement('div');
    div.className = 'mermaid-controls';
    const btn = (glyph, label, fn) => {
      const b = document.createElement('button');
      b.textContent = glyph;
      b.setAttribute('aria-label', label);
      b.title = label;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        fn();
      });
      return b;
    };
    div.append(
      btn('−', 'Zoom out', () => this.zoomAtCenter(0.8)),
      btn('+', 'Zoom in', () => this.zoomAtCenter(1.25)),
      btn('↺', 'Reset view', () => this.fit()),
      btn('⤢', 'Toggle fullscreen', () => this.toggleFullscreen()),
    );
    return div;
  }

  onWheel(e) {
    e.preventDefault();
    const rect = this.viewport.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const factor = Math.exp(-e.deltaY * 0.0015);
    this.zoomAt(px, py, factor);
  }

  onPointerDown(e) {
    // Don't capture presses that start on the toolbar buttons: pointer
    // capture retargets compatibility mouse events (including `click`) to
    // the viewport, which would swallow the buttons' click handlers.
    if (e.target.closest('.mermaid-controls')) return;
    this.viewport.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      this.pinch = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        scale: this.scale,
        tx: this.tx,
        ty: this.ty,
      };
    }
  }

  onPointerMove(e) {
    const prev = this.pointers.get(e.pointerId);
    if (!prev) return;
    if (this.pointers.size === 1) {
      this.pan(e.clientX - prev.x, e.clientY - prev.y);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      return;
    }
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 2 && this.pinch) {
      const [a, b] = [...this.pointers.values()];
      const rect = this.viewport.getBoundingClientRect();
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top };
      const scale = Math.min(8, Math.max(0.2, this.pinch.scale * (dist / this.pinch.dist)));
      this.setTransform(scale, this.pinch.tx + (mid.x - this.pinch.mid.x), this.pinch.ty + (mid.y - this.pinch.mid.y));
    }
  }

  onPointerUp(e) {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinch = null;
  }

  pan(dx, dy) {
    this.setTransform(this.scale, this.tx + dx, this.ty + dy);
  }

  zoomAt(px, py, factor) {
    const ns = Math.min(8, Math.max(this.fitScale() * 0.2, this.scale * factor));
    const k = ns / this.scale;
    this.setTransform(ns, px - (px - this.tx) * k, py - (py - this.ty) * k);
  }

  zoomAtCenter(factor) {
    const rect = this.viewport.getBoundingClientRect();
    this.zoomAt(rect.width / 2, rect.height / 2, factor);
  }

  fitScale() {
    const vw = this.viewport.clientWidth;
    return vw > 0 ? Math.min(1, vw / this.size.w) : 1;
  }

  fit() {
    this.setTransform(this.fitScale(), 0, 0);
  }

  setTransform(scale, tx, ty) {
    const vw = this.viewport.clientWidth;
    const vh = this.viewport.clientHeight;
    const cw = this.size.w * scale;
    const ch = this.size.h * scale;
    if (cw <= vw) tx = (vw - cw) / 2;
    else tx = Math.max(vw - cw, Math.min(0, tx));
    if (ch <= vh) ty = (vh - ch) / 2;
    else ty = Math.max(vh - ch, Math.min(0, ty));
    this.scale = scale;
    this.tx = tx;
    this.ty = ty;
    this.stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  toggleFullscreen() {
    const open = this.wrapper.classList.toggle('mermaid-fullscreen');
    document.body.style.overflow = open ? 'hidden' : '';
    requestAnimationFrame(() => this.fit());
  }
}

async function renderDiagrams() {
  const wrappers = Array.from(document.querySelectorAll('.mermaid-diagram'));
  const todo = wrappers.filter((w) => !w.dataset.mermaidRendered);
  if (!todo.length) return;

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    // 'loose' (not 'strict'): strict forces labels to render as plain text
    // (textContent) and silently disables htmlLabels, so `<br>` in node
    // labels is dropped and whole nodes can vanish. All diagram content is
    // self-authored markdown from this repo (no untrusted input), so the
    // HTML-label rendering loose enables is safe here.
    securityLevel: 'loose',
    theme: isPdfMode() ? 'default' : prefersDark() ? 'dark' : 'default',
    fontFamily: 'Inter Variable, ui-sans-serif, system-ui, sans-serif',
  });

  for (const wrapper of todo) {
    // Re-check here: concurrent callers (module eval + astro:page-load) can
    // both reach this loop, so guard again after the await above.
    if (wrapper.dataset.mermaidRendered) continue;
    const pre = wrapper.querySelector('pre.mermaid');
    if (!pre || !pre.textContent.trim()) continue;
    try {
      const { svg: svgString } = await mermaid.render(`mermaid-${++renderCounter}`, pre.textContent);
      const svg = toSvg(svgString);
      if (isPdfMode()) {
        wrapper.replaceChildren(svg);
      } else {
        new MermaidViewport(wrapper, pre, svg);
      }
      wrapper.dataset.mermaidRendered = '1';
    } catch (err) {
      console.error('Mermaid render failed:', err);
    }
  }
}

// Coalesce concurrent invocations: Astro fires `astro:page-load` on initial
// load too, right after the module-eval render starts, so both would render
// each diagram twice. Share one in-flight pass; reset after it resolves so
// later SPA navigations still trigger fresh renders.
let renderInFlight = null;
function renderDiagramsOnce() {
  if (!renderInFlight) {
    renderInFlight = renderDiagrams().finally(() => {
      renderInFlight = null;
    });
  }
  return renderInFlight;
}

function rerenderAll() {
  for (const wrapper of document.querySelectorAll('.mermaid-diagram')) {
    const pre = wrapper.querySelector('pre.mermaid');
    if (!pre) continue;
    pre.hidden = false;
    wrapper.querySelector('.mermaid-viewport')?.remove();
    delete wrapper.dataset.mermaidRendered;
  }
  renderDiagrams();
}

// In pdf-mode, render with a top-level await so the window `load` event
// (which Browser Run waits for before snapshotting the PDF) only fires after
// every diagram is in the DOM. On the normal web path, render lazily.
const shouldRender = Boolean(document.querySelector('.mermaid-diagram pre.mermaid'));
if (shouldRender) {
  if (isPdfMode()) {
    await renderDiagramsOnce().catch((err) => console.error('Mermaid render failed:', err));
  } else {
    renderDiagramsOnce();
  }
}

document.addEventListener('astro:page-load', () => renderDiagramsOnce());

let lastDark = prefersDark();
let themeTimer = 0;
new MutationObserver(() => {
  const dark = prefersDark();
  if (dark === lastDark) return;
  lastDark = dark;
  clearTimeout(themeTimer);
  themeTimer = setTimeout(rerenderAll, 120);
}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

window.addEventListener('beforeprint', () => {
  for (const vp of activeViewports) vp.fit();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  for (const wrapper of document.querySelectorAll('.mermaid-diagram.mermaid-fullscreen')) {
    wrapper.classList.remove('mermaid-fullscreen');
    // Restore the fitted view, same as the ⤢ button's exit path does —
    // otherwise the fullscreen zoom/pan transform would be left behind.
    const vp = [...activeViewports].find((v) => v.wrapper === wrapper);
    vp?.fit();
  }
  document.body.style.overflow = '';
});
