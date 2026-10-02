.PHONY: all build deploy git

ASTRO_DIR := blog/astro
BASE_DIR := .

# git must run first: the prebuild sync stamps `modified` from the last
# commit, so committing before building is what puts the fresh updated date
# on the deployed page.
all:
	$(MAKE) git
	$(MAKE) build
	$(MAKE) deploy

build:
	cd $(ASTRO_DIR) && npm run build

deploy:
	cd $(ASTRO_DIR) && npm run deploy

git:
	cd $(BASE_DIR) && git add . && (git diff --cached --quiet || git commit -m "update") && git push
