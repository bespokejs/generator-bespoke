// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke');
<%- selectedPlugins.map(function (plugin) {
  return 'var ' + plugin.varName + " = require('bespoke-" + plugin.name + "');";
}).join('\n'); %>

// Bespoke.js
bespoke.from('.deck', [
<%- selectedPlugins.map(function (plugin) {
  return '  ' + plugin.varName + '(' + (plugin.configValue || '') + ')';
}).join(',\n') %>
]);

<% if (syntax) { -%>
// Prism syntax highlighting
require('prismjs');
require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
<% } -%>
