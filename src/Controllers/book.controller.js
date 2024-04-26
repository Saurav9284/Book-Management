const express = require('express');
const BookModel = require('../Models/book.model');
const authorization = require('../Middleware/authorization')
const BookController = express.Router();

// Create a new book

BookController.post('/',authorization, async (req, res) => {
    const { title, author, publicationYear } = req.body;
    const userId = req.userId
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
            publicationYear: publicationYear,
            createrId:userId
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

BookController.get('/:id',authorization, async (req, res) => {
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

// Update book

BookController.patch('/edit/:id', authorization, async (req, res) => {
    const id = req.params.id;
    const createrId = req.userId;
    const { title, author, publicationYear } = req.body;

    try {
        const book = await BookModel.findOne({ _id: id, createrId });
        if (!book) {
            return res.status(404).send({ msg: 'Book not found or unauthorized!' });
        }

        if (title) book.title = title;
        if (author) book.author = author;
        if (publicationYear) book.publicationYear = publicationYear;

        await book.save();

        res.status(200).send({ msg: 'Book updated successfully', book });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

// Delete a book by ID

BookController.delete('/delete/:id', authorization, async (req, res) => {
    const { id } = req.params;
    const createrId = req.userId;

    try {
        const book = await BookModel.findOneAndDelete({ _id: id, createrId });
        if (!book) {
            return res.status(404).send({ msg: 'Book not found or unauthorized!' });
        }
        res.status(200).send({ msg: 'Book deleted successfully', book });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal server error!' });
    }
});

module.exports = BookController;
