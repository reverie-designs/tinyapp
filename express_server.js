//express_server.js

const express = require("express");
const app = express();
cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //translates post data
// const methodOverride = require("method-override");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//This function was taken from https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript/9719815 - generates an 8 character rrandom string
var randomString = function (){
  return Math.random().toString(36).slice(-8);
}

//storing cookies
// let templateVars = {

// };
//decodes post data from buffer into string
app.use(bodyParser.urlencoded({extended: true})); 
app.use(cookieParser());
//uses method override to conver post to put
// app.use(methodOverride('_method'));

//sets ejs as the view engine - templating engine
app.set('view engine', 'ejs'); 

//redirects home page to /urls
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls/");
});

// catching cookies
// app.get('/', function (req, res) {
  
//   console.log('Cookies: ', req.cookies)

// })

//summary of current short and long urls in your database
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, username: req.cookies.username};
  res.render('urls_index', templateVars);
});

//login get cookies
app.post("/login", (req, res) => {
  console.log("Someone tried to sign in");
  // console.log(req.body.username);
  console.log(req.cookies.username);
  // templateVars.username = req.body.username;
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

//logout clear cookies
app.post("/logout", (req, res) => {
  res.clearCookie('username', req.cookies.username);
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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username};
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

//need to add code for edge cases where the short code doesn't exist