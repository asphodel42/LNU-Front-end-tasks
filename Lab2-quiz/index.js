const express = require('express');
const path = require('path');

const app = express();

const host = 'localhost';
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
})