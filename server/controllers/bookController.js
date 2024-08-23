import Book, { find, countDocuments, findByIdAndUpdate, findByIdAndDelete } from "../models/Book";
import Category from "../models/Category";
import { extname } from "path";
import multer, { diskStorage } from "multer";

const storage = diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

export async function createBook(req, res) {
	try {
		const { title, author, category } = req.body;
		const coverImage = req.file ? req.file.path : null;
		const book = new Book({ title, author, category, coverImage });
		await book.save();
		res.status(201).json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function getBooks(req, res) {
	try {
		const { category, page = 1, limit = 10 } = req.query;
		const query = category ? { category } : {};
		const books = await find(query)
			.populate("category")
			.skip((page - 1) * limit)
			.limit(Number(limit));
		const total = await countDocuments(query);
		res.status(200).json({ books, total });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function updateBook(req, res) {
	try {
		const { title, author, category } = req.body;
		const coverImage = req.file ? req.file.path : null;
		const book = await findByIdAndUpdate(req.params.id, { title, author, category, coverImage }, { new: true });
		res.status(200).json(book);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function deleteBook(req, res) {
	try {
		await findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

const _upload = upload.single("coverImage");
export { _upload as upload };
