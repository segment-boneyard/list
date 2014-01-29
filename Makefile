
build: components lib/index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	@rm -fr build components

test: build
	@component test phantom

.PHONY: clean test
