BASE_DIR := ../..

.PHONY: all build deploy git

all: build deploy git

build:
	npm run build

deploy:
	npm run deploy

git:
	cd $(BASE_DIR) && git add . && git commit -m "update" && git push