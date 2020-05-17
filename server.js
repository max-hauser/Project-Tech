const express = require('express');
const app = express();
const port = 3000;


// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
  res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
  res.render('pages/about');
});
app.use(express.static('public'))

app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})

// respond with 404 if status === 404
app.use(function (req, res, next) {
  res.status(404).send("404 page, Sorry can't find that!")
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));