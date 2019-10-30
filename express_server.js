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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  let usersArray = Object.entries(users);
  for (let userId of userIds) {
    console.log('THIS IS THE INCOMIG VAR:', email);
    console.log('THIS IS THE USERS FILE', users[userId].email);
    if (users[userId].email === email) {
      return true;
    }
  }
};


//redirects home page to /urls
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls/");
});


//summary of current short and long urls in your database
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, user: users[req.cookies.userId]};
  res.render('urls_index', templateVars);
});

//gets registration page
app.get("/urls/register", (req, res) => {
  console.log(users[req.cookies.userId]);
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
    console.log('============ ', req.body.email);
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

// //login get cookies
// app.post("/login", (req, res) => {
//   console.log("Someone tried to sign in");
//   // console.log(req.body.username);
//   console.log(req.cookies.username);
//   // templateVars.username = req.body.username;
//   res.cookie('username', req.body.username);
//   res.redirect("/urls");
// });

//logout clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie('userId', req.cookies.userId);
  res.redirect("/urls");
});

// let templateVars = {
//   username: req.cookies["username"]
// };
//make new tiny url page
app.get("/urls/new", (req, res) => { 
  // console.log(templateVars.username);
  res.render("urls_new", {username: req.cookies.username});
});

//access the long url of short url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userId: req.cookies.userId};
  res.render("urls_show", templateVars);
});



//creating a new tiny url and adding it to the urlDatabase
app.post("/urls", (req, res) => {
    let shortURL = randomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
});

//redirecting short url to long url
app.get("/u/:shortURL", (req, res) => {
  res.redirect(302);
});

//redirect to edit a long url
app.get("/urls/:shortURL", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
});

//edit long url
app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});

//delete a short url and redirect to main page
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  // console.log(req.params.shortURL);
  res.redirect('/urls');
});

//get urls.json object which has the database of our urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
