import { Router } from "express";
const router = Router();
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categoryController";
import auth from "../middleware/auth";

router.post("/", auth, createCategory);
router.get("/", auth, getCategories);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

export default router;
