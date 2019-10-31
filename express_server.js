//express_server.js

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //translates post data
const bcrypt = require('bcrypt');

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


const getUserByEmail = (email) => {
  const userIds = Object.keys(users)
  for (let userId of userIds) {
    if (users[userId].email === email) {
      return userId;
    }
  }
};

const getURLSByUserId = (userID) => {
  const urlIDs = Object.keys(urlDatabase);
  let userUrls = {};
  if (userID){
    urlIDs.forEach((item) => {
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
  res.redirect("/urls/");
});


//summary of current short and long urls in your database
app.get("/urls", (req, res) => {
  let userId = req.cookies.userId;
  let userURLS = getURLSByUserId(userId);
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
  } else if (getUserByEmail(req.body.email)) {
    res.send('We already have a user registered with that email address');
    res.sendStatus(400); 
  } else {
    const userId = randomString();
    const textPassword = req.body.password;
    console.log('PASSWORD',textPassword);
    const password = bcrypt.hashSync(textPassword, 10);
    console.log('PASSWORD',password);
    users[userId] = {id: userId, email: req.body.email, password: password};
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
  const email = req.body.email;
  const userId = getUserByEmail(email);
  if (!userId){
    res.send('Could not find user with that email');
    res.sendStatus(403);
  } else {
    const password = req.body.password;
    let userPassword = users[userId].password;
    if (bcrypt.compareSync(password, userPassword)) {
      res.cookie('userId', getUserByEmail(email));
      res.redirect("/urls");   
    } else {
      res.send('The password doesn\'t match the provided email');
      res.sendStatus(403);
    }
  }
});
console.log(users);
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
  let urlID = req.params.shortURL;
  const shortURL = urlDatabase[urlID];
  const longURL = shortURL.longURL;
  if (longURL){
    res.redirect(longURL);
  } else {
    res.status(404);
    res.send('Sorry we don\'t have any urls that match your request');
  }
});

//creating a new tiny url and adding it to the urlDatabase
app.post("/urls", (req, res) => {
  let shortURL = randomString();
  let longURL = req.body.longURL
  let userId = req.cookies.userId;
  urlDatabase[shortURL] = {'longURL': longURL, 'userID': userId};
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
