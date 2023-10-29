var isWebKit = 'webkitAppearance' in document.documentElement.style,
  // zoom-based scaling causes font sizes and line heights to be calculated differently
  // on the other hand, zoom-based scaling correctly anti-aliases fonts during transforms (no need for layer creation hack)
  scaleMethod = isWebKit ? 'zoom' : 'transform',
  bespoke = require('bespoke'),
<%- selectedPlugins.map(function (plugin) {
  return '  ' + plugin.varName + " = require('bespoke-" + plugin.name + "')";
}).join(',\n'); %>;

bespoke.from({ parent: 'article.deck', slides: 'section' }, [
<%- selectedPlugins.map(function (plugin) {
  return '  ' + plugin.varName + '(' + (plugin.configValue || '') + ')';
}).join(',\n'); %>
]);
