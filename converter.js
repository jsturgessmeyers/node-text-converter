var fs = require('fs');
var cheerio = require('cheerio');

function getText(filePath) {
  function printText(filePath, callback) {
    return callback(filePath);
  }

  function parseEmail(filePath) {
    var data = fs.readFileSync(filePath);
    var $ = cheerio.load(data);
    var lines = [];
    var text = '';

    // Vars for links--shouldn't need to change
    var promoURL = '\nSubscribe Now\n' + '>> ' + $('a[name="promo"]').attr('href');
    var unsubURL = 'Unsubscribe: ' + $('a[name="unsub"]').attr('href');

    // Object containing sections and divider characters
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
      return lines.push('\n' + Array(n).join(sym) + '\n');
    }

    // Function to gather text and push to array
    function buildSections(data) {
      var words = $(sections[data][0]).text();

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

    lines.forEach(function(line) {
      text += line;
    });

    return text;
  }

  return printText(filePath, parseEmail);
}

exports.getText = getText;