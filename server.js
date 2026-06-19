require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next();
});

const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});