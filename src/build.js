const handlebars = require('handlebars');
const fs = require('fs-extra');
const markdownHelper = require('./utils/helpers/markdown');
const templateData = require('./metadata/metadata');
const getSlug = require('speakingurl');
const dayjs = require('dayjs');
const repoName = require('git-repo-name');
const username = require('git-username');
const buildPdf = require('./utils/pdf.js');

const srcDir = __dirname;
const outputDir = __dirname + '/../dist';

// Clear dist dir
fs.emptyDirSync(outputDir);

// Copy assets
fs.copySync(srcDir + '/assets', outputDir);

// Build HTML
handlebars.registerHelper('markdown', markdownHelper);
const source = fs.readFileSync(srcDir + '/templates/index.html', 'utf-8');
const template = handlebars.compile(source);

// Generate PDF filenames for both languages
const pdfFileNameEn = `${getSlug(templateData.name)}.${getSlug(templateData.title)}.pdf`;
const pdfFileNamePt = `${getSlug(templateData.name)}.${getSlug(templateData.title_pt)}.pdf`;

// Format dates for both languages
const updatedEn = dayjs().format('MM/DD/YYYY');
const updatedPt = dayjs().format('DD/MM/YYYY');

const html = template({
  ...templateData,
  baseUrl: `https://${username()}.github.io/${repoName.sync()}`,
  pdfFileNameEn,
  pdfFileNamePt,
  updatedEn,
  updatedPt,
});

fs.writeFileSync(outputDir + '/index.html', html);

// Build PDFs for both languages
async function buildPdfs() {
  try {
    // Build English PDF
    console.log('Building English PDF...');
    await buildPdf(`${outputDir}/index.html`, `${outputDir}/${pdfFileNameEn}`, 'en');
    
    // Build Portuguese PDF
    console.log('Building Portuguese PDF...');
    await buildPdf(`${outputDir}/index.html`, `${outputDir}/${pdfFileNamePt}`, 'pt');
    
    console.log('PDFs generated successfully!');
  } catch (error) {
    console.error('Error generating PDFs:', error);
  }
}

buildPdfs();
