import { useState, useEffect } from "react";
import axios from "axios";

const BookPage = () => {
	const [books, setBooks] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [editingBook, setEditingBook] = useState(null);
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [image, setImage] = useState(null);
	const [bookCategory, setBookCategory] = useState("");

	useEffect(() => {
		fetchCategories();
		fetchBooks();
	}, [selectedCategory, currentPage]);

	const fetchCategories = async () => {
		const res = await axios.get("http://localhost:5000/api/categories");
		setCategories(res.data);
	};

	const fetchBooks = async () => {
		const res = await axios.get("http://localhost:5000/api/books", {
			params: {
				category: selectedCategory,
				page: currentPage,
			},
		});
		setBooks(res.data.books);
		setTotalPages(res.data.totalPages);
	};

	const handleEditBook = (book) => {
		setEditingBook(book);
		setTitle(book.title);
		setAuthor(book.author);
		setImage(null);
		setBookCategory(book.category);
	};

	const handleDeleteBook = async (bookId) => {
		try {
			await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
				headers: {
					"x-auth-token": localStorage.getItem("token"),
				},
			});
			fetchBooks();
		} catch (err) {
			console.error(err);
		}
	};

	const handleUpdateBook = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("title", title);
			formData.append("author", author);
			if (image) formData.append("image", image);
			formData.append("category", bookCategory);

			if (editingBook) {
				await axios.put(`http://localhost:5000/api/books/${editingBook._id}`, formData, {
					headers: {
						"x-auth-token": localStorage.getItem("token"),
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				await axios.post("http://localhost:5000/api/books", formData, {
					headers: {
						"x-auth-token": localStorage.getItem("token"),
						"Content-Type": "multipart/form-data",
					},
				});
			}

			setEditingBook(null);
			setTitle("");
			setAuthor("");
			setImage(null);
			setBookCategory("");
			fetchBooks();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="container p-4 mx-auto">
			<h2 className="mb-8 text-3xl font-bold text-center text-zinc-800">Books</h2>

			{/* Form for Adding/Editing Book */}
			<form onSubmit={handleUpdateBook} className="max-w-md px-6 py-8 mx-auto mb-8 bg-white rounded shadow-md">
				<div className="mb-4">
					<label htmlFor="title" className="block mb-2 font-medium text-zinc-700">
						Book Title
					</label>
					<input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300" />
				</div>

				<div className="mb-4">
					<label htmlFor="author" className="block mb-2 font-medium text-zinc-700">
						Author
					</label>
					<input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300" />
				</div>

				<div className="mb-4">
					<label htmlFor="image" className="block mb-2 font-medium text-zinc-700">
						Book Image
					</label>
					<input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300" />
				</div>

				<div className="mb-4">
					<label htmlFor="bookCategory" className="block mb-2 font-medium text-zinc-700">
						Category
					</label>
					<select id="bookCategory" value={bookCategory} onChange={(e) => setBookCategory(e.target.value)} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300">
						<option value="">Select Category</option>
						{categories.map((category) => (
							<option key={category._id} value={category._id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
					{editingBook ? "Update Book" : "Add Book"}
				</button>
			</form>

			{/* Filter by Category */}
			<div className="mb-4">
				<label htmlFor="category" className="block mb-2 font-medium text-zinc-700">
					Filter by Category
				</label>
				<select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300">
					<option value="">All Categories</option>
					{categories.map((category) => (
						<option key={category._id} value={category._id}>
							{category.name}
						</option>
					))}
				</select>
			</div>

			{/* Book List */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{books.map((book) => (
					<div key={book._id} className="p-4 bg-white rounded shadow">
						<img src={`http://localhost:5000/uploads/${book.image.replace("uploads\\", "")}`} alt={book.title} className="object-cover w-full h-48 mb-4 rounded" />
						<h3 className="mb-2 text-xl font-bold">{book.title}</h3>
						<p className="mb-2 text-zinc-700">by {book.author}</p>
						<div className="flex space-x-2">
							<button onClick={() => handleEditBook(book)} className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600">
								Edit
							</button>
							<button onClick={() => handleDeleteBook(book._id)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className="flex justify-center mt-8">
				<nav className="inline-flex shadow">
					{Array.from({ length: totalPages }, (_, i) => (
						<button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500"} hover:bg-blue-600 hover:text-white`}>
							{i + 1}
						</button>
					))}
				</nav>
			</div>
		</div>
	);
};

export default BookPage;
