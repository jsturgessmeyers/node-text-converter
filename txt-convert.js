var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var HTML = process.argv[2];

(function parseEmail(filePath) {
  var data = fs.readFileSync(filePath);
  var $ = cheerio.load(data);
  var lines = [];

  // Vars for links--shouldn't need to change
  var promoURL = '\nSubscribe Now\n' + '>> ' + $('a[name="promo"]').attr('href');
  var unsubURL = 'Unsubscribe: ' + $('a[name="unsub"]').attr('href');

  // Object containing sections and divider characters and URLs
  var sections = {
    headline: [$('.headline'), '*'],
    body: [$('.body'), '*', promoURL],
    footer: [$('.footer'), ''],
    disclosure: [$('.disclosure'), '-'],
    unsub: [$('.unsub'), '', unsubURL],
    address: [$('.address'), '']
  };

  // Function to cleanse text
  // First regex removes HTML formatting
  // Second regex adds a space to sentence ends if necessary
  // Remaining regexes replace entities
  function cleanText(text) {
    return text.replace(/\n[\s]+/g, '')
    .replace(/[.](?=.)/g, '. ')
    .replace(/—/g, '--')
    .replace(/–/g, '-')
    .replace(/’/g, '\'')
    .replace(/‘/g, '\'')
    .replace(/"/g, '"')
    .replace(/¢/g, 'cents')
    .replace(/®/g, '(R)')
    .replace(/©/g, '(c)')
    .replace(/ /g, ' ')
    .replace(/…/g, '...');
  }

  // Function to add dividers between sections
  function dividers(sym, n) {
    return lines.push('\n' + Array(n).join(sym)) + '\n';
  }

  // Function to gather text and push to array
  function buildSections(data) {
    var words = $(sections[data][0]).text() != '' ? $(sections[data][0]).text() : $('#hdr-img').attr('alt');

    lines.push(cleanText(words));

    if (sections[data][2]) {
      lines.push(sections[data][2]);
    }

    dividers(sections[data][1], 25);
  }

  // Build the document
  lines.push('View in your browser\n>> %%view_email_url%%\n');
  lines.push($('title').text() + '\n');

  // Loop over sections object and push text to array
  for (var section in sections) {
    buildSections(section);
  }

  fs.writeFileSync("/Users/adambrooks/Desktop/" + path.basename(HTML), lines.join("\n"));
  console.log('File saved successfully.');
})(HTML);