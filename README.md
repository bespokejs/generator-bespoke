[![Build Status](https://img.shields.io/travis/markdalgleish/generator-bespoke/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/generator-bespoke)

# Bespoke.js Generator

A generator for [Yeoman](http://yeoman.io) that scaffolds a [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) presentation.

The boilerplate project includes a [Gulp](http://gulpjs.com) build system, a preview server with [LiveReload](http://livereload.com), [Pug (formerly Jade)](http://jade-lang.com) and [Stylus](http://learnboost.github.io/stylus) compilation, a [GitHub Pages](http://pages.github.com) deployment task, and .

Additionally, your generated presentation includes the following [Bespoke.js plugins](https://github.com/markdalgleish/bespoke.js#plugins) based on your configuration:

 - [bespoke-bullets](https://github.com/markdalgleish/bespoke-bullets)
 - [bespoke-scale](https://github.com/markdalgleish/bespoke-scale)
 - [bespoke-hash](https://github.com/markdalgleish/bespoke-hash)

## Usage

Assuming you have [Node.js](http://nodejs.org), install `generator-bespoke`:
```bash
$ npm install -g generator-bespoke
```

Make a new directory and `cd` into it:
```bash
$ mkdir presentation-hello-world
$ cd presentation-hello-world
```

Scaffold a new presentation:
```bash
$ yo bespoke
```

## Presentation workflow

All source files for the presentation reside in the `src` directory.

Start a local preview server:
```bash
$ gulp serve
```

Compile and deploy to GitHub Pages, assuming a git repo with `origin` pointing to GitHub:
```bash
$ gulp deploy
```

To manually deploy elsewhere, compile all assets into the `dist` directory:
```bash
$ gulp
```

## License
[MIT License](http://markdalgleish.mit-license.org)
