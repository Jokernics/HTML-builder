const fs = require('fs');
const path = require('path');

const filesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const output = fs.createWriteStream(bundlePath);

fs.readdir(filesPath, (error, files) => {
  if (error) console.error(error.message);
  files.forEach(file => {
    fs.stat(path.join(filesPath, file), (error, stats) => {
      if (error) return console.error(error.message);
      if (stats.isDirectory() || path.extname(file) !== '.css') return;
      const input = fs.createReadStream(path.join(filesPath, file));
      input.pipe(output);
    });
  });
});