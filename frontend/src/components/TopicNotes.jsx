import { useState } from "react";
import { motion } from "framer-motion";

const TOGGLES = [
  { key: "revisionMode", label: "Revision mode" },
  { key: "includeDiagrams", label: "Include diagrams" },
  { key: "includeCharts", label: "Include charts" },
];

function TopicNotes({ onGenerate, loading, error }) {
  const [form, setForm] = useState({
    topic: "",
    subject: "",
    detail: "standard",
    revisionMode: false,
    includeDiagrams: false,
    includeCharts: false,
  });
  const [formError, setFormError] = useState("");

  const update = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.topic.trim()) {
      setFormError("Please enter a topic to generate notes.");
      return;
    }
    setFormError("");
    onGenerate(form);
  };

  const message = formError || error;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto mt-10 sm:mt-14 max-w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm print:hidden"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
        Generate Topic Notes
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Describe what you want to study and let AI build your notes.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="topic" className="text-sm font-medium text-slate-700">
            Topic *
          </label>
          <input
            id="topic"
            type="text"
            value={form.topic}
            onChange={(e) => update("topic", e.target.value)}
            placeholder="e.g. Operating System Deadlocks"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-slate-700"
            >
              Subject (optional)
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="e.g. Computer Science"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="detail"
              className="text-sm font-medium text-slate-700"
            >
              Detail level
            </label>
            <select
              id="detail"
              value={form.detail}
              onChange={(e) => update("detail", e.target.value)}
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            >
              <option value="brief">Brief</option>
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {TOGGLES.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5"
            >
              <span className="text-sm text-slate-700">{label}</span>
              <button
                type="button"
                onClick={() => update(key, !form[key])}
                className={`h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  form[key] ? "bg-violet-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    form[key] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {message && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {message}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{
            scale: loading ? 1 : 1.02,
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
          whileTap={{
            scale: loading ? 1 : 0.97,
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {loading ? "Generating..." : "Generate Notes"}
        </motion.button>
      </div>
    </motion.form>
  );
}

export default TopicNotes;
