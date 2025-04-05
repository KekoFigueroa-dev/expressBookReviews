const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Validate username
const isValid = (username)=> {
    return username && username.length > 0;
}

// Authenticate user
const authenticatedUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
}

// Login endpoint
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    // Check if user exists and password matches
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({message: "Invalid credentials"});
    }

    // Generate JWT token
    const token = jwt.sign({ username: username }, "access", { expiresIn: '24h' });
    
    // Save token in session
    req.session.authorization = {
        accessToken: token
    }

    return res.status(200).json({message: "User successfully logged in", token: token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({message: "Review is required"});
    }

    // Add or modify the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully posted",
        book: books[isbn].title,
        review: review,
        username: username
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    // Check if the user has a review for this book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "No review found for this user"});
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review successfully deleted",
        book: books[isbn].title
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
