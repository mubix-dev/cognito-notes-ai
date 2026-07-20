import { Router } from "express";
import { generateNotes } from "../controllers/notes.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.post("/generate", isAuth, generateNotes);

export default router;
