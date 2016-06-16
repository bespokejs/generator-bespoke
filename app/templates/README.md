# <%= title %>
> A [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) presentation, built with [generator-bespoke](https://github.com/markdalgleish/generator-bespoke)

## View slides locally

First, ensure you have the following installed:

1. [Node.js](http://nodejs.org)
2. [Gulp](http://gulpjs.com): `$ npm install -g gulp-cli`
<% if (useAsciiDoc) { -%>
3. [Ruby >= 2](https://www.ruby-lang.org/): `rvm use 2.3.1 --install`
4. [Bundler](http://bundler.io/): `gem install bundler`
<% } -%>

Then, install dependencies and run the preview server:

```bash
<% if (useAsciiDoc) { -%>
$ bundle install --path=.bundle/gems
<% } -%>
$ npm install
$ gulp serve
```
