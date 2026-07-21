import { Router } from "express";
import { generateNotes, getMyNotes, deleteNote } from "../controllers/notes.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.post("/generate", isAuth, generateNotes);
router.get("/my-notes", isAuth, getMyNotes);
router.delete("/:id", isAuth, deleteNote);

export default router;
