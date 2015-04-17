var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var HTML = process.argv[2];
var fileName = path.basename(HTML).replace(path.extname(HTML), '');

(function parseEmail(filePath) {
  var data = fs.readFileSync(filePath);
  var $ = cheerio.load(data);
  var lines = [];

  // Vars for links--shouldn't need to change
  var header = cleanText($('#hdr-img').attr('alt'));

  var body = $('#bodySection').text().split('\n');
  for (var i = body.length - 1; i >= 0; i--) {
    if (!/\S/g.test(body[i])) {
      body.splice(i, 1);
    } else {
      body[i] = cleanText(body[i]);
    }
  }

  var btnText = cleanText($('#btn').text());
  var promoURL = '>> ' + $('a[name="promo"]').attr('href');
  var footer = cleanText($('#footerSection').text());
  var disclosure = cleanText($('.disclosure').text());
  var unsub = cleanText($('.unsub').text());
  var unsubURL = '>> ' + $('a[name="unsub"]').attr('href');
  var address = cleanText($('.address').text());

  // Function to cleanse text
  // First regex removes formatting
  // Second adds a space to ends of sentences if necessary
  // Remaining replace entities
  function cleanText(text) {
    if (/\S/g.test(text) && text != undefined) {
      return text.replace(/[\s\t]{2}/g, '')
      .replace(/[.](?=.)/g, '. ')
      .replace(/—/g, '--')
      .replace(/–/g, '-')
      .replace(/’/g, '\'')
      .replace(/‘/g, '\'')
      .replace(/"/g, '"')
      .replace(/¢/g, ' cents')
      .replace(/®/g, '(R)')
      .replace(/©/g, '(c)')
      .replace(/•/g, '-')
      .replace(/ /g, ' ')
      .replace(/…/g, '...');
    }
    return;
  }

  // Function to add divider between sections
  function divider(sym, n) {
    return lines.push(Array(n).join(sym));
  }

  function buildDoc() {
    lines.push('View in your browser:\n>> %%view_email_url%%', $('title').text());
    divider('-', 25);
    lines.push(header);
    divider('-', 25);
    lines.push(body.join('\n').replace(btnText, ''));
    divider('*', 25);
    lines.push(btnText + '\n' + promoURL, footer);
    divider('*', 25);
    lines.push(unsub + '\n' + unsubURL);
    divider('-', 25);
    lines.push(address);
    return lines.join('\n\n');
  }

  fs.writeFileSync(path.dirname(HTML) + '/' + fileName + '.txt', buildDoc());
  console.log('File saved successfully.');
})(HTML);