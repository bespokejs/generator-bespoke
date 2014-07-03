// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke'),<%= selectedPlugins.map(function(plugin) {
  return '\n  ' + plugin.name.replace('theme-', '') + " = require('bespoke-" + plugin.name + "')";
}).join(',') %>;

// Bespoke.js
bespoke.from('article', [<%= selectedPlugins.map(function(plugin) {
	return '\n  ' + plugin.name.replace('theme-', '') + '(' + (plugin.configValue ? "'" + plugin.configValue + "'" : '') + ')';
}).join(',') %>
]);<% if (syntax) { %>

// Prism syntax highlighting
// This is actually loaded from "bower_components" thanks to
// debowerify: https://github.com/eugeneware/debowerify
require('prism');
<% } %>
