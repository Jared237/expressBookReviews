const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get book list using Async/Await with Axios
public_users.get('/async-books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json({
            message: "Books retrieved successfully using Async/Await",
            books: response.data
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 11: Get book by ISBN using Promise with Axios
public_users.get('/async-isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            res.status(200).json({
                message: `Book with ISBN ${isbn} retrieved successfully using Promise`,
                book: response.data
            });
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book", error: error.message });
        });
});

// Task 12: Get books by author using Async/Await with Axios
public_users.get('/async-author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json({
            message: `Books by ${author} retrieved successfully using Async/Await`,
            books: response.data
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Task 13: Get books by title using Promise with Axios
public_users.get('/async-title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            res.status(200).json({
                message: `Books with title containing "${title}" retrieved successfully using Promise`,
                books: response.data
            });
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books by title", error: error.message });
        });
});

// Original Task 1: Get all books (synchronous)
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Original Task 2: Get book by ISBN (synchronous)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4));
    } else {
        res.status(404).json({message: "Book not found with ISBN: " + isbn});
    }
});

// Original Task 3: Get books by author (synchronous)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let foundBooks = [];
    
    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            foundBooks.push({
                "isbn": isbn,
                "title": books[isbn].title,
                "author": books[isbn].author,
                "reviews": books[isbn].reviews
            });
        }
    }
    
    if (foundBooks.length > 0) {
        res.send(JSON.stringify(foundBooks, null, 4));
    } else {
        res.status(404).json({message: "No books found by author: " + author});
    }
});

// Original Task 4: Get books by title (synchronous)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let foundBooks = [];
    
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            foundBooks.push({
                "isbn": isbn,
                "title": books[isbn].title,
                "author": books[isbn].author,
                "reviews": books[isbn].reviews
            });
        }
    }
    
    if (foundBooks.length > 0) {
        res.send(JSON.stringify(foundBooks, null, 4));
    } else {
        res.status(404).json({message: "No books found with title containing: " + title});
    }
});

// Original Task 5: Get book review (synchronous)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        if (Object.keys(books[isbn].reviews).length > 0) {
            res.send(JSON.stringify(books[isbn].reviews, null, 4));
        } else {
            res.json({message: "No reviews found for this book."});
        }
    } else {
        res.status(404).json({message: "Book not found with ISBN: " + isbn});
    }
});

public_users.post("/register", (req, res) => {
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
