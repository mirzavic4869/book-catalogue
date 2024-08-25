import { useState, useEffect } from "react";
import axios from "axios";

const CategoryPage = () => {
	const [categories, setCategories] = useState([]);
	const [name, setName] = useState("");
	const [editingCategory, setEditingCategory] = useState(null);

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		const res = await axios.get("http://localhost:5000/api/categories");
		setCategories(res.data);
	};

	const handleAddCategory = async (e) => {
		e.preventDefault();
		try {
			if (editingCategory) {
				// Update existing category
				await axios.put(
					`http://localhost:5000/api/categories/${editingCategory._id}`,
					{ name },
					{
						headers: {
							"x-auth-token": localStorage.getItem("token"),
						},
					}
				);
				setEditingCategory(null);
			} else {
				// Add new category
				await axios.post(
					"http://localhost:5000/api/categories",
					{ name },
					{
						headers: {
							"x-auth-token": localStorage.getItem("token"),
						},
					}
				);
			}
			fetchCategories();
			setName("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleEditCategory = (category) => {
		setName(category.name);
		setEditingCategory(category);
	};

	const handleDeleteCategory = async (categoryId) => {
		try {
			await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
				headers: {
					"x-auth-token": localStorage.getItem("token"),
				},
			});
			fetchCategories();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-3xl text-zinc-800 font-bold text-center mb-8">Categories</h2>

			<form onSubmit={handleAddCategory} className="mb-4">
				<div className="flex items-center">
					<input type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded mr-2 appearance-none outline-none" />
					<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
						{editingCategory ? "Update" : "Add"}
					</button>
				</div>
			</form>

			<ul className="list-disc list-inside text-zinc-700">
				{categories.map((category) => (
					<li key={category._id} className="mb-2 p-2 bg-white rounded flex justify-between items-center">
						<span>{category.name}</span>
						<div className="flex space-x-2">
							<button onClick={() => handleEditCategory(category)} className="text-blue-500 hover:text-blue-700">
								Edit
							</button>
							<button onClick={() => handleDeleteCategory(category._id)} className="text-red-500 hover:text-red-700">
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CategoryPage;
