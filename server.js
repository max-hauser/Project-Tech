// Requirements
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');


// Database init
let db;
const db_key = "mongodb+srv://admin:admin@cluster0-po8zm.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(db_key, function (err, client) {
  if (err) {
    throw err
  } else {
    console.log("database doet t");
  }
  db = client.db("mydb");
});


// Expres requests
app
  
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .set('view engine', 'ejs')

  .post('/edit', edit_user)
  .post('/add', add_user)
  .post('/delete', delete_user)

  .get('/', function (req, res) {
    res.render('pages/index');
  })
  .use(express.static(__dirname + '/static'))
  .get('/admin', adminpanel)
  .get('/add', function (req, res) {
    res.render('pages/add');
  })
  .get('/admin', function (req, res) {
    res.render('pages/admin');
  })

  .get('/meet', function (req, res) {
    res.render('pages/meet', get_users);
  })

  .get('/:id', get_user)
  .use(function (req, res, next) {
    res.status(404).send("404 page, Sorry can't find that!")
  })
  .listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


// functies om met de database te communiceren


function adminpanel(req, res, next) {
  db.collection('users').find().toArray(done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('pages/admin', {
        data: data
      })
    }
  }
}

function add_user(req, res, next) {

  db.collection('users').insertOne({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    interest: req.body.interest,
    intent: req.body.intent,
    orientation: req.body.orientation,
    area: req.body.area,
    picture: req.file ? req.file.filename : null
  }, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.redirect('/admin')
    }
  }
}

function delete_user(req, res, next) {
  console.log(req.body.id);
  db.collection('users').deleteOne({
    _id: new mongo.ObjectID(req.body.id)
  }, done);

  function done(err, data) {
    console.log("de code komt hier.....")
    if (err) {
      next(err)
    } else {
      res.redirect('/admin')
    }
  }
}

function get_user(req, res, next) {
  const id = req.params.id

  db.collection('users').findOne({
    _id: new mongo.ObjectID(id),
  }, loaduser);

  function loaduser(err, data) {
    if (err) {
      next(err);
    } else {
      res.render('pages/edit', {
        data: data
      })
    }
  }
}


function edit_user(req, res, next) {


  console.log(req.params)


  db.collection('users').updateOne({ _id: ObjectID(req.body._id) },
  {
    $set: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      interest: req.body.interest,
      intent: req.body.intent,
      orientation: req.body.orientation,
      area: req.body.area,
      picture: req.file ? req.file.filename : null
    },
  }, update_user);

function update_user(err, data) {
  if (err) {
    next(err);
  } else {
    res.redirect('/admin');
  }
}



}