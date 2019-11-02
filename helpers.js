const getUserIDByEmail = (email, userDatabase)=>{
  const userIds = Object.keys(userDatabase);
  for (let userId of userIds) {
    if (userDatabase[userId].email === email) {
      return userId;
    }
  }
};

const getURLSByUserID = (userID, urlDatabase) => {
  const urlIDs = Object.keys(urlDatabase);
  let userUrls = {};
  if (userID) {
    urlIDs.forEach((item) => {
      if (urlDatabase[item].userID === userID) {
        urlDatabase[item].shortURL = item;
        userUrls[item] = (urlDatabase[item]);
      }
    });
    return userUrls;
  }
};

const renderError = (status, title,  msg) => {
  return `<div style="text-align: center; margin-top: 10%;">
                 <h1>${title} ${status}</h1>
                 <p style="font-size: 1.5em; text-decoration: underline;">${msg}</p>
                 <p>Go back to <a href="/urls">TinyApp</a></p>
               </div>`;
 };

module.exports = {getUserIDByEmail, getURLSByUserID, renderError};