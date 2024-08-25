// routes/auth.js
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Register route
router.post("/register", [check("email", "Please include a valid email").isEmail(), check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 })], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	try {
		// Check if user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ msg: "User already exists" });
		}

		// Create a new user instance
		user = new User({
			email,
			password,
		});

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		// Save the user to the database
		await user.save();

		// Create JWT payload
		const payload = {
			user: {
				id: user.id,
			},
		};

		// Sign the token
		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Login route
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if user exists
		let user = await User.findOne({ email });
		if (!user) return res.status(400).json({ msg: "Invalid credentials" });

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

		// Create JWT payload
		const payload = {
			user: {
				id: user.id,
			},
		};

		// Sign the token
		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
			if (err) throw err;
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server error" });
	}
});

module.exports = router;
