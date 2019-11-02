const getUserIDByEmail = (email, database)=>{
  const userIds = Object.keys(database);
  for (let userId of userIds) {
    if (database[userId].email === email) {
      return userId;
    }
  }
};




module.exports = {getUserIDByEmail};