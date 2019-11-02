# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of: TinyApp home page before the user registers or loggs in: "](https://github.com/reverie-designs/tinyapp/blob/master/docs/urls-page-logged-out.png)

!["Screenshot of: TinyApp home page when the user is logged in:"](https://github.com/reverie-designs/tinyapp/blob/master/docs/urls-page-logged-in.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- You should see `TinyApp listening on port 8080!` in your terminal
- Head on over to your favourite browser and enter -> `localhost:8080`
- Create an account in order to make your tiny URL
- To share your tiny URL with friends use `localhost:8080/u/`<your short URL goes here> Note: you do not have to be logged-in in order to share the tiny URL
- Edit or Delete your URL with the buttons on the main page
- Log-out until next time!
- As long as the server is not down or restarted your session will be remembered.
- Have your family and friends create more profiles and tiny URLS!
- To exit the server `<ctrl+c>`

## Documentation
The following functions are implemented in this app, you can find them in helpers.js file in the main directory

* `getUserIDByEmail(email, userDatabase)`: a function that takes in an email and database and returns a user id, if matched is found in database
* `getURLSByUserID(userID, urlDatabase)`: a function that takes in a userID and a database and returns an object - in this case an object of urls that belong to the user with the specified user ID
* `renderError(status, title, msg)`: function that takes in an html status code, an error title and msg, and returns a string of html that will print to the user's screen should they encounter that error. 
* if you wish to test the above functions please make sure to install mocha chai using the following command:`npm install mocha chai --save-dev` 
  - change your test scripts in the package.json to include `"./node_modules/mocha/bin/mocha"`
  - now you are ready to test the functions. In your terminal from the tinyapp directory run run `npm test`

## Troubleshooting

- If you change anything in the files please make sure to restart the server to see the changes on the client / browser

### Changing PORTs

In the express_server.js file change  `const PORT = 8080;` to your desired PORT

### Vagrant

`Error: listen EADDRINUSE :::8080`
In the off chance that you encounter this error while running the app from vagrant consider restarting vagrant and your computer to clear listener cache.
