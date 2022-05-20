const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

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

copyFiles(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
