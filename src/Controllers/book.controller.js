const express = require('express');
const BookModel = require('../Models/book.model');

const BookController = express.Router();

// Create a new book

BookController.post('/', async (req, res) => {
    const { title, author, publicationYear } = req.body;
    if (!title || !author || !publicationYear) {
        return res.status(400).send({ msg: 'All fields are required!' });
    }
    if (typeof title !== 'string' || typeof author !== 'string' || typeof publicationYear !== 'number') {
        return res.status(400).send({ msg: 'Invalid data format!' });
    }
    if (publicationYear < 0 || publicationYear > new Date().getFullYear()) {
        return res.status(400).send({ msg: 'Invalid publication year!' });
    }

    try {
        const book = await BookModel.create({
            title: title,
            author: author,
            publicationYear: publicationYear
        });
        res.status(201).send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

// Get all books

BookController.get('/', async (req, res) => {
    const { author, year } = req.query;
    let query = {};

    // filtering by author
    if (author) {
        query.author = author;
    }
    
    // filtering by publication year
    if (year) {
        query.publicationYear = year;
    }

    try {
        const books = await BookModel.find(query);
        res.status(200).send(books);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

// Get a book by ID

BookController.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await BookModel.findById(id);
        if (!book) {
            return res.status(404).send({ msg: 'Book not found!' });
        }
        res.status(200).send(book);
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

// Update a book by ID

BookController.patch('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { title, author, publicationYear } = req.body;

    if (title && typeof title !== 'string') {
        return res.status(400).send({ msg: 'Invalid title format!' });
    }
    if (author && typeof author !== 'string') {
        return res.status(400).send({ msg: 'Invalid author format!' });
    }
    if (publicationYear && (typeof publicationYear !== 'number' || publicationYear < 0 || publicationYear > new Date().getFullYear())) {
        return res.status(400).send({ msg: 'Invalid publication year!' });
    }

    try {
        const updatedBook = await BookModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ msg: 'Book not found!' });
        }
        res.status(200).send({ msg: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

// Delete a book by ID

BookController.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await BookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ msg: 'Book not found!' });
        }
        res.status(200).send({ msg: 'Book deleted successfully', book: deletedBook });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

module.exports = BookController;
