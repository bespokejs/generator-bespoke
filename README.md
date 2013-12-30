[![Build Status](https://secure.travis-ci.org/markdalgleish/generator-bespoke.png?branch=master)](https://travis-ci.org/markdalgleish/generator-bespoke)

# Bespoke.js Generator

A generator for [Yeoman](http://yeoman.io) that scaffolds a [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) presentation.

The boilerplate project includes a [Grunt](http://gruntjs.com) build system, a preview server with [LiveReload](http://livereload.com), static asset compilation ([Jade](http://jade-lang.com), [Stylus](http://learnboost.github.io/stylus) and [CoffeeScript](http://coffeescript.org)), and a [GitHub Pages](http://pages.github.com) deployment task.

Your generated presentation optionally includes the following [Bespoke.js plugins](https://github.com/markdalgleish/bespoke.js#plugins):

 - [bespoke-bullets](https://github.com/markdalgleish/bespoke-bullets)
 - [bespoke-scale](https://github.com/markdalgleish/bespoke-scale)
 - [bespoke-hash](https://github.com/markdalgleish/bespoke-hash)
 - [bespoke-state](https://github.com/markdalgleish/bespoke-state)
 - [bespoke-progress](https://github.com/markdalgleish/bespoke-progress)
 - [bespoke-forms](https://github.com/markdalgleish/bespoke-forms)

## Usage

Assuming you have [Node.js](http://nodejs.org), install `generator-bespoke`:
```bash
$ npm install -g generator-bespoke
```

Make a new directory and `cd` into it:
```bash
$ mkdir my-presentation
$ cd my-presentation
```

Scaffold a new presentation:
```bash
$ yo bespoke
```

## Presentation workflow

All source files for the presentation reside in the `src` directory.

Start a local preview server:
```bash
$ grunt server
```

Compile and deploy to GitHub Pages, assuming a git repo with `origin` pointing to GitHub:
```bash
$ grunt deploy
```

To manually deploy elsewhere, compile all assets into the `public` directory:
```bash
$ grunt
```

## Creating a PDF or print version

Many online presentation hosting services (e.g. [Speaker Deck](https://speakerdeck.com)) only support PDF uploads. To help with this, the default Bespoke.js theme includes print styles so slides print in landscape A4 with all items visible. For PDF printing, it is recommended that you use [Google Chrome](http://google.com/chrome).

If you're developing your own themes, open Chrome Developer Tools and set 'Emulate CSS media' to 'print' while you work.

## License
[MIT License](http://markdalgleish.mit-license.org)
