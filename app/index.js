'use strict';

var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  chalk = require('chalk'),
  sortedObject = require('sorted-object');


var BespokeGenerator = module.exports = function BespokeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ bower: false, skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(BespokeGenerator, yeoman.generators.NamedBase);

// welcome message
var welcome =
  "\n" +
  chalk.cyan.bold("\noooooooooo.                                          oooo                          o8o          ") +
  chalk.cyan.bold("\n`888'   `Y8b                                         `888                          `\"'          ") +
  chalk.cyan.bold("\n 888     888  .ooooo.   .oooo.o oo.ooooo.   .ooooo.   888  oooo   .ooooo.         oooo  .oooo.o ") +
  chalk.cyan.bold("\n 888oooo888' d88' `88b d88(  \"8  888' `88b d88' `88b  888 .8P'   d88' `88b        `888 d88(  \"8 ") +
  chalk.cyan.bold("\n 888    `88b 888ooo888 `\"Y88b.   888   888 888   888  888888.    888ooo888         888 `\"Y88b.  ") +
  chalk.cyan.bold("\n 888    .88P 888    .o o.  )88b  888   888 888   888  888 `88b.  888    .o .o.     888 o.  )88b ") +
  chalk.cyan.bold("\no888bood8P'  `Y8bod8P' 8\"\"888P'  888bod8P' `Y8bod8P' o888o o888o `Y8bod8P' Y8P     888 8\"\"888P' ") +
  chalk.cyan.bold("\n                                 888                                               888          ") +
  chalk.cyan.bold("\n                                o888o                                          .o. 88P          ") +
  chalk.cyan.bold("\n                                                                               `Y888P           ") +
  "\n" +
  chalk.green.bold("Thanks for choosing Bespoke.js for your presentation! :)   -@markdalgleish") +
  "\n";

var mandatoryPlugins = [
  {
    name: 'keys',
    version: '^1.0.0'
  },
  {
    name: 'touch',
    version: '^1.0.0'
  },
  {
    name: 'scale',
    version: '^1.0.0'
  },
  {
    name: 'bullets',
    version: '^1.0.0',
    configValue: 'li, .bullet'
  },
  {
    name: 'hash',
    version: '^1.0.0'
  }
];

var optionalPlugins = [
];

BespokeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(welcome);

  var prompts = [
      {
        name: 'title',
        message: 'What is the title of your presentation?',
        default: 'Hello World'
      },
      {
        type: 'confirm',
        name: 'useTheme',
        message: 'Would you like to use a pre-made theme?',
        default: true
      }
    ]
    .concat(optionalPlugins.map(function(plugin) {
      return {
        type: 'confirm',
        name: plugin.name,
        message: plugin.message,
        default: 'default' in plugin ? plugin['default'] : true
      };
    }))
    .concat({
      type: 'confirm',
      name: 'syntax',
      message: 'Will your presentation include code samples?',
      default: true
    });

  this.prompt(prompts, function (props) {
    mandatoryPlugins.forEach(function(plugin) {
      this[plugin.name] = true;
    }.bind(this));

    optionalPlugins.forEach(function(plugin) {
      this[plugin.name] = props[plugin.name];
    }.bind(this));

    this.selectedPlugins = [];

    this.useTheme = props.useTheme;
    this.selectedPlugins.push(
      props.useTheme ?
        {
          name: 'theme-cube',
          version: '^2.0.0'
        } :
        {
          name: 'classes',
          version: '^1.0.0'
        }
    );

    this.selectedPlugins = this.selectedPlugins.concat(mandatoryPlugins);
    this.selectedPlugins = this.selectedPlugins.concat(optionalPlugins.filter(function(plugin) {
      return props[plugin.name];
    }));

    this.syntax = props.syntax;
    this.title = props.title;
    this.shortName = this._.slugify(props.title);

    cb();
  }.bind(this));
};

BespokeGenerator.prototype.setupProjectFiles = function setupProjectFiles() {
  this.template('gulpfile.js', 'gulpfile.js');
  this.template('README.md', 'README.md');
  this.template('_gitignore', '.gitignore');

  this.copy('_editorconfig', '.editorconfig');
}

BespokeGenerator.prototype.setupPackageJson = function setupPackageJson() {
  var packageJson = {
    'name': 'presentation-' + this.shortName,
    'version': '0.0.0',
    'dependencies': {},
    'devDependencies': {
      'bespoke': '^1.1.0',
      'del': '^2.2.0',
      "gh-pages": "^0.11.0",
      'gulp': '^3.8.1',
      'gulp-autoprefixer': '^3.1.0',
      'gulp-browserify': '^0.5.0',
      'gulp-connect': '^4.0.0',
      'gulp-csso': '^2.0.0',
      'gulp-jade': '^1.1.0',
      'gulp-plumber': '^1.1.0',
      'gulp-rename': '^1.2.0',
      'gulp-stylus': '^2.3.1',
      'gulp-uglify': '^1.5.3',
      'gulp-util': '^3.0.7',
      'insert-css': '^0.2.0',
      'opn': '^4.0.1',
      'through': '^2.3.4'
    },
    'engines': {
      'node': '>=0.10.0'
    }
  };

  this.selectedPlugins.forEach(function(plugin) {
    packageJson.devDependencies['bespoke-' + plugin.name] = plugin.version;
  }.bind(this));

  if (!this.useTheme) {
    packageJson.devDependencies['normalizecss'] = '^3.0.0';
  }

  if (this.syntax) {
    packageJson.devDependencies['prismjs'] = '^1.4.1';
    packageJson.devDependencies['prism-themes'] = 'PrismJS/prism-themes';
  }

  packageJson.devDependencies = sortedObject(packageJson.devDependencies);
  this.write('package.json', JSON.stringify(packageJson, null, 2));
};

BespokeGenerator.prototype.setupFiles = function setupFiles() {
  this.mkdir('src');
  this.mkdir('src/scripts');
  this.mkdir('src/styles');
  this.mkdir('src/images');

  this.template('src/index.jade', 'src/index.jade');
  this.template('src/scripts/main.js', 'src/scripts/main.js');
  this.template('src/styles/main.styl', 'src/styles/main.styl');
};
