test-cov:
	./node_modules/lab/bin/lab -c -r lcov > lcov.info

test:
	npm test

.PHONY: test-cov test
