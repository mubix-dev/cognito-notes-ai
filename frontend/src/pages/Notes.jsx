import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import { FaFileLines, FaDownload } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import TopicNotes from "../components/TopicNotes";
import NotesView from "../components/NotesView";

function Notes() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const content = notes?.content;
  const sections = notes
    ? [
        { id: "note-subtopics", label: "Important Topics" },
        { id: "note-body", label: "Notes" },
        content?.revisionPoints?.length > 0 && {
          id: "note-revision",
          label: "Quick Revision",
        },
        (content?.questions?.short?.length > 0 ||
          content?.questions?.long?.length > 0) && {
          id: "note-questions",
          label: "Questions",
        },
        content?.diagram && { id: "note-diagram", label: "Diagram" },
        content?.charts?.length > 0 && { id: "note-charts", label: "Charts" },
      ].filter(Boolean)
    : [];

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownloadPdf = () => {
    const prevTitle = document.title;
    document.title = notes?.topic || "cognito-notes";
    window.print();
    document.title = prevTitle;
  };

  const generateNotes = async (form) => {
    setError("");
    setLoading(true);
    setProgress(5);
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 3, 95));
    }, 600);
    try {
      const result = await axios.post(`${serverURL}/api/notes/generate`, form, {
        withCredentials: true,
      });
      setNotes(result.data.data.note);
      dispatch(setUserData({ ...userData, credits: result.data.data.credits }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while generating notes. Please try again.",
      );
    } finally {
      clearInterval(timer);
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] px-4 pb-16">
        <div className="print:hidden">
          <TopicNotes onGenerate={generateNotes} loading={loading} error={error} />
        </div>
        {loading && (
          <div className="mx-auto mt-6 w-full max-w-2xl print:hidden">
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              Generating your notes… {Math.round(progress)}%
            </p>
          </div>
        )}

        <div className="mt-8 flex w-full items-start gap-6">
          {notes && (
            <aside className="sticky top-6 hidden w-48 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 md:block print:hidden">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                On this page
              </p>
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={`w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-sm ${
                    activeSection === id
                      ? "bg-violet-100 font-medium text-violet-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </aside>
          )}
          <div className="min-w-0 flex-1">
          {notes ? (
            <div>
              <div className="mb-3 flex justify-end print:hidden">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <FaDownload className="text-violet-600" />
                  Download PDF
                </button>
              </div>
              <NotesView note={notes} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 px-6 py-12 text-center">
              <FaFileLines className="text-4xl text-slate-300" />
              <p className="text-sm font-medium text-slate-500">
                Generated notes will appear here
              </p>
              <p className="text-xs text-slate-400">
                Fill the form above and hit Generate Notes to get started
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
