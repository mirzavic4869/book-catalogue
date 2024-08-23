import { Router } from "express";
const router = Router();
import { upload, createBook, getBooks, updateBook, deleteBook } from "../controllers/bookController";
import auth from "../middleware/auth";

router.post("/", auth, upload, createBook);
router.get("/", auth, getBooks);
router.put("/:id", auth, upload, updateBook);
router.delete("/:id", auth, deleteBook);

export default router;
