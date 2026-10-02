// HTML → PDF (A4). 사용: node render.js
const { chromium } = require('playwright');
const path = require('path');
const files = ['줄리_선생님_촬영안내', '애니_선생님_촬영안내'];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const f of files) {
    await page.goto('file://' + path.join(__dirname, f + '.html'));
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(__dirname, f + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log(f + '.pdf');
  }
  await browser.close();
})();
