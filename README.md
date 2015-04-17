# Email Text Converter

#### A Javascript/Node.js text converter using Cheerio.

This script will pull all text out of an email and format it. It may require additional manual formatting after output, but this should speed up the process.

It relies on a few names and IDs to work:
- `<a name="promo">` on a single promo URL
- `<a name="unsub">` on the opt-out URL
- `<table id="headerSection">`
- `<table id="bodySection">`
- `<table id="footerSection">`
- `<td class="disclosure">`
- `<td class="unsub">`
- `<td class="address">`

If the headline is in the hero image, add `#hdr-img` to the `<img>` tag.

---

To run the program, start up your favorite CLI, navigate to this folder, then run:

`$ node converter.js path/to/email.html`

The converter will output a .txt file in the same location and name as the original HTML file.