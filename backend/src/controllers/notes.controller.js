import { asyncHandler } from "../utils/asynchandler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import User from "../models/user.model.js";
import Notes from "../models/notes.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";

const generateNotes = asyncHandler(async (req, res) => {
  const {
    topic,
    subject,
    detail,
    revisionMode,
    includeDiagrams,
    includeCharts,
  } = req.body;

  if (!topic?.trim()) {
    throw new ApiError(400, "Topic is required");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(401, "Unauthorized: user not found");
  }
  if (user.credits < 1) {
    throw new ApiError(
      403,
      "You are out of credits. Please buy more to continue.",
    );
  }

  const prompt = buildPrompt({
    topic,
    subject,
    detail,
    revisionMode,
    includeDiagrams,
    includeCharts,
  });
  const content = await generateGeminiResponse(prompt);

  const note = await Notes.create({
    user: user._id,
    topic,
    subject,
    detail,
    revisionMode,
    includeDiagrams,
    includeCharts,
    content,
  });

  user.credits -= 5;
  user.isCreditAvailable = user.credits > 0;
  user.notes.push(note._id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { note, credits: user.credits }));
});

const getMyNotes = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const notes = await Notes.find({ user: userId }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, {notes}));
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Notes.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  await User.findByIdAndUpdate(req.userId, { $pull: { notes: note._id } });

  return res.status(200).json(new ApiResponse(200, null, "Note deleted"));
});

export { generateNotes, getMyNotes, deleteNote };
