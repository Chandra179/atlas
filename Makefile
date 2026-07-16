.PHONY: all build deploy git

ASTRO_DIR := blog/astro
BASE_DIR := .

all: build deploy git

build:
	cd $(ASTRO_DIR) && npm run build

deploy:
	cd $(ASTRO_DIR) && npm run deploy

git:
	cd $(BASE_DIR) && git add . && git commit -m "update" && git push
