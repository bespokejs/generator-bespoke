'use strict';

var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  chalk = require('chalk');


var BespokeGenerator = module.exports = function BespokeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
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

var bespokePlugins = [
  {
    name: 'bullets',
    message: 'Would you like bullet list support?',
    version: '~0.2.0',
    configValue: 'li, .bullet'
  },
  {
    name: 'scale',
    message: 'Would you like responsive slide scaling?',
    version: '~0.2.0'
  },
  {
    name: 'hash',
    message: 'Would you like hash routing support?',
    version: '~0.1.0'
  },
  {
    name: 'progress',
    message: 'Would you like an animated progress bar?',
    version: '~0.1.0'
  },
  {
    name: 'state',
    message: 'Would you like to be able to change the entire presentation style based on the active slide?',
    version: '~0.2.0'
  },
  {
    name: 'forms',
    message: 'Will your presentation include interactive form elements?',
    version: '~0.1.0'
  }
];

BespokeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(welcome);

  var prompts = [{
      name: 'title',
      message: 'What is the title of your presentation?',
      default: 'Hello World'
    }]
    .concat(bespokePlugins.map(function(bespokePlugin) {
      return {
        type: 'confirm',
        name: bespokePlugin.name,
        message: bespokePlugin.message,
        default: true
      };
    }))
    .concat({
      type: 'confirm',
      name: 'syntax',
      message: 'Would you like syntax highlighting?',
      default: true
    });

  this.prompt(prompts, function (props) {
    bespokePlugins.forEach(function(bespokePlugin) {
      this[bespokePlugin.name] = props[bespokePlugin.name];
    }.bind(this));

    this.selectedBespokePlugins = bespokePlugins.filter(function(bespokePlugin) {
      return props[bespokePlugin.name];
    });

    this.syntax = props.syntax;
    this.title = props.title;
    this.shortName = this._.slugify(props.title);

    cb();
  }.bind(this));
};

BespokeGenerator.prototype.setupProjectFiles = function setupProjectFiles() {
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.template('README.md', 'README.md');

  this.copy('bowerrc', '.bowerrc');
  this.copy('gitignore', '.gitignore');
  this.copy('jshintrc', '.jshintrc');
  this.copy('editorconfig', '.editorconfig');
}

BespokeGenerator.prototype.setupPackageJson = function setupPackageJson() {
  var packageJson = {
    'name': this.shortName + '-bespoke',
    'version': '0.0.0',
    'dependencies': {},
    'devDependencies': {
      'grunt': '~0.4.1',
      'grunt-contrib-clean': '~0.4.0',
      'grunt-contrib-copy': '~0.4.1',
      'grunt-contrib-watch': '~0.5.1',
      'grunt-contrib-jade': '~0.9.0',
      'grunt-contrib-stylus': '~0.5.0',
      'grunt-contrib-coffee': '~0.7.0',
      'grunt-usemin': '~2.0.2',
      'grunt-contrib-concat': '~0.3.0',
      'grunt-contrib-cssmin': '~0.7.0',
      'grunt-contrib-uglify': '~0.2.7',
      'grunt-contrib-connect': '~0.3.0',
      'grunt-open': '~0.2.1',
      'grunt-concurrent': '~0.3.0',
      'grunt-gh-pages': '~0.6.0',
      'connect-livereload': '~0.2.0'
    },
    'engines': {
      'node': '>=0.8.0'
    }
  };
  this.write('package.json', JSON.stringify(packageJson, null, 2));
};

BespokeGenerator.prototype.setupBowerJson = function setupBowerJson() {
  var bowerJson = {
    'name': this.shortName + '-bespoke',
    'version': '0.0.0',
    'dependencies': {
      'bespoke.js': '~0.3.0'
    }
  };

  this.selectedBespokePlugins.forEach(function(bespokePlugin) {
    bowerJson.dependencies['bespoke-' + bespokePlugin.name] = bespokePlugin.version;
  }.bind(this));

  if (this.syntax) bowerJson.dependencies['prism'] = 'gh-pages';

  this.write('bower.json', JSON.stringify(bowerJson, null, 2));
};

BespokeGenerator.prototype.setupBowerComponentPaths = function setupBowerComponentPaths() {
  this.bowerComponentPaths = ['bespoke.js/dist/bespoke.min.js'];

  this.selectedBespokePlugins.forEach(function(bespokePlugin) {
    this.bowerComponentPaths.push('bespoke-' + bespokePlugin.name + '/dist/bespoke-' + bespokePlugin.name +'.min.js');
  }.bind(this));

  if (this.syntax) this.bowerComponentPaths.push('prism/prism.js');
};

BespokeGenerator.prototype.setupPlugins = function setupPlugins() {
  var plugins = this.selectedBespokePlugins.reduce(function(pluginsObj, bespokePlugin) {
    pluginsObj[bespokePlugin.name] = bespokePlugin.configValue != null ? bespokePlugin.configValue : true;
    return pluginsObj;
  }.bind(this), {});

  this.hasPlugins = this.selectedBespokePlugins.length > 0;
  this.pluginsJson = JSON.stringify(plugins, null, 2)
    .replace(/\"/g,"'") // Switch to single quotes
    .replace(/\'([a-z0-9_$]+)\'(:)/gi, '$1$2') // Unquote object keys
};

BespokeGenerator.prototype.setupFiles = function setupFiles() {
  this.mkdir('src');
  this.mkdir('src/scripts');
  this.mkdir('src/styles');

  this.template('src/index.jade', 'src/index.jade');
  this.template('src/scripts/main.js', 'src/scripts/main.js');
  this.template('src/styles/main.styl', 'src/styles/main.styl');
};