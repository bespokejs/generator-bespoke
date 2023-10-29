# Bespoke.js Presentation Generator

[![Build Status](https://github.com/bespokejs/generator-bespoke/workflows/CI/badge.svg)](https://github.com/bespokejs/generator-bespoke/actions)

A [Yeoman](https://yeoman.io) generator that scaffolds a [Bespoke.js](https://markdalgleish.com/projects/bespoke.js) presentation project.

## Features

The boilerplate project this generator creates includes a [Gulp](https://gulpjs.com) build system, a preview server with [LiveReload](https://livereload.com), and a [GitHub Pages](https://pages.github.com) deployment task.
The project is also setup to perform [Stylus](https://stylus-lang.com/) compilation and, optionally, [Pug (formerly Jade)](https://pugjs.org) or [AsciiDoc](https://github.com/asciidoctor/asciidoctor-bespoke) conversion to HTML, depending on the templating engine you chose.

The following [Bespoke.js plugins](https://github.com/bespokejs/bespoke#plugins) are always included by default:

- [bespoke-classes](https://github.com/bespokejs/bespoke-classes)
- [bespoke-nav](https://github.com/opendevise/bespoke-nav)
- [bespoke-scale](https://github.com/bespokejs/bespoke-scale)
- [bespoke-fullscreen](https://github.com/opendevise/bespoke-fullscreen)
- [bespoke-overview](https://github.com/opendevise/bespoke-overview)
- [bespoke-bullets](https://github.com/bespokejs/bespoke-bullets)
- [bespoke-hash](https://github.com/bespokejs/bespoke-hash)
- [bespoke-extern](https://github.com/bespokejs/bespoke-extern)

Based on your responses to the prompts in the generator, your presentation may also include the following optional plugins:

- [bespoke-prism](https://github.com/opendevise/bespoke-prism)
- [bespoke-multimedia](https://github.com/opendevise/bespoke-multimedia)

## Prerequisites

In order to use this generator and the project it creates, you must satisify the following prerequisites:

- [Node.js](https://nodejs.org) >= 16
  * _We strongly recommend using [nvm](https://github.com/creationix/nvm) to manage your Node.js installation._
- Yeoman
  ```bash
  $ npm i -g yo
  ```

## Usage

Once you have satisfied the prerequisites, install the `generator-bespoke` package globally:

```bash
$ npm i -g generator-bespoke
```

You can verify the generator installed properly, and view its usage statement, by running:

```base
$ yo bespoke --help
```

The generator must be run from inside a project folder.
Therefore, to start, create a new directory for the project and switch to it:

```bash
$ mkdir presentation-hello-world
$ cd presentation-hello-world
```

Another approach is to first create an empty repository on GitHub, then clone and switch to it:

```bash
$ git clone git@github.com:<username>/presentation-hello-world.git
$ cd presentation-hello-world
```

The benefit of the clone workflow is that the generator will automatically populate the repository field in the generated package.json file.

> **IMPORTANT** If you plan to create an AsciiDoc-based presentation, be ready for the generator to execute the `bundle` command.
> This command installs the [Asciidoctor Bespoke](https://github.com/asciidoctor/asciidoctor-bespoke) gem and its dependencies.
> The gems are installed to the local _.bundle/gems_ directory.
>
> If you use RVM to manage Ruby, switch to your preferred Ruby version using `rvm use` (e.g., `rvm use 3.2.0`) **before** running the next command.
> You may also choose to declare your preferred Ruby version in the file named _.ruby-version_ at the root of the project.
>
> If you use a different Ruby selector, make sure your Ruby environment is prepared to run `bundle`.
>
> To disable this behavior, you can use the `--skip-install` switch.

Scaffold a new presentation using:

```bash
$ yo bespoke
```

If you want the generator to skip `npm i` (and also `bundle` for an AsciiDoc-based presentation), use the `skip-install` switch:

```bash
$ yo bespoke --skip-install
```

In this case, you'll be instructed to execute the the commands that the generator skipped.

Refer to the README at the root of the generated project for instructions on how to get started developing your new presentation.

## Presentation Workflow

All source files for the presentation reside in the `src` directory.

Build the presentation and start a local preview server using:

```bash
$ npx gulp serve
```

Once the server is running, you can view the slides by navigating to http://localhost:8080 in your browser.
The build will continue monitoring for changes, so you can work on the presentation and preview it in real time.

Build the presentation without starting the local preview server using:

```bash
$ npx gulp
```

The files are built into the _dist_ directory.
You can view the slides by navigating to _dist/index.html_ in your browser.

Compile and publish to GitHub Pages, assuming a git repo with `origin` pointing to GitHub, using:

```bash
$ npx gulp publish
```

## Generator Tests

Tests require Node.js >= 16.
Everything created by those tests (files and directories) is located in the user's temporary folder.

First, clone the git repository and switch to the project:

```bash
$ git clone git@github.com:bespokejs/generator-bespoke.git
$ cd generator-bespoke
```

If you're using nvm to manage your Node.js installation, switch to at least Node.js 4.4.

```bash
nvm use 16
```

Next, install the development dependencies into the project:

```bash
$ npm i
```

Finally, run the tests using:

```bash
npm t
```

The tests verify basic behaviour about the plugin, including:

* Checks that `yo bespoke` generates correct files for different templating options (Pug, AsciiDoc, HTML)
* Checks that after a `yo bespoke`, `npx gulp serve` provides a local server with a working Bespoke.js slide deck
* Checks that after a `yo bespoke`, `npx gulp build` generates correct files

## License

[MIT License](https://markdalgleish.mit-license.org)
