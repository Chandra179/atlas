.PHONY: build deploy dev og-image optimize-images

build: og-image optimize-images
	npx astro build && npx pagefind --site dist

dev:
	npx astro dev

deploy: optimize-images build
	npx wrangler deploy

og-image:
	node scripts/generate-og-image.mjs

optimize-images:
	node scripts/optimize-images.mjs
