const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const versionPath = path.join(__dirname, '../release/preview-template/version.json');
const versionContent = fs.readFileSync(versionPath, 'utf-8');
const fileObject = JSON.parse(versionContent);
fileObject.version = new Date().toLocaleDateString();
fs.writeFileSync(versionPath, JSON.stringify(fileObject), 'utf-8');

const zip = new AdmZip();

zip.addLocalFolder(path.join(__dirname, '../release/preview-template'));
zip.writeZip(path.join(__dirname, '../release/preview-template.zip'));