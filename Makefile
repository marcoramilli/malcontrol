REPORTER = dot

test:
	sudo node server.js
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \

	test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		--watch

.PHONY: test test-w
