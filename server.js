const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app
 //post
.post('/meet', pref)


  // set
  .set('view engine', 'ejs')

  // get
  .get('/', function (req, res) {
    res.render('pages/index');
  })
  .get('/', function (req, res) {
    res.render('pages/index');
  })
  .get('/meet', function (req, res) {
    res.render('pages/meet')
    res.render('pages/meet', {data: users})
  })
  .get('/users', get_users)
  .get('/account', function (req, res) {
    res.render('pages/account');
  })
  .get('/chats', function (req, res) {
    res.render('pages/chats');
  })

  // use
  .use(express.static(__dirname + '/static'))

  .use(bodyParser.urlencoded({extended: true}))
  
  .use(function (req, res, next) {
    res.status(404).send("404 page, Sorry can't find that!")
  })


function get_users(req, res) {
  res.render('pages/users.ejs', { data: users });
}

function pref(req, res) {
  // data.push({
  //   age: req.body.age,
  //   distance: req.body.distance,
  //   orientation: req.body.orientation
  // })
  //res.redirect('/meet')
  console.log(req.body.age)
  console.log(req.body.age)
  console.log(req.body.age)
}

let users = [{
    "id": 0,
    "firstname": "Bob",
    "lastname": "Dillan",
    "age": 25,
    "gender": "male",
    "interests": ["Soccer", "Gaming", "Playing with dog"],
    "intent": "Serious Relationship",
    "orientation": "straight",
    "location": 1,
    "picture": "images/users/user-0.png"

    
  },
  {
    "id": 1,
    "firstname": "Keira",
    "lastname": "Flow",
    "age": 21,
    "gender": "female",
    "interests": ["Make-up", "Tennis", "reading"],
    "intent": "Casual Dating",
    "orientation": "straight",
    "location": 1,
    "picture": "images/users/user-1.png"
    
  },
  {
    "id": 2,
    "firstname": "Andrea",
    "lastname": "Anderson",
    "age": 28,
    "gender": "female",
    "interests": ["Climbing", "Netflix", "Childcare"],
    "intent": "Serious Dating",
    "orientation": "lesbian",
    "location": 2,
    "picture": "images/users/user-2.png"
    
  },
  {
    "id": 3,
    "firstname": "Tom",
    "lastname": "Gilbert",
    "age": 18,
    "gender": "male",
    "interests": ["touring", "Night life", "Stockmarket"],
    "intent": "One Night Stand",
    "orientation": "Gay",
    "location": 3,
    "picture": "images/users/user-3.png"
  
  }
];

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));