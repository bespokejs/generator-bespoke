var page = require('webpage').create();

// fix: really send console.error() to stderr
console.error = function () {
  require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

function checkStatus(status) {

  if (status !== 'success') {
    phantom.exit(1);
  }
}

function checkTitle(expectedText) {

  var trimmedExpectedText = expectedText.trim();

  var title = page.evaluate(function () {
    return document.querySelector('.bespoke-active h1, .bespoke-active h2').textContent.trim();
  });

  if (title !== trimmedExpectedText) {
    console.error([
      'Expected slide title "' + expectedText + '"',
      '             but got "' + title + '"'
    ].join('\n'));
    phantom.exit(1);
  }
}

page.open('http://localhost:8080', function (status) {

  checkStatus(status);

  checkTitle('Foobar Test Title');

  page.sendEvent('keypress', page.event.key.Right);
  checkTitle('Images');

  page.sendEvent('keypress', page.event.key.End);
  checkTitle('Just the beginning…​');

  console.log('Tests OK!');
  phantom.exit();
});
