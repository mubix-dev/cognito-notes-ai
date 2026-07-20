import ApiError from "../utils/api-error.js";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

export const generateGeminiResponse = async (prompt) => {
  let response;

  for (let attempt = 1; attempt <= 3; attempt++) {
    response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (response.ok) break;

    const err = await response.text();
    console.error(`Gemini attempt ${attempt} failed:`, response.status, err.slice(0, 200));

    const retryable = [429, 500, 502, 503].includes(response.status);
    if (!retryable || attempt === 3) {
      throw new ApiError(502, "Failed to generate notes, please try again");
    }
    await new Promise((r) => setTimeout(r, attempt * 2000));
  }

  const data = await response.json();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new ApiError(502, "No text returned from Gemini");
  }

  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    console.error("Gemini returned invalid JSON:", cleanText.slice(0, 300));
    throw new ApiError(502, "Gemini returned invalid JSON, please try again");
  }
};
