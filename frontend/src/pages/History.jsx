import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { serverURL } from "../main";
import {
  FaFileLines,
  FaBars,
  FaXmark,
  FaDiagramProject,
  FaChartColumn,
  FaDownload,
  FaTrash,
} from "react-icons/fa6";
import Navbar from "../components/Navbar";
import NotesView from "../components/NotesView";

function History() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const printRef = useRef(null);
  const handleDownloadPdf = useReactToPrint({
    contentRef: printRef,
    documentTitle: selected?.topic || "cognito-notes",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${serverURL}/api/notes/${deleteTarget._id}`, {
        withCredentials: true,
      });
      setNotes(notes.filter((n) => n._id !== deleteTarget._id));
      if (selected?._id === deleteTarget._id) setSelected(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    const myNotes = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/notes/my-notes`, {
          withCredentials: true,
        });
        setNotes(result.data.data.notes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    myNotes();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar isMyNotes={true} />
      <div className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-8 flex flex-col gap-4 px-4 pb-16 md:flex-row md:items-start md:gap-6">
        <button
          type="button"
          onClick={() => setShowSidebar(!showSidebar)}
          className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm md:hidden"
        >
          {showSidebar ? <FaXmark /> : <FaBars />}
          My Notes ({notes.length})
        </button>

        <div
          className={`grid shrink-0 transition-[grid-template-rows] duration-300 ease-in-out md:sticky md:top-6 md:block md:w-64 ${
            showSidebar ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
        <div className="overflow-hidden md:overflow-visible">
        <aside
          className={`w-full rounded-2xl border border-slate-200 bg-white p-3 transition-opacity duration-300 md:max-h-[80vh] md:overflow-y-auto md:opacity-100 ${
            showSidebar ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            My Notes ({notes.length})
          </p>
          {loading && (
            <p className="px-2 py-2 text-sm text-slate-500">Loading…</p>
          )}
          {!loading && notes.length === 0 && (
            <p className="px-2 py-2 text-sm text-slate-500">
              No notes generated yet.
            </p>
          )}
          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => {
                setSelected(note);
                setShowSidebar(false);
              }}
              className={`mb-1.5 flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left ${
                selected?._id === note._id
                  ? "bg-violet-100"
                  : "bg-slate-50 hover:bg-violet-50"
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-medium ${
                    selected?._id === note._id
                      ? "text-violet-700"
                      : "text-slate-700"
                  }`}
                >
                  {note.topic}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <p className="text-xs text-slate-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  {note.includeDiagrams && (
                    <FaDiagramProject className="text-xs text-teal-500" />
                  )}
                  {note.includeCharts && (
                    <FaChartColumn className="text-xs text-amber-500" />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(note);
                }}
                className="shrink-0 cursor-pointer rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </aside>
        </div>
        </div>

        <div className="min-w-0 flex-1">
          {selected ? (
            <div>
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <FaDownload className="text-violet-600" />
                  Download PDF
                </button>
              </div>
              <div ref={printRef}>
                <NotesView note={selected} />
              </div>
            </div>
          ) : (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 px-6 text-center">
              <FaFileLines className="text-6xl text-slate-300" />
              <p className="text-lg sm:text-xl font-semibold text-slate-500">
                Select a note from the list to view it
              </p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <FaTrash className="text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Delete this note?
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                “{deleteTarget.topic}” will be permanently deleted. This cannot
                be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 cursor-pointer rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 cursor-pointer rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default History;
