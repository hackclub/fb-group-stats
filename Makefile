.PHONY: deploy

all: build 

build:
	mkdir -p dist/cloud
	cp -r public dist/
	cp .parse.* dist/ 
	perl -p -e 's/\$$\{([^}:]+)(:([^}:]+))?\}/defined $$ENV{$$1} ? $$ENV{$$1} : $$3/eg' cloud/main.js > dist/cloud/main.js

deploy: build
	cd dist && ls && parse deploy

clean:
	rm -rf dist