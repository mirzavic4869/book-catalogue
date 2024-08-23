import User, { findOne } from "../models/User";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function register(req, res) {
	try {
		const { username, password } = req.body;
		const hashedPassword = await hash(password, 10);
		const user = new User({ username, password: hashedPassword });
		await user.save();
		res.status(201).json({ message: "User created" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export async function login(req, res) {
	try {
		const { username, password } = req.body;
		const user = await findOne({ username });
		if (!user || !(await compare(password, user.password))) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		const token = sign({ userId: user._id }, "SECRET_KEY");
		res.status(200).json({ token });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

export function logout(req, res) {
	// Invalidate token on frontend
	res.status(200).json({ message: "Logged out" });
}
