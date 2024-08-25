const express = require("express");
const auth = require("../middleware/auth");
const Book = require("../models/Book");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

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
	const { category, page = 1, limit = 9 } = req.query;
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

router.put("/:id", auth, upload.single("image"), async (req, res) => {
	const { id } = req.params;
	const { title, author, category } = req.body;
	const image = req.file ? req.file.path : null; // Dapatkan path gambar dari file upload

	try {
		// Cari buku berdasarkan ID
		const book = await Book.findById(id);
		if (!book) {
			return res.status(404).json({ msg: "Book not found" });
		}

		// Validasi kategori
		const cat = await Category.findById(category);
		if (!cat) {
			return res.status(400).json({ msg: "Category not found" });
		}

		// Perbarui buku
		book.title = title || book.title;
		book.author = author || book.author;
		book.category = category || book.category;
		book.image = image || book.image; // Gambar hanya diperbarui jika ada

		// Simpan perubahan
		await book.save();

		res.json(book);
	} catch (err) {
		console.error("Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
});

router.delete("/:id", auth, async (req, res) => {
	const { id } = req.params;

	try {
		// Cari buku berdasarkan ID
		const book = await Book.findById(id);
		if (!book) {
			return res.status(404).json({ msg: "Book not found" });
		}

		// Hapus buku
		await Book.findByIdAndDelete(id);

		res.json({ msg: "Book deleted successfully" });
	} catch (err) {
		console.error("Error:", err.message);
		res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
