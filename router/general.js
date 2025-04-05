const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function for async operations
const getBookListAsync = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    
    // Check if username already exists
    if (users.find(user => user.username === username)) {
        return res.status(409).json({message: "Username already exists"});
    }
    
    // Add new user
    users.push({ username, password });
    return res.status(201).json({message: "User successfully registered"});
});

//Get all books async
public_users.get('/async', async function (req, res) {
    try {
        const bookList = await getBookListAsync('http://localhost:5000/');
        res.json(bookList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
    }
});


// Get book details based on ISBN async
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const requestedIsbn = req.params.isbn;
        const book = await getBookListAsync('http://localhost:5000/isbn/' + requestedIsbn);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
// Get book details based on author async
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const requestedAuthor = req.params.author;
        const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});

// Get all books based on title async
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const requestedTitle = req.params.title;
        const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            isbn: isbn,
            reviews: books[isbn].reviews
        });
    }
    
    return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
