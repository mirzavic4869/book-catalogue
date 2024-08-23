import { Schema, model } from "mongoose";

const bookSchema = new Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
	coverImage: { type: String },
});

export default model("Book", bookSchema);
