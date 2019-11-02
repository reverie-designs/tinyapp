const { assert } = require('chai');
const { getUserIDByEmail, getURLSByUserID } = require('../helpers.js');

//sample user Database
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


describe('getUserIDByEmail', function() {
  it('should return a user id with valid email', function() {
    const userID = getUserIDByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(expectedOutput, userID);
  });
  it('should return undefined', function() {
    const userID = getUserIDByEmail("one@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(expectedOutput, userID);
  });
});

//sample URL database
const testURLs = {
    shortURL1: {
      longURL: "https://www.tsn.ca",
      userID: 'radomID2'
    },
    shortURL2: {
      longURL: "https://www.google.ca",
      userID: 'radomID1'
    }
};


describe('getURLSByUserID', function() {
  it('should return a url that belongs to that user', function() {
    const userURLs = getURLSByUserID("radomID1", testURLs)
    const expectedOutput = {shortURL2: {
      longURL: "https://www.google.ca",
      userID: 'radomID1',
      shortURL: "shortURL2"
    }};
    assert.deepEqual(expectedOutput, userURLs);
  });
  it('should return undefined', function() {
    const userURLs = getURLSByUserID("one@example.com", testURLs)
    const expectedOutput = undefined;
    assert.deepEqual(expectedOutput, userURLs);
  });
});