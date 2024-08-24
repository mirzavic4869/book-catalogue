const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

const router = express.Router();

// Create Category
router.post("/", auth, async (req, res) => {
	const { name } = req.body;
	try {
		const category = new Category({ name });
		await category.save();
		res.status(201).json(category);
	} catch (err) {
		res.status(500).json({ msg: "Server error" });
	}
});

// Get All Categories
router.get("/", async (req, res) => {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (err) {
		res.status(500).json({ msg: "Server error" });
	}
});

// Get category by ID
router.get("/:id", async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ msg: "Category not found" });
		}
		res.json(category);
	} catch (err) {
		res.status(500).json({ msg: "Server error" });
	}
});

// Update category by ID
router.put("/:id", auth, async (req, res) => {
	const { id } = req.params;
	const { name } = req.body;

	try {
		// Cari kategori berdasarkan ID
		let category = await Category.findById(id);
		if (!category) {
			return res.status(404).json({ msg: "Category not found" });
		}

		// Perbarui kategori
		category.name = name;
		await category.save();

		res.json(category);
	} catch (err) {
		res.status(500).json({ msg: "Server error" });
	}
});

// Delete category by ID
router.delete("/:id", auth, async (req, res) => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);
		if (!category) {
			return res.status(404).send({ message: "Category not found" });
		}
		return res.status(200).json({
			message: "Category deleted successfully",
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
