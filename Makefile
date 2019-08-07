PATH        := ./node_modules/.bin:${PATH}
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')
GITHUB_PROJ := $(shell node -e 'process.stdout.write(require("./package.json").repository)')


demo:
	./support/demodata.js > demo/example.json
	jade demo/index.jade -P --obj demo/example.json
	stylus -u autoprefixer-stylus demo/assets/index.styl
	rm -rf demo/example.json

gh-pages:
	if [ "git branch --list gh-pages" ]; then \
		git branch -D gh-pages ; \
		fi
	git branch gh-pages
	git push origin gh-pages -f

publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git fetch ; git status | grep '^# Your branch' | wc -l` ; then \
		echo "Local/Remote history differs. Please push/pull changes." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}
	npm publish ${GITHUB_PROJ}/tarball/${NPM_VERSION}

todo:
	grep 'TODO' -n -r ./lib 2>/dev/null || test true


.PHONY: publish lint test gh-pages todo demo coverage
.SILENT: help lint test todo
