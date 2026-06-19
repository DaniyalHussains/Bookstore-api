const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async(req, res) => {
    try {
        const { author, genre, page = 1, limit = 5 } = req.query;

        const filter = {};

        if (author) filter.author = author;
        if (genre) filter.genre = genre;

        const books = await Book.find(filter)
            .limit(Number(limit))
            .skip((page - 1) * limit);

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async(req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async(req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                error: "Title, author and price are required",
            });
        }

        const book = new Book(req.body);

        await book.save();

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async(req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                error: "Title, author and price are required",
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(200).json({
            message: "Book deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;