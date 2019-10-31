//express_server.js

const express = require("express");
const app = express();
cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //translates post data
// const methodOverride = require("method-override");

//decodes post data from buffer into string
app.use(bodyParser.urlencoded({extended: true})); 
app.use(cookieParser());
//uses method override to conver post to put
// app.use(methodOverride('_method'));

//sets ejs as the view engine - templating engine
app.set('view engine', 'ejs'); 

const urlDatabase = {
  b6UTxQ: { 
    longURL: "https://www.tsn.ca", 
    userID: 'radomID2' 
  },
};

//This function was taken from https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript/9719815 - generates an 8 character rrandom string
var randomString = function (){
  return Math.random().toString(36).slice(-8);
}

//Will store user registration ===================================
let users = {
  'radomId': {
    id: 'radomID',
    email: 'email',
    password: 'password',
  },
  'radomID2': {
    id: 'radomID',
    email: 'test@mail.com',
    password: 'password',
  }
};

//does registration email already exist?

const emailExists = (email) => {
  const userIds = Object.keys(users)
  for (let userId of userIds) {
    if (users[userId].email === email) {
      return true;
    }
  }
};

const getUserByEmail = (email) => {
  const userIds = Object.keys(users)
  for (let userId of userIds) {
    if (users[userId].email === email) {
      return userId;
    }
  }
};

const getURLSByUserId = (userID) => {
  // console.log(userID);
  const urlIds = Object.keys(urlDatabase);
  // console.log(urlIds);
  let userUrls = {};
  if (userID){
    urlIds.forEach((item) => {
      if (urlDatabase[item].userID === userID) {
        urlDatabase[item].shortURL = item;
        userUrls[item] = (urlDatabase[item]);
      }
    });
    return userUrls;
  }
};

//redirects home page to /urls
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls/");
});


//summary of current short and long urls in your database
app.get("/urls", (req, res) => {
  let userId = req.cookies.userId;
  // console.log(userId);
  let userURLS = getURLSByUserId(userId);
  // console.log('USER URLS', userURLS);
  // for (let userUrl of userURLS){
  //   console.log('USER short URLS', userUrl.shortURL);
  // }
  let templateVars = {user: users[req.cookies.userId], urls: userURLS};
  res.render('urls_index', templateVars);
});

//gets registration page
app.get("/urls/register", (req, res) => {
  let templateVars = {urls: urlDatabase, user: users[req.cookies.userId]};
  res.render('urls_register', templateVars);
});

//adding new user
app.post('/register', (req, res) => {
  //no emtpy strings
  if (req.body.email === "" || req.body.password === "") {
    res.send('Please fill in both fields in order to register');
    res.sendStatus(400);  
  //cannot have user with same email address
  } else if (emailExists(req.body.email)) {
    res.send('We already have a user registered with that email address');
    res.sendStatus(400); 
  } else {
    const userId = randomString();
    users[userId] = {id: userId, email: req.body.email, password: req.body.password};
    res.cookie('userId', userId);
    res.redirect('/urls');
  }
});

//login page
app.get("/urls/login", (req, res) => {
  let templateVars = {urls: urlDatabase, user: users[req.cookies.userId]};
  res.render('urls_login', templateVars);
});

//login get cookies
app.post("/login", (req, res) => {
  let email = req.body.email;
  let userId = getUserByEmail(email);
  let password = req.body.password;
  if (!userId){
    res.send('Could not find user with that email');
    res.sendStatus(403);
  } else {
    if (users[userId].password !== password) {
      res.send('The password doesn\'t match the provided email');
      res.sendStatus(403);
    } else {
      res.cookie('userId', getUserByEmail(email));
      res.redirect("/urls");
    }
  }
});

//logout clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie('userId', req.cookies.userId);
  res.redirect("/urls");
});

//make new tiny url page
app.get("/urls/new", (req, res) => { 
  let templateVars = {user: users[req.cookies.userId], };
  if (templateVars.user){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls/login");
  }
});

//redirecting short url to long url
app.get("/u/:shortURL", (req, res) => {
  // console.log('=======THis IS THE BODY', req.params.longURL);
  let urlID = req.params.shortURL;
  console.log('THIS IS YOUR URL ID', urlID);
  const shortURL = urlDatabase[urlID];
  // console.log('your URL Object', shortURL);
  const longURL = shortURL.longURL;
  console.log('YOU LONG URL', longURL);
  // console.log(urlId, 'THIS IS YOUR URL OBJECT');
  if (longURL){
    res.redirect(longURL);
  } else {
    res.status(404);
    res.send('Sorry we don\'t have any urls that match your request');
  }
});
//redirect to edit a long url
// app.get("/urls/:shortURL", (req, res) => {
//   let userId = req.cookies.userId;
//   console.log('COOKIE', userId);
//   let userURLS = getURLSByUserId(userId);
//   console.log('COOKIE URLS', userURLS);
//   let url = userURLS[req.params.shortURL];
//   let templateVars = {'longURL': url.longURL, 'shortURL': url.shortURL, userId: req.cookies.userId, user: users[userId]};
//   res.redirect(`/urls/${req.params.shortURL}`, templateVars);
// });

//creating a new tiny url and adding it to the urlDatabase
app.post("/urls", (req, res) => {
  let shortURL = randomString();
  let longURL = req.body.longURL
  // console.log('THIS Is YOUR LONG URL', longURL);
  let userId = req.cookies.userId;
  urlDatabase[shortURL] = {'longURL': longURL, 'userID': userId};
  console.log('UPDATED DATA BASE:', urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//redirect to short url page after url creation
app.get("/urls/:ID", (req, res) => {
  let userId = req.cookies.userId;
  let userUrls = getURLSByUserId(userId);
  let url = userUrls[req.params.ID];
  let templateVars = {'longURL': url.longURL, 'shortURL': url.shortURL, userId: req.cookies.userId, user: users[userId]};
  res.render("urls_show", templateVars);
});




//edit long url
app.post("/urls/:shortURL/edit", (req, res) => {
  if(req.cookies.userId){
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect(`/urls`);
  } else {
    res.redirect(`/urls`);
  }
  
});

//delete a short url and redirect to main page
app.post("/urls/:shortURL/delete", (req, res) => {
  if(!req.cookies.userId){
    res.redirect('/urls/login');
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});

//get urls.json object which has the database of our urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
