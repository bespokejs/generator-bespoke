# Bespoke.js Generator
[![Build Status](https://secure.travis-ci.org/markdalgleish/generator-bespoke.png?branch=master)](https://travis-ci.org/markdalgleish/generator-bespoke)

A [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) generator for [Yeoman](http://yeoman.io) that scaffolds a Bespoke.js presentation.

The boilerplate presentation includes a [Grunt](http://gruntjs.com) build system, a preview server with [LiveReload](http://livereload.com), static asset compilation ([Jade](http://jade-lang.com), [Stylus](http://learnboost.github.io/stylus) and [CoffeeScript](http://coffeescript.org)), and a [GitHub Pages](http://pages.github.com) deployment task.

## Usage

Install Yeoman:
```
npm install -g yeoman
```

Install `generator-bespoke`:
```
npm install -g generator-bespoke
```

Make a new directory and `cd` into it:
```
mkdir my-presentation && cd $_
```

Scaffold a new presentation:
```
yo bespoke
```

## License
[MIT License](http://markdalgleish.mit-license.org)
