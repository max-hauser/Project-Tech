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
require('dotenv').config()
const io = require('socket.io')(4000);
var upload = multer({ dest: 'static/images/users/'})

// DATABASE CONNECTIE ----------------------------------------------------------------------------------------------------
let db;
// const db_key = "mongodb+srv://" + process.env.DBUSER + ":" + process.env.DBPASS + process.env.CLUSTER + "/" + process.env.Q1 + "=" +  process.env.Q2 + "=" + process.env.Q3;
const db_key = process.env.URI;
MongoClient.connect(db_key, function (err, client) { if (err) { throw err } else {} db = client.db("mydb"); });

//  ----------------------------------------------------------------------------------------------------

// Expres requests ----------------------------------------------------------------------------------------------------
app
  .set('view engine', 'ejs')

  .use(express.static('static'))
  .use(bodyParser.urlencoded({ extended: true}))
  .use(bodyParser.json())
  .use(session({'secret': '343ji43j4n3jn4jk3n'}))

  .post('/edit', upload.single('picture'), edit_user)
  .post('/add', upload.single('picture'), add_user)
  .post('/register', upload.single('picture'), add_user)
  .post('/delete', delete_user)
  .post('/meet', filter)
  .post('/login', login)
  .post('/account', logout)
  .post('/edituser', upload.single('picture'), edit_user)
  .post('/reject', reject)
  .post('/invite', invite)

  .get('/', check_session, load_homepage)
  .get('/admin',check_session, adminpanel)
  .get('/add', check_session, add_userpage)
  .get('/register', add_registerpage)
  .get('/chatroom', check_session, load_chatroom_page)
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

//------------------------------------------------------------------------------------------------


// functies om met de database te communiceren


function check_session(req, res, next) {
  // if session does not exist -> redirect to login, else continue
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
}

// RENDER FUNCTIES ------------------------------------------------------------------------------------

function load_login_page(req, res, next) {
  res.render('pages/login');
}

function load_homepage(req, res, next) {
  res.render('pages/index', {user: req.session.user});
}

function add_userpage(req, res, next) {
  res.render('pages/add');
}

function add_registerpage(req, res, next) {
  res.render('pages/register');
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

function load_chatroom_page(req, res, next) {
  res.render('pages/chatroom', {user: req.session.user})
}


// ------------------------------------------------------------------------------------------------------------



function adminpanel(req, res, next) {

  // Laad het adminpanel als je naar /admin gaat

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

  // Voeg een user toe aan de database

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
    picture: req.file ? req.file.filename : null,
    possible_match : [],
    rejected_user : []
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

  // Verwijder een user uit de database

  db.collection('users').deleteOne({
    _id: ObjectID(req.body.id)
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

  // Verkrijg een user uit de database

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

  // Wijzig een user

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

async function exlude_list(current_user) {

  // Verkrijg de user uit de invite lijst en rejected lijst. Deze users moeten uit de resultaten blijven

   const user = await new Promise(resolve =>{
    resolve(db.collection("users").findOne({_id: ObjectID(current_user)}))
  }, 3000)

  const pos_match = user.possible_match;
  const reject_user = user.rejected_user;
  const exluded_users = pos_match.concat(reject_user)

  return exluded_users
}

async function init_meet(req, res, next) {

  // Haal mogelijke matches uit de database

  const current_user = req.session.user.id
  let exludelist = await exlude_list(current_user);

  const exl_lst = [];
  exludelist.forEach(user => {
    exl_lst.push(ObjectID(user));
  });

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
      $nin: exl_lst
    }
  }

  db.collection("users").findOne(query, done);

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.render('pages/meet', {user: data})
    }
  }
}

async function filter(req, res, next) {

  // Filter dmv het filter-formulier

  const current_user = req.session.user.id
  let exludelist = await exlude_list(current_user);

  const exl_lst = [];
  exludelist.forEach(user => {
    exl_lst.push(ObjectID(user));
  });

  console.log(exl_lst)

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
      $nin: exludelist
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

  // Login form

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

        // Sessie info

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
          rejected_users : [],
          invited_users : []
        }
        res.redirect('/')
      } else {
        res.redirect('/login')
      }
    }
  }
}

function logout(req, res, next) {

  // Loguit functie

  req.session.destroy();
  res.redirect('/login')
}

async function check_reject_list(logged_in_user, rejected_userID) {
  // check of de invited_user al in de invited_user lijst staat
  return new Promise(resolve =>{
    query = db.collection("users").findOne( {_id: ObjectID(logged_in_user)}, {rejected_user: { $eq: rejected_userID}});
    resolve(query);
  }, 3000)
}

async function addto_reject_list(logged_in_user, rejected_user) {
  // update invited list
  return new Promise(resolve =>{
    query = db.collection("users").updateOne({_id: ObjectID(logged_in_user)}, { $push: {rejected_user: rejected_user} })
    resolve(query)
  }, 3000)
}

async function reject(req, res, next) {

  // Reject handler om te kijken of de user al in de reject lijst staat

  const logged_in_user = req.session.user.id;
  const rejected_user = ObjectID(req.body.rejected_user);

  const reject_check = await check_reject_list(logged_in_user, rejected_user)

  if((reject_check.rejected_user).length > 0){
    // voeg niet toe
    res.redirect('/meet')
  }else{
    update_reject_list = await addto_reject_list(logged_in_user, rejected_user)
    res.redirect('/meet')
  }
}

async function check_invite_list(logged_in_user, invited_user) {
    // check of de invited_user al in de invited_user lijst staat
    return new Promise(resolve =>{
      query = db.collection("users").findOne( {_id: ObjectID(logged_in_user)}, {possible_match: { $eq: invited_user}});
      resolve(query);
    }, 3000)
}

async function addto_invite_list(logged_in_user, invited_user) {
  // update invited list
  return new Promise(resolve =>{
    query = db.collection("users").updateOne({_id: ObjectID(logged_in_user)}, { $push: {possible_match: invited_user} })
    resolve(query)
  }, 3000)
}

async function invite(req, res, next) {

// Invite handler om te kijken of de user al in de invite lijst staat

  const logged_in_user = req.session.user.id;
  const invited_user = ObjectID(req.body.matched_user);

  const invite_check = await check_invite_list(logged_in_user, invited_user);

  if((invite_check.possible_match).length > 0){
    // voeg niet toe aan invite lijst
    console.log("Gebruiker wordt niet toegevoegd")
    res.redirect('/meet')
  }else{
    console.log("Gebruiker wordt wel toegevoegd")
    update_invite_list = await addto_invite_list(logged_in_user, invited_user);
    res.redirect('/meet')
  }

}
