const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
	try {
		const category = new Category(req.body);
		await category.save();
		res.status(201).json(category);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		res.status(200).json(categories);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.updateCategory = async (req, res) => {
	try {
		const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(200).json(category);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		await Category.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
