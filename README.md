[![Build Status](https://img.shields.io/travis/markdalgleish/generator-bespoke/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/generator-bespoke)

# Bespoke.js Generator

A generator for [Yeoman](http://yeoman.io) that scaffolds a [Bespoke.js](http://markdalgleish.com/projects/bespoke.js) presentation.

The boilerplate project includes a [Gulp](http://gulpjs.com) build system, a preview server with [LiveReload](http://livereload.com) and a [GitHub Pages](http://pages.github.com) deployment task. You also have everything setup for [Stylus](http://stylus-lang.com/) compilation and [Pug (formerly Jade)](http://jade-lang.com) or AsciiDoc depending on the templating engine you chose.

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

> **IMPORTANT** If you're planning on creating an AsciiDoc-based presentation, be ready for the generator to execute the `bundle install` command. This command is used to install the [Asciidoctor Bespoke](https://github.com/asciidoctor/asciidoctor-bespoke) gem and its dependencies. The gems are installed inside the local *.bundle/gems* directory.
>
> If you use RVM to manage Ruby, switch to your preferred Ruby version using `rvm use 2.3.1` **before** running the next command. You might also want to set your preferred Ruby version in the file named `.ruby-version` at the root of the project. If you use a different Ruby selector, make sure your Ruby environment is prepared to run `bundle`.

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

## Tests

Tests require Node.js 4.4+.
Everything created by those tests (files and directories) is located in the user's temporary folder.

Current tests verify basic behaviour about the plugin :

* Check that `yo bespoke` generates correct files for different templating options (Pug, AsciiDoc, HTML)
* Check that after a `yo bespoke`, `gulp serve` provides a local server with a working Bespoke.js slide deck
* Check that after a `yo bespoke`, `gulp build` generates correct files

## License
[MIT License](http://markdalgleish.mit-license.org)
