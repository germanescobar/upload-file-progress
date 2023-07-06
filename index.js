const express = require('express');
const busboy = require('busboy');
const app = express();
const fs = require('fs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/upload', (req, res) => {
  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );
    const saveTo = `${__dirname}/uploads/${filename}`;
    file.pipe(fs.createWriteStream(saveTo));
    // file.on('data', (data) => {
    //   console.log(`File [${name}] got ${data.length} bytes`);
    // })
    // .on('close', () => {
    //   console.log(`File [${name}] done`);
    // });
  });
  // bb.on('field', (name, val, info) => {
  //   console.log(`Field [${name}]: value: %j`, val);
  // });
  bb.on('close', () => {
    console.log('Done parsing form!');
    res.sendStatus(201)
  });
  req.pipe(bb);
});

app.listen(3000, () => console.log('Listening on port 3000!'));