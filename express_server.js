//express_server.js

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser"); //translates post data

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//This function was taken from https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript/9719815 - generates an 8 character rrandom string
var randomString = Math.random().toString(36).slice(-8);

app.use(bodyParser.urlencoded({extended: true})); //decodes post data from buffer into string

app.set('view engine', 'ejs'); //sets ejs as the view engine - templating engine

//redirects home page to /urls
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls/");
});

//TEST CODE
// app.get("/hello", (req, res) => {
//   res.redirect("/urls/");
// });

//summary of current short and long urls in your database
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase}  ;
  res.render('urls_index', templateVars);
});

//make new tiny url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//access the long url of short url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

//creating a new tiny url and adding it to the urlDatabase
app.post("/urls", (req, res) => {
    let shortURL = `${randomString}`;
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect(`/urls/${shortURL}`);
});

//redirecting short url to long url
app.get("/u/:shortURL", (req, res) => {
  res.redirect(302);
});

//get urls.json object which has the database of our urls
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//need to add code for edge cases where the short code doesn't exist
