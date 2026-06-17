---
title: "ReactJS"
aliases: []
tags: [reactjs]
created: "2026-06-13"
---

# ReactJS

React is the declarative UI library [^1] — describe *what* the UI should look like as a function of state, and React figures out *how* to update the DOM efficiently. It exists because imperative DOM manipulation couples application logic to browser-specific API calls, making UI code hard to reason about, test, and maintain as applications grow beyond a few hundred lines.

**What it's for:** Single-page applications with complex interactive state, component-based design systems, mobile apps (React Native), static and server-rendered sites (Next.js), real-time dashboards, and any UI where "what you see is a function of state" is cleaner than "call appendChild, then removeChild, then update textContent."

---

### Virtual DOM — declarative description, not imperative steps

Most UI frameworks before React required you to write step-by-step DOM instructions. When a user adds an item to a todo list, you `document.createElement('li')`, set `textContent`, `appendChild` to the parent, then remember to remove it later. Every state change has a corresponding DOM mutation sequence — and the sequences for different states can conflict.

React takes the opposite approach. You write a function that returns a description of the entire UI given the current state — a tree of plain JavaScript objects called React elements. This is the **Virtual DOM**. React compares the new description to the previous one and figures out the minimal DOM operations needed. [^1]

```javascript
// React element tree (Virtual DOM)
{
  type: "div",
  props: { className: "container" },
  children: [
    { type: "h1", props: {}, children: ["Hello"] },
    { type: "p", props: {}, children: ["World"] }
  ]
}
```

Consider a real-time dashboard with 50 widgets in vanilla JS. Every WebSocket message triggers a cascade of DOM reads and writes — `getElementById`, `textContent`, `classList.add`, `appendChild`, `removeChild`. After six months of feature work, the update logic is spread across 20 event handlers. Adding a new widget type requires tracing through all the mutation sequences to find the one you're supposed to modify. A seemingly safe change — "add a CSS class to the error state" — accidentally removes a different state's DOM nodes because two mutation sequences intersect. The fix cascades into a rewrite of the widget system.

**The Virtual DOM isn't primarily about speed — it's about *programming model*.** The abstraction that lets you describe UI declaratively is the win. The diffing algorithm just makes it fast enough to be practical. A hand-optimized imperative DOM script will always be faster than React's diff-and-patch cycle for the specific case it was written for. React pays the cost of generality so you don't have to hand-optimize every UI path.

---

### Rendering Pipeline — pure then effectful, not interleaved

An update produces two kinds of work: pure computation (running component functions, building element trees, diffing) and side-effectful DOM mutations. If these are interleaved, you can't pause work, you can't retry failed work, and you can't prioritize urgent updates over background ones.

React separates them into two phases. [^2] The **render phase** calls your components, builds the new Virtual DOM, and diffs it against the previous one. This is pure computation — no DOM touched — and it can be interrupted. The **commit phase** applies the minimal set of DOM mutations and schedules effects. This is synchronous and uninterruptible.

```
State change → render phase (diff) → commit phase (DOM mutations) → browser paint
```

Hooking a data-fetching effect directly inside a render function (`useState` + inline fetch) makes the fetch fire during the render phase — potentially on every render, even if the previous render never committed. The app sends 10 API requests for every one that actually reaches the user, burning through API rate limits and the user's mobile data plan. If the render is interrupted by a higher-priority update, those fetches repeat on the next render attempt.

**The two-phase model enables concurrent features** — interruptible rendering, transitions, Suspense. If React committed DOM mutations as soon as component A finished rendering, before component B started, an error in B would leave the DOM in an inconsistent state — half-updated, with no clean rollback path. The separation is a reliability guarantee, not architectural pedantry.

---

### Reconciliation — heuristic O(n), not general O(n³)

The general tree-diffing problem — comparing every node to every other node — is O(n³). For a UI tree with 1000 nodes, that's a billion comparisons. Rebuilding the entire DOM on every state change destroys ephemeral browser state: scroll position, focus, input cursor position, video playback progress, text selection.

React reduces this to O(n) with three heuristics grounded in real UI behavior: [^3]

1. **Elements of different types** produce a full subtree rebuild. A `<div>` becoming a `<section>` means the whole subtree is new — React doesn't try to reuse nodes across type changes.
2. **Same element type** — React keeps the DOM node and updates only the changed attributes and children, recursing into the subtree.
3. **Keys** — when comparing lists, `key` props identify which children correspond across renders. Without keys, React falls back to index-based matching, which is wrong for insertions, removals, and reorders.

```javascript
function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

`key={Math.random()}` produces completely new keys on every render. React sees every child as new and every previous child as deleted — the entire list is destroyed and re-created on every state change. All input fields lose their cursor position. All video elements restart. All scroll positions reset. The user types a character, the list re-renders, focus is lost, and the next keystroke lands nowhere. The user reloads the page thinking the app is broken — but it's just the key.

Using array index as the key for a reorderable list (`key={index}`) shifts all existing items' indices when inserting at position 0 — React thinks every item changed identity. It re-creates every child instead of inserting one and shifting the rest. The operation is O(n) DOM mutations when it should be O(1), and the browser re-layouts the entire list.

**Keys are mandatory for lists where items can be inserted, removed, reordered, or filtered.** For static lists that never change, index keys are harmless — but the day someone adds "move up" or "delete" to that list, the index key becomes a bug. Always use stable, unique, and predictable keys. The 30 seconds spent adding `key={item.id}` early saves hours of debugging identity bugs.

---

### Fiber Architecture — interruptible work units, not recursive stack

The old reconciliation algorithm (React ≤15) recursed through the component tree synchronously. A function component at depth 20 calls its child, which calls its child, which calls its child — the entire call stack fills up, and nothing yields until the root returns. A deeply nested tree with 500 components could block the main thread for 200ms. The browser can't paint, scroll, or respond to clicks during that time. The user sees a frozen screen, types a character, and nothing happens for half a second.

Fiber (React 16+) replaced the recursive walk with a linked-list traversal. [^4] Each component instance is a **Fiber node** — a plain object with pointers to its child, sibling, and parent fiber, plus the component's props, state, pending work, and a link to its previous version (the "alternate"). React walks this linked list one node at a time, and after processing each node, it can check: "is there higher-priority work to do? Should I yield to the browser?" This is **time slicing**.

```javascript
// Simplified Fiber node
{
  tag: HostComponent,        // function component, class, host DOM, etc.
  type: "div",               // the component or DOM tag
  stateNode: divElement,     // reference to the real DOM node
  child: fiberNode,          // first child fiber
  sibling: fiberNode,        // next sibling fiber
  return: parentFiberNode,   // parent fiber (execution returns here)
  memoizedState: null,       // linked list of hook state
  memoizedProps: {},         // props from last committed render
  pendingProps: {},          // new props from the current render
  effectTag: "PLACEMENT",    // DOM operation needed (PLACEMENT, UPDATE, DELETION)
  alternate: previousFiber,  // the fiber from the previous tree (double-buffering)
}
```

A comment thread with 200 nested replies (a recursive structure) exposes synchronous rendering limits. Old React walked all 200 levels in one synchronous pass. A state update triggered by typing into the reply box blocks the input handler — the next keystroke is queued, not processed, while the full 200-node render runs. The user perceives the app as laggy even though the total computation is only 30ms — it's 30ms of uninterrupted blocking. Fiber splits that work into ~5ms units, yielding to the browser between them. The keystroke is processed after the first yield, the input updates instantly, and the remaining 25ms of render work runs incrementally — invisible to the user.

**Fiber is invisible to application code but it's the foundation for every concurrent feature in React 18+.** `useTransition`, `Suspense`, `useDeferredValue`, streaming server rendering — none of these exist without interruptible work units. Fiber also serves as the persistent data structure for hooks state: each hook lives on `fiber.memoizedState` as a linked list node, matched by call order across renders.

---

### Batching — one commit per event, not per setState

If every `setState` call triggered an immediate re-render, a click handler with three state updates would trigger three separate render passes. Each pass builds a Virtual DOM, diffs it, commits mutations, and potentially triggers layout. For a handler that updates a form's dirty flag, the submit button's loading state, and the validation errors, the user would see the button flash three times.

React collects all state updates from the same event handler and flushes them in a single render pass. Since React 18, this batching happens everywhere — not just in React event handlers, but in promises, `setTimeout`, native event listeners, and microtasks. [^5]

```javascript
// React 18 — all contexts batched
fetch("/data").then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  setStatus("loaded");
  // 1 render pass, not 3
});
```

Upgrading from React 17 to React 18 changes batching behavior. A `fetch` callback that calls setState three times rendered three times in React 17 (no batching outside event handlers), but renders once in React 18. If a component's effect depended on the intermediate states — after `setCount` but before `setFlag` — that effect no longer fires because there is no intermediate render. The component goes directly from `{count: 0, flag: false}` to `{count: 1, flag: true}`. The developer who relied on the intermediate render gets a subtle behavioral change during upgrade, caught only by auditing every non-event-handler state update.

**`flushSync` is the escape hatch** — it forces immediate synchronous commit of pending state updates. Use it sparingly: only when you need the DOM to reflect a state change before the next line of code executes (e.g., measuring a newly-mounted element). Overusing it defeats batching and causes unnecessary render passes.

---

### Component Lifecycle — effect after paint, not during render

Components need to run side effects at specific points — when they mount (fetch data, subscribe to an event bus, start a timer), when they update (react to prop changes, re-subscribe with new parameters), when they unmount (clean up subscriptions, cancel timers). These must happen in a predictable order relative to the browser paint cycle.

React's lifecycle model is:

```
[Render phase] → [DOM mutation] → [Browser paint] → [useEffect runs]
```

The **render phase** is pure — no side effects, no DOM reads. The **commit phase** applies DOM mutations synchronously. After the browser paints the new DOM, React flushes scheduled effects. [^6] `useLayoutEffect` runs synchronously after DOM mutations but **before** the browser paint [^7] — use it when you need to measure the DOM or make visual adjustments that the user shouldn't see as intermediate states.

```javascript
function Profile({ userId }) {
  useEffect(() => {
    // Runs AFTER paint — safe for data fetching, analytics, logging
    fetchProfile(userId);
    return () => { /* cleanup runs before next effect or unmount */ };
  }, [userId]);

  return <div>{userId}</div>;
}
```

Measuring a DOM element's dimensions in `useEffect` works — `useEffect` runs *after* paint, so the DOM has been updated and dimensions are available. Measuring during the render phase returns stale values because the current values haven't been committed yet — the measurement is always one render behind. `useLayoutEffect` measures before the paint, so adjustments happen in the same frame and the user never sees a flash.

Subscribing to an event bus in `useEffect` without a cleanup function leaks subscriptions. When a parent unmounts and remounts the component on every render (changing the key prop, for example), subscriptions accumulate. After 10 renders, the component holds 10 subscriptions, each firing for every event, calling setState 10 times, triggering 10 renders per event. The app slows to a crawl as subscription counts grow linearly with time. Always return a cleanup function from `useEffect`.

**Strict Mode** double-invokes reducers and effects in development to surface these bugs [^8]:

```javascript
function DevCounter() {
  const [count, setCount] = useState(0);
  // count: 0 → 1 → 0 → 1 during mount in development
  // If your initializer has a side effect (e.g., logging, pushing to an array),
  // Strict Mode reveals it immediately
}
```

**Function components replaced class lifecycle methods with hooks.** `useEffect` covers `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in a single API. `useLayoutEffect` covers `componentDidMount`/`componentDidUpdate` before paint. Hooks colocate related logic — a subscription's setup and teardown are in one function, not split across `componentDidMount` and `componentWillUnmount` in different parts of the class definition.

---

### Hooks — composable state, not scattered lifecycle methods

Before hooks, sharing stateful logic between components required patterns with structural costs: higher-order components (HOCs) wrapped your component in layers of indirection; render props turned children into functions; mixins (React's early experiment) caused naming collisions and implicit dependencies. A component using three HOCs had three wrapper components in the React devtools, three sets of prop name collisions to debug, and three extra tree levels to traverse.

Hooks let you extract stateful logic into composable functions that live inside your component — no wrapper components, no prop forwarding, no indirection. [^9]

```javascript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return isOnline;
}

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? "Online" : "Offline"}</div>;
}
```

Eight lines of reusable stateful logic. No wrapper component, no prop forwarding, no tree structure change.

#### useState

A component needs to remember values between renders — form input text, toggle state, API response data. Local variables reset on every render. Module-level globals are shared across all component instances. Class components stored state in `this.state`, but function components have no `this`.

`useState` gives function components persistent state that lives on the fiber's `memoizedState`. [^10] The setter can take a new value or an updater function: `setCount(c => c + 1)`. Setting the same value (`Object.is` comparison) bails out — React skips re-rendering the component and its children.

```javascript
const [state, setState] = useState(() => computeExpensiveInitialValue());
```

Storing deeply nested state in a single `useState` and updating with `setState({ ...state, field: newValue })` spreads the entire state object on every update — including nested fields that didn't change. The spread creates new object references for every nested property, and any child component that checks for prop changes sees every field as "changed" (new reference) and re-renders. A multi-select dropdown with 50 items updates all 50 on every toggle. Split logically independent state into separate `useState` calls, or use `useReducer` for complex interdependent state.

The fiber's `memoizedState` stores a linked list of hook nodes. Each node holds the current value and a queue of pending updates. On render, React flushes the queue and computes the new value. Hook order must be stable across renders — this is why hooks can't be inside conditions.

**Split state by *what changes together*.** Form fields that update independently should be separate `useState` calls. State that always changes together (e.g., `{ x, y }` coordinates) can stay in one object. If you frequently update one field without the others, split it.

#### useEffect

Side effects (data fetching, subscriptions, DOM measurement, timers, analytics) must not run during the render phase — they would block the browser paint and could fire for renders that never commit. They need a reliable post-paint execution slot.

`useEffect` registers a callback that runs after the browser paints. The return value is a cleanup function that runs before the next effect (or on unmount). The dependency array tells React when to re-run: missing deps means after every render; empty deps `[]` means once on mount; `[a, b]` means when `a` or `b` changes.

```javascript
useEffect(() => {
  // effect
  return () => { /* cleanup */ };
}, [dependencies]);
```

Inside a component with changing URL props, `useEffect(() => { fetch(url) }, [])` runs once on mount and never again. The URL changes, but the data stays stale. The component shows old data for the new URL until the user manually refreshes. Include `url` in the dependency array.

A **stale closure** traps a captured value. `useEffect(() => { const timer = setInterval(() => { setCount(count + 1) }, 1000) }, [])` captures `count === 0`, so the interval callback always sees `count === 0`. [^25] The timer increments 0 to 1, then 0 to 1, then 0 to 1 — the UI shows 1 forever. Use the functional updater `setCount(c => c + 1)` (which doesn't depend on the closure's count) or include `count` in the dependency array (which re-creates the interval on every tick — less efficient but correct).

**`useEffectEvent` (React 19):** Extracts non-reactive logic from the effect body so it can change without triggering a re-run. [^27] Useful for reading the latest props/state inside an effect without listing them in deps.

**Not all code that runs after render needs `useEffect`.** Event handlers don't belong in effects — handle clicks in the `onClick` prop directly. Computations based on props/state don't belong in effects — compute them during render (with `useMemo` for expensive ones). Effects are for synchronization: keeping external systems (fetch, DOM, subscriptions) aligned with your React state.

#### useRef

Sometimes you need a mutable value that survives re-renders but *doesn't cause a re-render when it changes*. Storing a DOM node reference, a timer ID, the previous value of a prop, or an instance variable — `useState` is wrong for these because setting state always triggers a re-render.

`useRef` returns a mutable object whose `.current` property persists across renders [^11]:

```javascript
function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  const start = () => { intervalRef.current = setInterval(tick, 1000); };
  const stop = () => { clearInterval(intervalRef.current); };

  useEffect(() => { videoRef.current?.play(); }, [src]);

  return <video ref={videoRef} src={src} />;
}
```

Reading `videoRef.current.width` during the render phase returns stale values — the DOM hasn't been committed yet, so `current` still points to the previous render's DOM node. The width from the previous render is used instead of the new one. Measure in `useLayoutEffect` or `useEffect`, never during render.

`useRef({ current: initialValue })` uses the same underlying mechanism as `useState`, but React never schedules a re-render when `.current` is mutated.

**Only reach for `useRef` when you'd never want a re-render on change.** If the UI should reflect the value, use `useState`. If the value is internal bookkeeping (timer ID, subscription handle, previous value for comparison), `useRef` is the right tool.

#### useContext

Prop drilling — passing `user` through 10 layers of components that don't use it just to reach the one that renders the avatar — creates tight coupling between distant parts of the tree. Every intermediate re-renders when the prop changes, even if its own output is identical.

Context broadcasts a value to all descendants without threading it through every intermediate component [^12]:

```javascript
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

An inline context value `value={{ theme, setTheme }}` creates a new object reference on every provider re-render — all consumers re-render, even if `theme` and `setTheme` haven't changed. For a provider at the root of an app with 100 consumer components, every provider re-render cascades to all 100. Wrap the value in `useMemo` or split data and dispatch into separate contexts.

Wrapping the entire app in a single context store (like Redux-in-Context) causes every consumer to re-render on every state change — regardless of which slice of state they actually read. This is the **context re-render problem**. Split contexts by data domain (theme context, auth context, user preferences context) or use external state management (Zustand, Jotai, Redux) that supports selector-based subscriptions.

**Context is for *dependency injection*, not global state.** Use it for values that rarely change (theme, locale, auth token) and are read by many components. Avoid it for frequently-updating values read by a few components — every consumer re-renders when the value changes. For frequent updates, use a library with selector-based subscriptions.

#### useReducer

Multiple state variables that change together, or transitions where the next state depends on the previous value in structured ways, lead to subtle bugs with `useState` — stale closures in effects, missed updates in intervals, inconsistent state when two fields must update atomically.

`useReducer` centralizes all state transitions into a pure function — the reducer [^13]:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: "increment" })}>{state.count}</button>;
}
```

Three separate `useState` calls for `isLoading`, `error`, and `data` in a data-fetching component create race conditions. A navigation fires a second request while the first is still in-flight. `setData(firstResponse)` fires, then `setData(secondResponse)` fires, then `setIsLoading(false)` fires — but `setIsLoading` was triggered by the first call's `.finally`. The UI shows "loaded" while displaying the stale first response, because the three state variables update independently and can interleave. With `useReducer`, the entire fetch outcome is a single dispatch: `dispatch({ type: "success", data })` or `dispatch({ type: "error" })`. The reducer handles both fields atomically — there is no intermediate state where `isLoading` is false but `data` is wrong.

`useState` is implemented on top of `useReducer`. `useState(initial)` is equivalent to `useReducer((prev, action) => action, initial)` — the reducer ignores the action type and just returns the new value.

**For simple state, use `useState`.** Use it for independent values (form inputs, toggles). Use `useReducer` when multiple state values change together, when the next state depends complexly on the previous state, or when you want to extract state logic for testing outside the component.

#### useMemo & useCallback

Expensive computations run on every render even when inputs haven't changed. Passing new function references as props on every render defeats `React.memo` and forces child re-renders.

```javascript
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.date - b.date);
}, [items]);

const onSelect = useCallback((id) => {
  selectItem(id);
}, [selectItem]);
```

Wrapping every function and computed value in `useMemo` and `useCallback` "just in case" backfires — the memoization overhead (comparing deps on every render, allocating closures) exceeds the cost of the computation it avoids. A `useCallback` wrapping a simple `() => {}` — which is faster to create than to compare — slows down the render for zero benefit. [^26] The React docs: "You should only use `useMemo` as a performance optimization. Not as a semantic guarantee." [^14]

`useCallback(fn, deps) === useMemo(() => fn, deps)` — they're the same primitive. Both compare deps with `Object.is` and return the previous value if deps haven't changed.

**Profile first before reaching for memoization.** Measure the render cost of the subtree. If re-rendering it is cheap (<1ms), `memo`/`useMemo`/`useCallback` add complexity for no gain. Only memoize when you've measured a measurable improvement.

#### useDebugValue

Labels custom hooks in React DevTools with a readable value:

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  useDebugValue(isOnline ? "Online" : "Offline");
  return isOnline;
}
```

Without `useDebugValue`, React DevTools shows the internal state of all hooks inside the custom hook — `useState`, `useEffect`, etc. — but the hook appears as an anonymous "Custom Hook" node. `useDebugValue` gives it a human-readable label.

---

## Hooks Rules

React matches state to hooks by their **call order** across renders, not by name or identifier. [^28] The first `useState` call in a component always accesses the first hook node on the fiber's `memoizedState` linked list. If a hook is called conditionally, every subsequent hook's state misaligns — the count hook reads the toggle's state, the effect hook reads the count's value, the ref hook reads the effect's cleanup function.

```javascript
function MyComponent({ flag }) {
  if (flag) {
    const [a] = useState(0); // ❌ Called only when flag is true
  }
  const [b, setB] = useState(0); // Position 1 when flag=false, position 2 when flag=true
}
```

A component that conditionally calls `useState` based on a prop — `if (props.isAdmin) { const [data, setData] = useState(null) }` — works in testing where `isAdmin` is always `true`. In production, a non-admin user triggers the component with `isAdmin = false`. The state for `data` is skipped, and every subsequent hook in the component — including an effect that fetches non-admin data — misaligns. The non-admin user sees no data, and the error is a silent misrender with no console warning because the values don't crash — they just point to the wrong state.

Two rules enforced by `eslint-plugin-react-hooks`:

1. **Only call hooks at the top level** — not inside conditions, loops, or nested functions.
2. **Only call hooks from React function components or custom hooks.**

---

### JSX — compiled HTML, not createElement chains

`React.createElement("div", { className: "container" }, React.createElement("h1", null, "Hello"))` is verbose, deeply nested, and looks nothing like the HTML output. The `className`, `children`, `key`, and `ref` spread across arguments with no visual structure.

JSX lets you write HTML-like syntax that compiles to `createElement` calls:

```javascript
// JSX
<div className="container">
  <h1>Hello</h1>
</div>

// Compiled (classic runtime)
React.createElement("div", { className: "container" },
  React.createElement("h1", null, "Hello")
);

// Compiled (automatic runtime, React 17+)
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
_jsxs("div", { className: "container", children: [
  _jsx("h1", { children: "Hello" })
]});
```

Before React 17, using JSX without importing React crashed compilation: "React is not defined" — even though React was never directly referenced in the source code. The developer had to know that JSX compiles to `React.createElement` and add `import React from 'react'` just to make the renderer work. React 17's automatic runtime eliminates this — `jsx` is imported automatically.

**JSX is optional.** `React.createElement` (or `h`/`jsx` for other libraries) works directly. Frameworks like SolidJS and Preact use tagged template literals or `h` functions instead. JSX is a syntactic convenience, not a technical requirement.

---

### Error Boundaries — graceful fallback, not blank white page

Without error boundaries, an uncaught JavaScript error in a React component causes the entire tree to unmount. The user sees a blank white page. No fallback, no retry, no recovery — just `Uncaught TypeError: Cannot read properties of undefined` in the console and a silent whiteout.

Error boundaries are class components that catch errors thrown during render, in lifecycle methods, and in constructors of the entire tree below them [^16]:

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: null };

  static getDerivedStateFromError(error) {
    return { hasError: error };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}
```

A single error boundary wrapping the entire app collapses everything on any runtime error. An error in the sidebar's user avatar component brings down the header, main content, footer, and navigation alongside the sidebar. Wrap each major section (sidebar, main content, header) in its own error boundary so a crash in one doesn't take down the others. A crash in the sidebar leaves the main content visible and functional.

Error boundaries do **not** catch:
- Event handler errors (use `try/catch` inside handlers)
- Async errors (use `try/catch` in effects)
- Server-side rendering errors
- Errors in the error boundary itself

**Error boundaries are a production reliability feature, not a dev convenience.** In development, the React error overlay is more useful. Error boundaries should include a "try again" button that remounts the subtree — `key={Date.now()}` on the children forces React to unmount and remount, giving the component a fresh start.

---

### Portals — out of CSS context, not out of React tree

Modals, tooltips, dropdowns, and toasts need to render outside their parent's CSS stacking context — `overflow: hidden` on a parent clips the modal; `z-index` stacking is unpredictable when the modal's parent is deep in the DOM; `transform` applies a new stacking context. But they should still behave as React children: context providers above the portal should be visible, events should bubble through the portal to ancestors in the React tree.

`createPortal` renders children into a different DOM node while preserving React tree semantics [^17]:

```javascript
import { createPortal } from "react-dom";

function Modal({ children, open }) {
  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop">{children}</div>,
    document.getElementById("modal-root")
  );
}
```

Rendering a modal as a direct child of the trigger button without a portal — `<button onClick={open}>Open<Modal /></button>` — makes it inherit the button's CSS context. If the button has `overflow: hidden` (common in toolbar layouts), the modal is clipped to the button's bounds. The modal appears as a tiny sliver of content behind the button. The developer adds `z-index: 9999` to the modal, which fixes nothing because `z-index` is scoped to the nearest stacking context. Portal the modal to `document.body` where no parent stacking context interferes.

**A portal only changes the DOM parent, not the CSS.** You still need `position: fixed` or `absolute` with appropriate coordinates. Portals are not a positioning mechanism — they're a CSS stacking context escape hatch.

---

### Concurrent Features — interruptible rendering, not janky updates

Before React 18, every state update committed with equal urgency. A heavy render (filtering 10,000 items on every keystroke) blocked the main thread — the text input lagged, scroll position jumped, buttons became unresponsive. The user typed "hello" and saw "h" then after 400ms "hello" appeared. The intermediate keystrokes were queued but the render couldn't be interrupted to process them.

React 18 introduced concurrent features that let you distinguish urgent updates (the input must feel instant) from non-urgent updates (the results list can arrive a frame later). [^5]

#### Transitions — urgent input, non-urgent results

`useTransition` marks a state update as interruptible [^18]. If a higher-priority update arrives (a keystroke), the in-progress transition is discarded and React processes the urgent update immediately:

```javascript
function SearchPage() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value);                       // Urgent: update input
    startTransition(() => {
      setSearchQuery(e.target.value);               // Non-urgent: filter results
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <SearchResults query={searchQuery} />
    </>
  );
}
```

With `useTransition` on an expensive filter operation, the input stays responsive even during re-renders — the text updates immediately, and the filtered results appear when the render finishes. If the user types three characters in rapid succession, React discards the first two transition renders and commits only the third. The user sees "abc" in the input and one set of filtered results, not three sequential updates.

**Only use `startTransition` for updates that can be delayed without breaking the user's mental model.** Navigation, filtering, and background data fetching are good candidates. Animations, form validation on submit, and toast notifications should always commit without delay.

#### useDeferredValue — defer based on incoming value, not update origin

When the value comes from outside (parent props, external store, URL params), you can't wrap the update in `startTransition`. `useDeferredValue` produces a "lagged" copy of the value that React can defer rendering [^19]:

```javascript
function SearchPage({ query }) {
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <SearchResults query={deferredQuery} />
      {isStale && <div>Updating...</div>}
    </>
  );
}
```

#### Suspense — loading state at the component level, not the page level

Fetch-on-render (`useEffect` + fetch in every component) causes waterfall loading — component A fetches data, renders, then component B fetches data, renders. Each level of nesting adds a round-trip. The user sees spinners cascading down the page one at a time.

Suspense lets each component declare its data dependency declaratively, and React coordinates the loading state at the nearest Suspense boundary [^20]:

```javascript
function ProfilePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProfileDetails />
      <Suspense fallback={<Spinner />}>
        <ProfilePosts />
      </Suspense>
    </Suspense>
  );
}
```

Nesting Suspense boundaries inside each page section enables partial loading — a slow-loading comments section shows a spinner while the rest of the page (profile info, posts) is already interactive. The user can read the profile and scroll through posts while comments are still loading, instead of waiting for everything or nothing.

#### React Server Components — server data access, zero client bundle for data

Traditional React apps ship all data-fetching logic to the browser. Database queries run through an API layer (Next.js API routes, Express endpoints, BFF), serialized as JSON, sent over the network, deserialized, and stored in state. Every page load requires at least one round-trip to the server just to get the data.

Server Components run **on the server**, never on the client. [^21] They can directly access databases, filesystems, and internal APIs — no API route, no serialization layer, no network hop:

```javascript
// NoteList.server.js — never shipped to the browser
async function NoteList() {
  const notes = await db.query("SELECT * FROM notes WHERE public = true");
  return (
    <ul>
      {notes.map(note => <li key={note.id}>{note.title}</li>)}
    </ul>
  );
}

// LikeButton.client.js — interactive, shipped to browser
"use client";
function LikeButton({ noteId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "❤️" : "🤍"}</button>;
}
```

**Server Components are fundamentally different from server-side rendering.** SSR renders HTML on the server for the initial page load, then ships JavaScript for interactivity — every subsequent navigation runs on the client. Server Components can run on every request (or be cached) and their output is serialized as a stream of React elements, not HTML. They compose with Client Components — a Server Component can import a Client Component and pass it serializable props. SSR and Server Components are complementary, not competing.

---

## Reference

### Rendering Mechanics

A component re-renders when:
1. **State changes** — via `useState` setter or `useReducer` dispatch.
2. **Parent re-renders** — parent passes new props (even if props didn't "change" by reference, unless memoized).
3. **Context changes** — context value reference changes and the component consumes it.

A component skips rendering (bails out) when:
1. All state updates produce the same value (`Object.is`).
2. The component is wrapped in `React.memo` and props haven't changed (shallow compare).
3. The component returned by parent is the same element reference.

```javascript
const MemoizedChild = React.memo(function Child({ name }) {
  return <div>{name}</div>;
});
```

To opt out of React 18's automatic batching: `flushSync(() => setState(...))`. [^24]

### State Management Patterns

| Pattern | Scope | When to use |
|---|---|---|
| Local state (`useState`) | Single component | Form inputs, toggles, UI state |
| Lifted state | Parent → children via props | Shared state between siblings |
| Context | Subtree | Theme, locale, auth — rarely-changing values |
| External store (Zustand, Jotai, Redux) | App-wide | Complex global state, cross-cutting concerns |

### Context + useReducer Pattern

Separating data and dispatch into two contexts prevents unnecessary re-renders — components that only dispatch don't re-render when state changes:

```javascript
const TodoContext = createContext(null);
const TodoDispatchContext = createContext(null);

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  return (
    <TodoContext.Provider value={todos}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}
```

### Performance

**`React.memo`** — prevents re-renders when props haven't changed (shallow comparison). [^22] Defeated by inline function/object props (use `useCallback`/`useMemo` to stabilize references).

**`useMemo`** — memoizes computed values: `const sorted = useMemo(() => sort(items), [items])`.

**Code splitting** — `React.lazy` + `Suspense` loads components on demand [^23]. The initial bundle ships only what's needed for the first screen:

```javascript
const HeavyComponent = lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Virtualization** — render only visible rows for long lists:

```javascript
import { FixedSizeList } from "react-window";

function VirtualList({ items }) {
  return (
    <FixedSizeList height={400} itemCount={items.length} itemSize={35}>
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </FixedSizeList>
  );
}
```

---

## References

[^1]: React docs — "Describing the UI" — [react.dev](https://react.dev/learn/describing-the-ui)
[^2]: React docs — "Render and Commit" — [react.dev](https://react.dev/learn/render-and-commit)
[^3]: React docs — "Reconciliation" — [react.dev](https://react.dev/learn/preserving-and-resetting-state)
[^4]: Acdlite — "React Fiber Architecture" (GitHub) — [github.com/acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)
[^5]: React 18 release notes — "Automatic Batching" — [react.dev](https://react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching)
[^6]: React docs — `useEffect` — [react.dev](https://react.dev/reference/react/useEffect)
[^7]: React docs — `useLayoutEffect` — [react.dev](https://react.dev/reference/react/useLayoutEffect)
[^8]: React docs — `StrictMode` — [react.dev](https://react.dev/reference/react/StrictMode)
[^9]: React docs — "Using Hooks" (intro) — [react.dev](https://react.dev/reference/react)
[^10]: React docs — `useState` — [react.dev](https://react.dev/reference/react/useState)
[^11]: React docs — `useRef` — [react.dev](https://react.dev/reference/react/useRef)
[^12]: React docs — `useContext` — [react.dev](https://react.dev/reference/react/useContext)
[^13]: React docs — `useReducer` — [react.dev](https://react.dev/reference/react/useReducer)
[^14]: React docs — `useMemo` — [react.dev](https://react.dev/reference/react/useMemo)
[^15]: React docs — `useCallback` — [react.dev](https://react.dev/reference/react/useCallback)
[^16]: React docs — "Error Boundaries" — [react.dev](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
[^17]: React docs — `createPortal` — [react.dev](https://react.dev/reference/react-dom/createPortal)
[^18]: React docs — `useTransition` — [react.dev](https://react.dev/reference/react/useTransition)
[^19]: React docs — `useDeferredValue` — [react.dev](https://react.dev/reference/react/useDeferredValue)
[^20]: React docs — `<Suspense>` — [react.dev](https://react.dev/reference/react/Suspense)
[^21]: React docs — "Server Components" — [react.dev](https://react.dev/reference/rsc/server-components)
[^22]: React docs — `memo` — [react.dev](https://react.dev/reference/react/memo)
[^23]: React docs — `lazy` — [react.dev](https://react.dev/reference/react/lazy)
[^24]: React docs — `flushSync` — [react.dev](https://react.dev/reference/react-dom/flushSync)
[^25]: Dan Abramov — "A Complete Guide to useEffect" — [overreacted.io](https://overreacted.io/a-complete-guide-to-use-effect/)
[^26]: Dan Abramov — "Before You memo()" — [overreacted.io](https://overreacted.io/before-you-memo/)
[^27]: React docs — `useEffectEvent` (experimental) — [react.dev](https://react.dev/reference/react/experimental_useEffectEvent)
[^28]: React docs — "Rules of Hooks" — [react.dev](https://react.dev/reference/rules/rules-of-hooks)

## Key Takeaways

- React re-renders are cheap in isolation — the cost comes from the subtree that re-renders. Profile before optimizing.
- Hook order is inviolable — no conditions, no loops around hooks. The linter enforces this; don't suppress it.
- `useMemo`/`useCallback`/`React.memo` are optimizations, not guarantees. Profile first, memoize second.
- Keys must be stable, unique, and predictable among siblings. `key={index}` is only safe for static, non-reorderable lists.
- Effects run *after* the browser paints. Measure the DOM in `useLayoutEffect` if you need synchronous access before paint.
- React 18 batches all updates. Use `useTransition` to keep the UI responsive during expensive state updates.
- Server Components let you fetch data on the server — no API route, no useEffect, no loading states for initial data.
- Error boundaries protect subtrees, not the whole app. Wrap each major section independently.
