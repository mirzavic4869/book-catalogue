const Book = require("../models/Book");
const Category = require("../models/Category");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

exports.createBook = async (req, res) => {
	try {
		const { title, author, category } = req.body;
		const coverImage = req.file ? req.file.path : null;
		const book = new Book({ title, author, category, coverImage });
		await book.save();
		res.status(201).json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getBooks = async (req, res) => {
	try {
		const { category, page = 1, limit = 10 } = req.query;
		const query = category ? { category } : {};
		const books = await Book.find(query)
			.populate("category")
			.skip((page - 1) * limit)
			.limit(Number(limit));
		const total = await Book.countDocuments(query);
		res.status(200).json({ books, total });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.updateBook = async (req, res) => {
	try {
		const { title, author, category } = req.body;
		const coverImage = req.file ? req.file.path : null;
		const book = await Book.findByIdAndUpdate(req.params.id, { title, author, category, coverImage }, { new: true });
		res.status(200).json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteBook = async (req, res) => {
	try {
		await Book.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.upload = upload.single("coverImage");
