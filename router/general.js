const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/',function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(Object.entries(books).map(([id, book]) => ({
        id,
        author: book.author,
        title: book.title
    })));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    // Check if the book exists
    if (books[isbn]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            id: isbn,
            author: books[isbn].author,
            title: books[isbn].title
        });
    }
    
    return res.status(404).json({message: "Book not found"});
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.entries(books)
        .filter(([_, book]) => book.author.toLowerCase() === author.toLowerCase())
        .map(([id, book]) => ({
            id,
            author: book.author,
            title: book.title,
            reviews: book.reviews
        }));

    if (booksByAuthor.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(booksByAuthor);
    }
    
    return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.entries(books)
        .filter(([_, book]) => book.title.toLowerCase() === title.toLowerCase())
        .map(([id, book]) => ({
            id,
            author: book.author,
            title: book.title,
            reviews: book.reviews
        }));

    if (booksByTitle.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(booksByTitle);
    }
    
    return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
