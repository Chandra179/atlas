.PHONY: build deploy dev og-image

build: og-image
	npx astro build && npx pagefind --site dist

dev:
	npx astro dev

deploy: build
	npx wrangler deploy

og-image:
	node scripts/generate-og-image.mjs
