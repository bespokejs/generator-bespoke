'use strict';

var util = require('util');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var sortedObject = require('sorted-object');
var _ = require('lodash');
var execSync = require('child_process').execSync;

var welcome = [
  "",
  chalk.cyan.bold("oooooooooo.                                          oooo                          o8o              "),
  chalk.cyan.bold("`888'   `Y8b                                         `888                          `\"'             "),
  chalk.cyan.bold(" 888     888  .ooooo.   .oooo.o oo.ooooo.   .ooooo.   888  oooo   .ooooo.         oooo  .oooo.o     "),
  chalk.cyan.bold(" 888oooo888' d88' `88b d88(  \"8  888' `88b d88' `88b  888 .8P'   d88' `88b        `888 d88(  \"8   "),
  chalk.cyan.bold(" 888    `88b 888ooo888 `\"Y88b.   888   888 888   888  888888.    888ooo888         888 `\"Y88b.    "),
  chalk.cyan.bold(" 888    .88P 888    .o o.  )88b  888   888 888   888  888 `88b.  888    .o .o.     888 o.  )88b     "),
  chalk.cyan.bold("o888bood8P'  `Y8bod8P' 8\"\"888P'  888bod8P' `Y8bod8P' o888o o888o `Y8bod8P' Y8P     888 8\"\"888P' "),
  chalk.cyan.bold("                                 888                                               888              "),
  chalk.cyan.bold("                                o888o                                          .o. 88P              "),
  chalk.cyan.bold("                                                                               `Y888P               "),
  "",
  chalk.green.bold("Thanks for choosing Bespoke.js for your presentation! :)   -@markdalgleish"),
  ""
].join('\n');

var mandatoryPlugins = [
  { name: 'classes', version: '^1.0.0', priority: 0 },
  { name: 'nav', version: '^1.0.2', priority: 1 },
  { name: 'scale', version: '^1.0.0', priority: 1 },
  { name: 'bullets', version: '^1.0.0', configValue: "'.build, .build-items > *:not(.build-items)'", priority: 1 },
  { name: 'hash', version: '^1.0.0', priority: 1 },
  { name: 'extern', version: '^1.0.0', configValue: "bespoke", priority: 2 },
];

var PUGJS = 'Pug (formerly Jade)';
var ASCIIDOC = 'AsciiDoc (using Asciidoctor Bespoke)';

var optionalPlugins = [
  {
    when: function (response) {
      return response.templatingLanguage !== ASCIIDOC;
    },
    name: 'prism',
    version: '^1.0.1',
    priority: 1,
    message: 'Will your presentation include code samples?',
    default: true
  },
  {
    name: 'multimedia',
    version: '^1.0.0',
    priority: 1,
    message: 'Would you like to use multimedia (audio, video, animated GIFs or SVGs)?',
    default: false
  },
];

var questions = [
  {
    name: 'title',
    message: 'What is the title of your presentation?',
    default: 'Hello World'
  },
  {
    name: 'templatingLanguage',
    message: 'Which templating language would you like to use?',
    type: 'list',
    choices: [PUGJS, ASCIIDOC, 'HTML'],
    default: PUGJS
  },
];

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);
    this.log(welcome);
  },

  prompting: function () {

    var prompts = []
      .concat(questions)
      .concat(optionalPlugins.map(function (plugin) {
        return {
          type: 'confirm',
          name: plugin.name,
          message: plugin.message,
          when: plugin.when,
          default: 'default' in plugin ? plugin['default'] : true
        };
      }));

    return this.prompt(prompts).then(function (answers) {

      var plugins = []
        .concat(mandatoryPlugins)
        .concat(optionalPlugins.filter(function (plugin) {
          return answers[plugin.name];
        }));

      this.selectedPlugins = _.sortBy(plugins, 'priority');

      this.selectedPlugins.forEach(function (plugin) {
        plugin.varName = _.camelCase(plugin.name);
      });

      optionalPlugins.forEach(function (plugin) {
        var usePluginName = 'usePlugin' + _.upperFirst(_.camelCase(plugin.name));
        this[usePluginName] = answers[plugin.name];
      }.bind(this));

      this.usePug = (answers.templatingLanguage === PUGJS);
      this.useAsciiDoc = (answers.templatingLanguage === ASCIIDOC);
      this.useHtml = (answers.templatingLanguage === 'HTML');

      this.title = answers.title;
      this.shortName = _.kebabCase(answers.title);

    }.bind(this));
  },

  configuring: function () {

    this.template('README.md', 'README.md');
    this.template('gulpfile.js', 'gulpfile.js');
    this.copy('_gitignore', '.gitignore');
    this.copy('_editorconfig', '.editorconfig');

    if (this.useAsciiDoc) {
      this.copy('Gemfile', 'Gemfile');
    }

    var packageSettings = {
      name: 'presentation-' + this.shortName,
      version: '0.0.0'
    };

    var devDependencies = {
      'bespoke': '^1.1.0',
      'browserify': '^13.0.1',
      'del': '^2.2.1',
      'gh-pages': '^0.11.0',
      'gulp': '^3.9.1',
      'gulp-autoprefixer': '^3.1.0',
      'gulp-connect': '^4.1.0',
      'gulp-csso': '^2.0.0',
      'gulp-plumber': '^1.1.0',
      'gulp-rename': '^1.2.2',
      'gulp-stylus': '^2.5.0',
      'gulp-uglify': '^1.5.4',
      'gulp-util': '^3.0.7',
      'normalizecss': '^3.0.0',
      'through': '^2.3.8',
      'vinyl-buffer': '^1.0.0',
      'vinyl-source-stream': '^1.1.0',
    };

    if (this.usePug) {
      devDependencies['gulp-pug'] = '^3.0.3';
    }

    if (this.useAsciiDoc) {
      devDependencies['gulp-exec'] = '^2.1.2';
    }

    this.selectedPlugins.forEach(function (plugin) {
      devDependencies['bespoke-' + plugin.name] = plugin.version;
    });

    packageSettings.devDependencies = sortedObject(devDependencies);

    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings);
  },

  writing: function () {

    if (this.usePug) {
      this.template('src/index.pug', 'src/index.pug');
    }
    if (this.useAsciiDoc) {
      this.template('src/index.adoc', 'src/index.adoc');
    }
    if (this.useHtml) {
      this.template('src/index.html', 'src/index.html');
    }

    this.copy('src/images/bespoke-logo.jpg', 'src/images/bespoke-logo.jpg');
    this.template('src/scripts/main.js', 'src/scripts/main.js');
    this.template('src/styles/main.styl', 'src/styles/main.styl');
  },

  install: function () {
    this.installDependencies({ bower: false });

    if (this.useAsciiDoc) {
      try {
        console.log([
          'I\'m also running ' +
          chalk.yellow.bold('bundle install --path=.bundle/gems') +
          ' for you to install the required Ruby gems.',
          'If this fails, try running the command yourself.',
          ''
        ].join('\n'));
        execSync('bundle install --path=.bundle/gems', { stdio: [0, 1, 2] });
      }
      catch (e) {

        var warning = [
          '',
          chalk.red.bold('Failed to install bundler and asciidoctor-bespoke, try these commands yourself:'),
          chalk.cyan.bold('bundle version || gem install bundler'),
          chalk.cyan.bold('bundle install --path=.bundle/gems'),
          ''
        ].join('\n');
        console.warn(warning);
      }
    }
  }
});
