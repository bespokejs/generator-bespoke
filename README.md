# Bespoke.js Generator
[![Build Status](https://secure.travis-ci.org/markdalgleish/generator-bespoke.png?branch=master)](https://travis-ci.org/markdalgleish/generator-bespoke)

A generator for [Yeoman](http://yeoman.io) that scaffolds a [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) presentation.

The boilerplate project includes a [Grunt](http://gruntjs.com) build system, a preview server with [LiveReload](http://livereload.com), static asset compilation ([Jade](http://jade-lang.com), [Stylus](http://learnboost.github.io/stylus) and [CoffeeScript](http://coffeescript.org)), and a [GitHub Pages](http://pages.github.com) deployment task.

## Usage

Install Yeoman and `generator-bespoke`:
```bash
$ npm install -g yo generator-bespoke
```

Make a new directory and `cd` into it:
```bash
$ mkdir my-presentation && cd $_
```

Scaffold a new presentation:
```bash
$ yo bespoke
```

Install dependencies:
```bash
$ npm install && bower install
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

Many online presentation hosting services (e.g. [Speakerdeck](https://speakerdeck.com)) only support PDF uploads. To help with this, the default Bespoke.js theme includes print styles so slides print in landscape A4 with all items visible. For PDF printing, it is recommended that you use [Google Chrome](http://google.com/chrome).

If you're developing your own themes, open Chrome Developer Tools and set 'Emulate CSS media' to 'print' while you work.

## License
[MIT License](http://markdalgleish.mit-license.org)
