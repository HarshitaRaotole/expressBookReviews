const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  });
  res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  });
  res.send(JSON.stringify(booksByTitle, null, 4));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/async/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3000/');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching book list via Async/Await"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:3000/isbn/${isbn}`)
    .then(response => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      res.status(500).json({message: `Error fetching book with ISBN ${isbn} via Promises`});
    });
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:3000/author/${author}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books by author via Async/Await"});
  }
});

// Task 13: Get book details based on title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:3000/title/${title}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books by title via Async/Await"});
  }
});

module.exports.general = public_users;
