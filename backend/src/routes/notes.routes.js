import { Router } from "express";
import { generateNotes, getMyNotes } from "../controllers/notes.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.post("/generate", isAuth, generateNotes);
router.get("/my-notes", isAuth, getMyNotes);

export default router;
