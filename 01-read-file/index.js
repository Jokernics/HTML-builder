const fs = require('fs');
const path = require('path');

const output = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
output.on('data', chunk => console.log(chunk));