const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Home pagina!'));
app.get('/about', (req, res) => res.send('About pagina!'));
app.get('/contact', (req, res) => res.send('Contact pagina!'));
app.use(express.static("static"));
app.use(function (req, res, next) {
  res.status(404).send("Dit is de 404 pagina.")
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));