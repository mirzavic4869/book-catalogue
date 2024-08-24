const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	image: {
		type: String,
	},
});

module.exports = mongoose.model("Book", BookSchema);
