const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => user.username === username);
    return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
};

// Task 6: Register
regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (isValid(username)) {
        return res.status(409).json({message: "Username already exists. Please choose a different username."});
    }

    users.push({
        "username": username,
        "password": password
    });

    return res.status(201).json({message: "User successfully registered. You can now login."});
});

// Task 7: Login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ username: username }, "access", { expiresIn: "1h" });
        
        req.session.authorization = {
            accessToken: accessToken
        };
        
        return res.status(200).json({message: "User successfully logged in", token: accessToken});
    } else {
        return res.status(401).json({message: "Invalid username or password. Please try again."});
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    
    let username = null;
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        try {
            const decoded = jwt.verify(token, "access");
            username = decoded.username;
        } catch(err) {
            return res.status(401).json({message: "Invalid token"});
        }
    }
    
    if (!username) {
        return res.status(401).json({message: "User not authenticated"});
    }
    
    if (!review) {
        return res.status(400).json({message: "Review text is required"});
    }
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found with ISBN: " + isbn});
    }
    
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({
        message: "Review successfully added/updated",
        isbn: isbn,
        book_title: books[isbn].title,
        username: username,
        review: review
    });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    let username = null;
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        try {
            const decoded = jwt.verify(token, "access");
            username = decoded.username;
        } catch(err) {
            return res.status(401).json({message: "Invalid token"});
        }
    }
    
    if (!username) {
        return res.status(401).json({message: "User not authenticated"});
    }
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found with ISBN: " + isbn});
    }
    
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: "Review successfully deleted",
            isbn: isbn,
            book_title: books[isbn].title,
            username: username
        });
    } else {
        return res.status(404).json({
            message: "No review found for this user on this book",
            username: username,
            isbn: isbn
        });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
