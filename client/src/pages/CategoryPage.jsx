// src/pages/CategoryPage.js
import { useState, useEffect } from "react";
import axios from "axios";

const CategoryPage = () => {
	const [categories, setCategories] = useState([]);
	const [name, setName] = useState("");
	const [editing, setEditing] = useState(null);
	const [editName, setEditName] = useState("");

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
			await axios.post(
				"http://localhost:5000/api/categories",
				{ name },
				{
					headers: {
						"x-auth-token": localStorage.getItem("token"),
					},
				}
			);
			fetchCategories();
			setName("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleEditCategory = async (id) => {
		try {
			await axios.put(
				`http://localhost:5000/api/categories/${id}`,
				{ name: editName },
				{
					headers: {
						"x-auth-token": localStorage.getItem("token"),
					},
				}
			);
			fetchCategories();
			setEditing(null);
			setEditName("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteCategory = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/categories/${id}`, {
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
		<div className="container p-4 mx-auto">
			<h2 className="mb-8 text-3xl font-bold text-center">Categories</h2>
			<form onSubmit={handleAddCategory} className="max-w-md p-4 mx-auto mb-8 bg-white rounded shadow-md">
				<div className="flex flex-col items-center md:flex-row">
					<input type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-4 border border-gray-300 rounded md:mb-0 md:mr-2" />
					<button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded md:w-24 hover:bg-blue-600">
						Add
					</button>
				</div>
			</form>
			<ul className="space-y-2">
				{categories.map((category) => (
					<li key={category._id} className="flex items-center justify-between p-4 bg-white rounded shadow-md">
						{editing === category._id ? (
							<div className="flex flex-col items-center md:flex-row">
								<input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2 mb-4 border border-gray-300 rounded md:mb-0 md:mr-2" />
								<button onClick={() => handleEditCategory(category._id)} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
									Save
								</button>
							</div>
						) : (
							<div>{category.name}</div>
						)}
						<div>
							{editing === category._id ? (
								<button onClick={() => setEditing(null)} className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600">
									Cancel
								</button>
							) : (
								<>
									<button onClick={() => setEditing(category._id)} className="px-4 py-2 mr-2 text-white bg-teal-500 rounded hover:bg-teal-600">
										Edit
									</button>
									<button onClick={() => handleDeleteCategory(category._id)} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
										Delete
									</button>
								</>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CategoryPage;
