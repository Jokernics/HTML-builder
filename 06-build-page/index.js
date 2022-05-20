const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const bundlePath = path.join(__dirname, 'project-dist');

async function bundleHtml(htmlTemplatePath, distHtmlPath, componentsPath) {
  let bundleHtml = await fsPromises.readFile(htmlTemplatePath, { encoding: 'utf-8' });

  const files = await fsPromises.readdir(componentsPath);
  for await (const file of files) {
    const name = path.basename(path.join(componentsPath, file), '.html');
    const componentHtml = await fsPromises.readFile(path.join(componentsPath, file), 'utf-8');
    const regexp = new RegExp(`{{${name}}}`, 'g');
    bundleHtml = bundleHtml.replace(regexp, componentHtml);
  }
  fsPromises.writeFile(distHtmlPath, bundleHtml);
}

async function bundleCss(cssFilesPath, cssBundlePath) {
  const output = fs.createWriteStream(cssBundlePath);

  fs.readdir(cssFilesPath, (error, files) => {
    if (error) console.error(error.message);
    files.forEach(file => {
      fs.stat(path.join(cssFilesPath, file), (error, stats) => {
        if (error) return console.error(error.message);
        if (stats.isDirectory() || path.extname(file) !== '.css') return;
        const input = fs.createReadStream(path.join(cssFilesPath, file));
        input.pipe(output);
      });
    });
  });
}

async function copyFiles(filesPath, copyPath) {
  const files = await fsPromises.readdir(filesPath);
  await fsPromises.mkdir(copyPath).catch(async () => {
    await fsPromises.rm(copyPath, { recursive: true }).then(() => {
      fsPromises.mkdir(copyPath);
    });
  });
  for await (const file of files) {
    const stat = await fsPromises.stat(path.join(filesPath, file));
    stat.isDirectory()
      ? copyFiles(path.join(filesPath, file), path.join(copyPath, file))
      : fs.promises.copyFile(path.join(filesPath, file), path.join(copyPath, file));
  }
}

async function bundle(bundlePath) {
  const htmlTemplatePath = path.join(__dirname, 'template.html');
  const cssFilesPath = path.join(__dirname, 'styles');
  const filesPath = path.join(__dirname, 'assets');
  const distHtmlPath = path.join(bundlePath, 'index.html');
  const cssBundlePath = path.join(bundlePath, 'style.css');
  const copyPath = path.join(bundlePath, 'assets');
  const componentsPath = path.join(__dirname, 'components');

  await fsPromises.mkdir(bundlePath).catch(async () => {
    await fsPromises.rm(bundlePath, { recursive: true }).then(async () => {
      await fsPromises.mkdir(bundlePath);
    });
  });
  bundleHtml(htmlTemplatePath, distHtmlPath, componentsPath);
  bundleCss(cssFilesPath, cssBundlePath);
  copyFiles(filesPath, copyPath);
}

bundle(bundlePath);