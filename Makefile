REPORTER = dot

run:
	@NODE_ENV=run node server.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \

.PHONY: test run 
