'use strict';

var fs = require('fs');
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
  { name: 'classes', version: '~1.0', priority: 0 },
  { name: 'nav', version: '~1.0', priority: 1 },
  { name: 'fullscreen', version: '~1.0', priority: 1 },
  { name: 'scale', version: '~1.0', priority: 1, configValue: 'scaleMethod' },
  { name: 'overview', version: '~1.0', priority: 1, configValue: '{ columns: 4 }' },
  { name: 'bullets', version: '~1.1', configValue: "'.build, .build-items > *:not(.build-items)'", priority: 1 },
  { name: 'hash', version: '~1.1', priority: 1 },
  { name: 'extern', version: '~1.0', configValue: "bespoke", priority: 2 },
];

var PUGJS = 'Pug (formerly Jade)';
var ASCIIDOC = 'AsciiDoc (using Asciidoctor Bespoke)';

var optionalPlugins = [
  {
    when: function (response) {
      return response.templatingLanguage !== ASCIIDOC;
    },
    name: 'prism',
    version: '~1.0',
    priority: 1,
    message: 'Will your presentation include code samples?',
    default: true
  },
  {
    name: 'multimedia',
    version: '~1.1',
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
    name: 'license',
    message: 'Which license (by identifier) do you want to apply? [see https://spdx.org/licenses]',
    default: 'UNLICENSED'
  },
  {
    name: 'templatingLanguage',
    message: 'Which templating language would you like to use?',
    type: 'list',
    choices: [PUGJS, ASCIIDOC, 'HTML'],
    default: PUGJS
  },
];

var detectGitRepository = function () {
  let repo;
  if (fs.existsSync('.git/config')) {
    const lines = fs.readFileSync('.git/config', 'utf8').split(/\r?\n/);
    let startIndex = lines.indexOf('[remote "origin"]');
    if (startIndex > -1) {
      lines.slice(startIndex + 1, lines.length).every((line) => {
        if (line.startsWith("\t")) {
          if (line.startsWith("\turl = ")) {
            repo = line.slice(7, line.length).replace(/^git@([^:]+):/, 'https://$1/')
            return
          }
          return true
        }
      })
    }
  }
  return repo
}

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
      this.license = answers.license;

    }.bind(this));
  },

  configuring: function () {

    this.template('README.adoc', 'README.adoc');
    this.template('gulpfile.js', 'gulpfile.js');
    this.copy('_gitignore', '.gitignore');
    this.copy('_editorconfig', '.editorconfig');

    if (this.useAsciiDoc) {
      this.copy('Gemfile', 'Gemfile');
    }

    var packageSettings = {
      name: 'presentation-' + this.shortName,
      version: '1.0.0',
      license: this.license
    };

    var gitRepoUrl = detectGitRepository();
    if (gitRepoUrl) {
      packageSettings['repository'] = {
        type: 'git',
        url: gitRepoUrl
      };
    }

    var devDependencies = {
      'bespoke': '~1.1',
      'browser-pack-flat': '~3.5',
      'browserify': '~17.0',
      'del': '~6.1',
      'fancy-log': '~2.0',
      'gh-pages': '~6.0',
      'gulp': '~4.0',
      'gulp-autoprefixer': '~8.0',
      'gulp-chmod': '~3.1',
      'gulp-connect': '~5.7',
      'gulp-csso': '~4.0',
      'gulp-plumber': '~1.2',
      'gulp-rename': '~2.0',
      'gulp-stylus': '~3.0',
      'gulp-uglify': '~3.0',
      'normalizecss': '~3.0',
      'through': '~2.3',
      'vinyl-buffer': '~1.0',
      'vinyl-source-stream': '~2.0',
    };

    if (this.usePug) {
      devDependencies['gulp-pug'] = '~5.0';
    }

    if (this.useAsciiDoc) {
      devDependencies['gulp-exec'] = '~5.0';
    }

    this.selectedPlugins.forEach(function (plugin) {
      devDependencies['bespoke-' + plugin.name] = plugin.version;
    });

    packageSettings.devDependencies = sortedObject(devDependencies);

    packageSettings.engines = { 'node': '>=16.0.0' }

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
    this.template('src/styles/base.styl', 'src/styles/base.styl');
    this.template('src/styles/main.styl', 'src/styles/main.styl');
    this.template('src/styles/user.styl', 'src/styles/user.styl');
  },

  install: function () {
    this.installDependencies({ bower: false });

    if (this.useAsciiDoc) {
      if (!this.options['skip-install']) {
        try {
          console.log([
            'I\'m also configuring and running ' +
            chalk.yellow.bold('bundle') +
            ' for you to install the required Ruby gems.',
            'If this fails, try running the command yourself.',
            ''
          ].join('\n'));
          execSync('bundle config set --local path .bundle/gems', { stdio: [0, 1, 2] });
          execSync('bundle', { stdio: [0, 1, 2] });
        }
        catch (e) {
          var warning = [
            '',
            chalk.red.bold('Failed to install the required Ruby gems. Try running these commands yourself:'),
            chalk.cyan.bold('bundle version || gem install bundler'),
            chalk.cyan.bold('bundle config set --local path .bundle/gems'),
            chalk.cyan.bold('bundle'),
            ''
          ].join('\n');
          console.warn(warning);
        }
      }
      else {
        console.log([
          'Also run ' +
          chalk.yellow.bold('bundle config set --local path .bundle/gems') +
          ' and ' +
          chalk.yellow.bold('bundle') +
          ' to install the required Ruby gems.',
          ''
        ].join('\n'));
      }
    }
  }
});
