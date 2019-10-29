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

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
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
  console.log(req.params.shortURL);
  console.log(templateVars);
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
    // console.log(req.body);
    let shortURL = `${randomString}`;
    urlDatabase[shortURL] = req.body.longURL;
    // console.log(urlDatabase);
    res.redirect(`/urls/${shortURL}`);
});

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
