const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
	coverImage: { type: String },
});

module.exports = mongoose.model("Book", bookSchema);
