import { asyncHandler } from "../utils/asynchandler.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import User from "../models/user.model.js";
import Notes from "../models/notes.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";

const generateNotes = asyncHandler(async (req, res) => {
  const { topic, subject, detail, revisionMode, includeDiagrams, includeCharts } =
    req.body;

  if (!topic?.trim()) {
    throw new ApiError(400, "Topic is required");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(401, "Unauthorized: user not found");
  }
  if (user.credits < 1) {
    throw new ApiError(403, "You are out of credits. Please buy more to continue.");
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

  user.credits -= 1;
  user.isCreditAvailable = user.credits > 0;
  user.notes.push(note._id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { note, credits: user.credits }));
});

export { generateNotes };
