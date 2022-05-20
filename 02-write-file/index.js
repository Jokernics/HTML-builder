const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;
console.log('Здравствуйте, введите текст: ');
fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);
const output = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
output.on('data', chunk => console.log(chunk));
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    stdout.write('GoodBye');
    process.exit();
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), data.toString(), (err) => {
    if (err) console.error(err.message);
  });
});
process.on('SIGINT', () => {
  stdout.write('GoodBye');
  process.exit();
});
