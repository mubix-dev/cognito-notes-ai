export const buildPrompt = ({
  topic,
  subject,
  detail,
  revisionMode,
  includeDiagrams,
  includeCharts,
}) => {
  return `You are an exam-notes generator. Return ONLY one valid JSON object matching the OUTPUT FORMAT exactly — no markdown fences, no text before or after it.

INPUT:
- Topic: ${topic}
- Subject: ${subject || "Not specified"}
- Detail level: ${detail || "standard"}
- Revision mode: ${revisionMode ? "ON" : "OFF"}
- Include diagram: ${includeDiagrams ? "YES" : "NO"}
- Include charts: ${includeCharts ? "YES" : "NO"}

CONTENT RULES:
- Clear, exam-oriented language. No storytelling or filler theory.
- "notes" is a Markdown string with ## section headings, bullet points and short paragraphs.
- The notes must be COMPLETE enough that a student can prepare for the exam from them alone: cover definitions, explanations, examples, formulas, comparisons, common mistakes and exam tips wherever relevant.
- Detail level controls depth:
  - brief = 200-350 words, key points and definitions only.
  - standard = 500-800 words, every concept explained with at least one example.
  - detailed = 900-1400 words, in-depth coverage: all concepts, examples, formulas, edge cases, common mistakes and exam tips.
- If revision mode is ON, "notes" becomes a last-day cheat sheet: only bullet points, one-line answers, definitions, formulas and keywords — no paragraphs. "revisionPoints" must cover ALL key facts.
- "revisionPoints": 8-15 points. "questions": 4-6 short and 2-4 long questions.
- Rank "subTopics" by exam weightage, 3-6 items per category where possible. A category may be an empty array if nothing fits.
- "importance" is the overall exam importance of the whole topic.

DIAGRAM RULES:
- If include diagram is YES: "diagram" is ONE SINGLE-LINE string of valid Mermaid, exactly this shape:
  "graph TD; A[First step] --> B[Second step]; B --> C[Third step];"
- 5-10 nodes. Node ids are single capital letters. Labels contain ONLY letters, numbers and spaces — no parentheses, quotes, commas, colons, dashes or line breaks.
- Do not put \\n or real line breaks inside the diagram string.
- If include diagram is NO: "diagram" is "".

CHART RULES:
- If include charts is YES: 1-2 charts. Theory topics use bar/pie (weightage), process topics use bar/line (steps). Numeric values only, short labels.
- If include charts is NO: "charts" is [].

OUTPUT FORMAT (exact keys and value types):
{
  "importance": "high" | "medium" | "low",
  "subTopics": {
    "frequentlyAsked": ["string"],
    "veryImportant": ["string"],
    "important": ["string"]
  },
  "notes": "markdown string",
  "revisionPoints": ["string"],
  "questions": {
    "short": ["string"],
    "long": ["string"]
  },
  "diagram": "mermaid string or empty string",
  "charts": [
    { "type": "bar" | "line" | "pie", "title": "string", "data": [{ "name": "string", "value": 10 }] }
  ]
}`;
};

export const buildQuizPrompt = ({ topic, notes, subTopics }) => {
  return `You are an exam quiz generator. Return ONLY one valid JSON object matching the OUTPUT FORMAT exactly — no markdown fences, no text before or after it.

Create a multiple-choice quiz from these study notes.

TOPIC: ${topic}

SUB TOPICS: ${JSON.stringify(subTopics || {})}

NOTES:
${notes}

QUIZ RULES:
- Exactly 10 questions covering the whole note, hardest concepts included.
- Every question has exactly 4 options with exactly ONE correct answer.
- Wrong options must be plausible (common mistakes, close values) — never obviously silly.
- "answerIndex" is the 0-based index of the correct option.
- "explanation" is 1-2 lines explaining why the correct answer is right.
- Questions must be answerable from the notes alone. No "all of the above".

OUTPUT FORMAT (exact keys and value types):
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answerIndex": 0,
      "explanation": "string"
    }
  ]
}`;
};
