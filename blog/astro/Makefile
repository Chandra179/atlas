.PHONY: build deploy dev

build:
	npx astro build && npx pagefind --site dist

dev:
	npx astro dev

deploy: build
	npx wrangler deploy
