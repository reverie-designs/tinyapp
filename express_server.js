//express_server.js
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //translates post data
const cookieSession = require('cookie-session'); //scrambled cookies
const bcrypt = require('bcrypt'); //encryptor
const {getUserIDByEmail, getURLSByUserID, renderError} = require('./helpers'); //Helper Functions


//decodes post data from buffer into string
app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieSession({
  name: 'session',
  keys: ['magic', 'words'],
}));


//sets ejs as the view engine - templating engine
app.set('view engine', 'ejs');


//This function was taken from https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript/9719815 - generates an 8 character rrandom string
const randomString = function() {
  return Math.random().toString(36).slice(-8);
};


let users = {
  'radomId': {
    id: 'radomID',
    email: 'email@gma.com',
    password: 'password',
  },
  'radomID2': {
    id: 'radomID',
    email: 'test@mail.com',
    password: 'password',
  }
};


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: 'radomID2'
  },
};


const errors = {
  registrationEmail: 'Sorry, we already have user registered with that email address.',
  loginEmail: 'Sorry, we could not find a user registered with thtat email address.',
  password: 'The password doesn\'t match the user email, please try again.',
  bothFields: 'You have to fill in both fields in order to register',
  noURLS: 'Sorry we don\'t have any urls that match your request',
  forbidden: 'You must be logged in to access this feature'
};


//redirects home page to /urls
app.get("/", (req, res) => {
  res.redirect("/urls/");
});


//summary of current short and long urls in your database
app.get("/urls", (req, res) => {
  let userURLS = getURLSByUserID(req.session.userId, urlDatabase);
  let templateVars = {user: users[req.session.userId], urls: userURLS};
  res.render('urls_index', templateVars);
});


//gets registration page
app.get("/urls/register", (req, res) => {
  let templateVars = {urls: urlDatabase, user: users[req.session.userId]};
  res.render('urls_register', templateVars);
});


//adding new user get cookies
app.post('/register', (req, res) => {
  //no emtpy strings
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send(renderError(400, 'BAD REQUEST', errors.bothFields));
  //cannot have user with same email address
  } else if (getUserIDByEmail(req.body.email, users)) {
    res.status(400);
    res.send(renderError(400, 'BAD REQUEST', errors.registrationEmail));
  } else {
    const userId = randomString();
    const textPassword = req.body.password;
    const password = bcrypt.hashSync(textPassword, 10);
    users[userId] = {id: userId, email: req.body.email, password: password};
    req.session.userId = userId;
    res.redirect('/urls');
  }
});


//login page
app.get("/urls/login", (req, res) => {
  let templateVars = {urls: urlDatabase, user: users[req.session.userId]};
  res.render('urls_login', templateVars);
});


//login get cookies
app.post("/login", (req, res) => {
  const email = req.body.email;
  const userId = getUserIDByEmail(email, users);
  if (!userId) {
    res.status(403);
    res.send(renderError(403, 'NOT FOUND', errors.loginEmail));
  } else {
    const password = req.body.password;
    let userPassword = users[userId].password;
    if (bcrypt.compareSync(password, userPassword)) {
      req.session.userId = userId;
      res.redirect("/urls");
    } else {
      res.status(403);
      res.send(renderError(403, 'No Matches', errors.password));
    }
  }
});


//logout clear cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//new tiny url page
app.get("/urls/new", (req, res) => {
  let templateVars = {user: users[req.session.userId], };
  if (templateVars.user) {
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
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404);
    res.send(renderError(404, 'NOT FOUND', errors.noURLS));
  }
});


//creating a new tiny url and adding it to the urlDatabase
app.post("/urls", (req, res) => {
  let userId = req.session.userId;
  let shortURL = randomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = {'longURL': longURL, 'userID': userId};
  res.redirect(`/urls/${shortURL}`);
});


//redirect to short url page after url creation
app.get("/urls/:ID", (req, res) => {
  let userURLS = getURLSByUserID(req.session.userId, urlDatabase);
  if (!req.session.userId || userURLS === 'undefined') {
    res.status(403);
    res.send(renderError(403, 'FORBIDDEN', errors.forbidden));
  } else {
    let url = userURLS[req.params.ID];
    let templateVars = {'longURL': url.longURL, 'shortURL': url.shortURL, userId: req.session.userId, user: users[req.session.userId]};
    res.render("urls_show", templateVars);
  }
});


//edit long url
app.post("/urls/:ID/edit", (req, res) => {
  let urls = getURLSByUserID(req.session.userId, urlDatabase);
  if (!req.session.userId || !urls) {
    res.redirect(`/urls`);
  } else {
    urlDatabase[req.params.ID].longURL = req.body.longURL;
    res.redirect(`/urls`);
  }
});


//delete url from database and redirect to main page
app.post("/urls/:ID/delete", (req, res) => {
  let urls = getURLSByUserID(req.session.userId, urlDatabase);
  if (!req.session.userId || !urls) {
    res.redirect('/urls/login');
  } else {
    delete urlDatabase[req.params.ID];
    res.redirect('/urls');
  }
});


//get urls.json object which has the database of our urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
