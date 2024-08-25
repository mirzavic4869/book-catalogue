const express = require("express");
const connectDB = require("./config");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const bookRoutes = require("./routes/books");
const cors = require("cors");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
