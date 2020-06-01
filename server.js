// Requirements
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer')
const session = require('express-session')
const { ObjectID } = require('mongodb');


let db;
const db_key = "mongodb+srv://admin:admin@cluster0-po8zm.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(db_key, function (err, client) { if (err) { throw err } else {} db = client.db("mydb"); });

var upload = multer({ dest: 'static/images/users/'})

// Expres requests
app
  .set('view engine', 'ejs')

  .use(express.static('static'))
  .use(bodyParser.urlencoded({ extended: true}))
  .use(bodyParser.json())
  .use(session({'secret': '343ji43j4n3jn4jk3n'}))
  
  .post('/edit', upload.single('picture'), edit_user)
  .post('/add', upload.single('picture'), add_user)
  .post('/delete', delete_user)
  .post('/meet', filter)
  .post('/login', login)
  .post('/account', logout)
  .post('/edituser', upload.single('picture'), edit_user)
  .post('/reject', reject)

  .get('/', check_session, load_homepage)
  .get('/admin',check_session, adminpanel)
  .get('/add', check_session, add_userpage)
  .get('/edituser', check_session, edituser)
  .get('/admin', check_session, load_admin_page)
  .get('/chats', check_session, load_chat_page)
  .get('/meet', check_session, init_meet)
  .get('/login', load_login_page)
  .get('/account', check_session, load_myaccount_page)
  .get('/:id', check_session, get_user)

  .use(express.static(__dirname + '/static'))
 
  .use(function (req, res, next) {
    res.status(404).send("404 page, Sorry can't find that!")
  })


  .listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


// functies om met de database te communiceren


function check_session(req, res, next) {
  // if session does not exist -> redirect to login, else continue
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}

function load_login_page(req, res, next) {
  res.render('pages/login');
}

function load_homepage(req, res, next) {
  res.render('pages/index', {user: req.session.user}); 
}

function add_userpage(req, res, next) {
  res.render('pages/add');
}

function load_admin_page(req, res, next) {
  res.render('pages/admin')
}

function load_chat_page(req, res, next) {
  res.render('pages/chats')
}
function load_myaccount_page(req, res, next) {
  res.render('pages/account', {user: req.session.user})
  console.log(req.session.user)
}

function edituser(req, res, next) {
  res.render('pages/edituser', {user: req.session.user})
}



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
  db.collection('users').deleteOne({
    _id: new mongo.ObjectID(req.body.id)
  }, done);

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.redirect('/admin')
    }
  }
}

function get_user(req, res, next) {
  const id = req.params.id.toString()

  db.collection('users').findOne({
    _id: ObjectID(id),
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
  let edit_id;
  if(req.body.id){
    edit_id = req.body.id
  }else{
    edit_id = req.session.user.id
  }

  db.collection('users').updateOne({
    _id: ObjectID(edit_id)
  }, {
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
      res.redirect('/');
    }
  }
}

function init_meet(req, res, next) {

  const rejected_users =  req.session.user.rejected_users;
  const rejected_users_list = [];
  rejected_users.forEach((userID)=>{
    let x = ObjectID(userID);
    rejected_users_list.push(x);
  })

  const query = {
    age: {
      $lte: "31"
    },
    area: {
      $eq: req.session.user.area
    },
    gender: {
      $eq: req.session.user.orientation
    },
    _id: {
      $nin: rejected_users_list
    }
  }

  db.collection("users").findOne(query, done);


  function done(err, data) {
    console.log(query)
    if (err) {
      next(err)
    } else {
      res.render('pages/meet', {user: data})
    }
  }
}

function filter(req, res, next) {

  const rejected_users =  req.session.user.rejected_users;
  const rejected_users_list = [];
  rejected_users.forEach((userID)=>{
    let x = ObjectID(userID);
    rejected_users_list.push(x);
  }) 

  const query = {
    age: {
      $lte: req.body.age
    },
    area: {
      $eq: req.body.distance
    },
    gender: {
      $eq: req.session.user.orientation
    },
    _id: {
      $nin: rejected_users_list
    }
  }
  db.collection("users").findOne(query, done);

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('pages/meet', {
        user: data
      })
    }
  }
}


function login(req, res, next) {

  const query = {
    email: {
      $eq: req.body.email
    },
    password: {
      $eq: req.body.password
    }
  }
  db.collection("users").find(query).toArray(done)


  function done(err, data) {
    if (err) {
      next(err)
    } else {
      if (data.length >= 1) {
        const s_userID = data.map(data => data._id);
        const s_firstname = data.map(data => data.firstname);
        const s_lastname = data.map(data => data.lastname);
        const s_age = data.map(data => data.age);
        const s_gender = data.map(data => data.gender);
        const s_interest = data.map(data => data.interest);
        const s_intent = data.map(data => data.intent);
        const s_orientation = data.map(data => data.orientation);
        const s_area = data.map(data => data.area);
        req.session.user = {
          id: s_userID.toString(),
          firstname: s_firstname.toString(),
          lastname: s_lastname.toString(),          
          email: req.body.email,
          age: s_age.toString(), 
          gender: s_gender.toString(),
          interest: s_interest.toString(),
          intent: s_intent.toString(),
          orientation: s_orientation.toString(),
          area: s_area.toString(),
          rejected_users : []
        }         
        res.redirect('/')
      } else {
        res.redirect('/login')
      }
    }
  }
}

function logout(req, res, next) {
  req.session.destroy();
  res.redirect('/login')
}

function reject(req, res, next) {
  let rejected_userID = ObjectID(req.body.rejected_user)
  req.session.user.rejected_users.push(rejected_userID)
  res.redirect('/meet')
  
}