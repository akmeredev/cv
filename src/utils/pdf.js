const Puppeteer = require('puppeteer');

module.exports = async function buildPdf(inputFile, outputFile, language = 'en') {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${inputFile}`, {
    waitUntil: 'networkidle0'
  });
  
  // Set language before generating PDF
  if (language === 'pt') {
    await page.evaluate(() => {
      // Trigger language change to Portuguese
      if (typeof changeLanguage === 'function') {
        changeLanguage('pt');
      }
    });
    
    // Wait a bit for the language change to take effect
    await page.waitForTimeout(1000);
  }
  
  await page.pdf({
    path: outputFile,
    format: 'A4',
    border: 0,
    margin: {
      top: '2.54cm',
      right: '2.54cm',
      bottom: '2.54cm',
      left: '2.54cm',
    },
  });
  
  await browser.close();
};
