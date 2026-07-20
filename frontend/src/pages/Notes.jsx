import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import { FaFileLines } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import TopicNotes from "../components/TopicNotes";

function Notes() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const generateNotes = async (form) => {
    setError("");
    setLoading(true);
    setProgress(5);
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 8, 95));
    }, 400);
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
        <TopicNotes onGenerate={generateNotes} loading={loading} error={error} />
        {loading && (
          <div className="mx-auto mt-6 w-full max-w-2xl">
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

        <div className="mx-auto mt-8 w-full max-w-2xl">
          {notes ? (
            <pre className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-800">
              {typeof notes === "string" ? notes : JSON.stringify(notes, null, 2)}
            </pre>
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
  );
}

export default Notes;
