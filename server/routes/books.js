const express = require("express");
const auth = require("../middleware/auth");
const Book = require("../models/Book");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const upload = multer({
	dest: "uploads/", // Folder tempat file akan disimpan
	limits: { fileSize: 1000000 }, // Maksimal ukuran file 1MB
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("Please upload an image"));
		}
		cb(null, true);
	},
});

// Create Book
router.post("/", auth, upload.single("image"), async (req, res) => {
	const { title, author, category } = req.body;
	const image = req.file ? req.file.path : null; // Dapatkan path gambar dari file upload

	try {
		// Validasi kategori
		const cat = await Category.findById(category);
		if (!cat) {
			return res.status(400).json({ msg: "Category not found" });
		}

		// Buat buku baru
		const newBook = new Book({
			title,
			author,
			category,
			image,
		});

		// Simpan buku ke database
		const book = await newBook.save();
		res.json(book);
	} catch (err) {
		console.error("Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
});

// Get Books with Pagination & Filtering
router.get("/", async (req, res) => {
	const { category, page = 1, limit = 10 } = req.query;
	const query = category ? { category } : {};
	try {
		const books = await Book.find(query)
			.limit(parseInt(limit))
			.skip((page - 1) * parseInt(limit))
			.populate("category");
		const totalBooks = await Book.countDocuments(query);
		res.json({
			books,
			totalPages: Math.ceil(totalBooks / limit),
			currentPage: parseInt(page),
		});
	} catch (err) {
		res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
