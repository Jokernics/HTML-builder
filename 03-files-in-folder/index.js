const fs = require('fs');
const path = require('path');

const secretPath = path.join(__dirname, 'secret-folder');
fs.readdir(secretPath, {withFileTypes: true}, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  files.forEach(file => {
    fs.stat(path.join(secretPath, file.name), (error, stats) => {
      if (error) console.error(error.message);
      if (!stats.isDirectory()) {
        console.log(file.name, '-', path.extname(file.name).slice(1), '-', Math.ceil(stats.size / 1024), 'КБ');
      }
    });
  });
});
