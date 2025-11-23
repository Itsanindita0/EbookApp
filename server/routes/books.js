const express = require('express');
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = { _id: decoded._id };
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Multer setup for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Upload Book
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, author, description } = req.body;
        // Store path as 'uploads/filename' so it matches the static route
        const fileUrl = 'uploads/' + req.file.filename;

        const book = new Book({
            title,
            author,
            description,
            fileUrl,
            userId: req.user._id
        });

        await book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get User's Books
router.get('/', auth, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user._id });
        res.send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get Book by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, userId: req.user._id });
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
