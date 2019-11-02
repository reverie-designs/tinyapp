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


module.exports = {getUserIDByEmail, getURLSByUserID};