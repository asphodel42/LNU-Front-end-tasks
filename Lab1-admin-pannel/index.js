const express = require('express');
const path = require('path');
const app = express();

const localhost = '127.0.0.1';
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/src/data', express.static(path.join(__dirname, 'src/data')));

app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '/public/form/form.html'));
});

app.get('/admin', (req, res)=>{
  res.sendFile(path.join(__dirname, '/public/admin/admin.html')); 
});

app.listen(port, localhost, ()=>{
  console.log(`Server is running on http://${localhost}:${port}`);
})