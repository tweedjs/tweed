.PHONY: all
all: test build

.PHONY: build
build: webpack

.PHONY: webpack
webpack: babel
	webpack

.PHONY: babel
babel:
	babel src \
		--out-dir dist \
		--copy-files

.PHONY: test
test: standard jest

.PHONY: standard
standard:
	standard

.PHONY: jest
jest:
	jest
