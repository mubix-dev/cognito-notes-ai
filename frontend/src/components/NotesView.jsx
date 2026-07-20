import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  suppressErrorRendering: true,
});

const CHART_COLORS = ["#8b5cf6", "#38bdf8", "#f59e0b", "#2dd4bf", "#fb7185"];

const IMPORTANCE_STYLES = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const SUBTOPIC_GROUPS = [
  { key: "frequentlyAsked", label: "Frequently Asked", style: "bg-violet-100 text-violet-700" },
  { key: "veryImportant", label: "Very Important", style: "bg-sky-100 text-sky-700" },
  { key: "important", label: "Important", style: "bg-slate-100 text-slate-600" },
];

function MermaidDiagram({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!chart || !ref.current) return;
    const cleaned = chart
      .replace(/```mermaid|```/g, "")
      .replace(/\\n/g, " ")
      .replace(/\[([^\]]*)\]/g, (m, label) => `[${label.replace(/[^\w\s.,%+-]/g, " ").trim()}]`)
      .replace(/\|([^|]*)\|/g, (m, label) => `|${label.replace(/[^\w\s.,%+-]/g, " ").trim()}|`)
      .trim();
    mermaid
      .render(`note-diagram-${Math.random().toString(36).slice(2)}`, cleaned)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => {
        if (ref.current) ref.current.innerText = "Could not render diagram";
      });
  }, [chart]);

  return <div ref={ref} className="overflow-x-auto" />;
}

function NoteChart({ chart }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-700">{chart.title}</p>
      <ResponsiveContainer width="100%" height={240}>
        {chart.type === "pie" ? (
          <PieChart>
            <Pie data={chart.data} dataKey="value" nameKey="name" label>
              {chart.data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : chart.type === "line" ? (
          <LineChart data={chart.data}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        ) : (
          <BarChart data={chart.data}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

const markdownStyles = {
  h1: (props) => <h1 className="mt-4 text-xl font-bold text-slate-900" {...props} />,
  h2: (props) => <h2 className="mt-4 text-lg font-bold text-slate-900" {...props} />,
  h3: (props) => <h3 className="mt-3 text-base font-semibold text-slate-900" {...props} />,
  p: (props) => <p className="mt-2 text-sm text-slate-600" {...props} />,
  ul: (props) => <ul className="mt-2 list-disc pl-5 text-sm text-slate-600" {...props} />,
  ol: (props) => <ol className="mt-2 list-decimal pl-5 text-sm text-slate-600" {...props} />,
  li: (props) => <li className="mt-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-slate-800" {...props} />,
};

function NotesView({ note }) {
  const content = note?.content;
  if (!content) return null;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {note.topic}
        </h2>
        {content.importance && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              IMPORTANCE_STYLES[content.importance] || IMPORTANCE_STYLES.low
            }`}
          >
            {content.importance} importance
          </span>
        )}
      </div>

      {/* sub topics */}
      {SUBTOPIC_GROUPS.some((g) => content.subTopics?.[g.key]?.length > 0) && (
        <div id="note-subtopics" className="flex flex-col gap-3">
          {SUBTOPIC_GROUPS.map(
            ({ key, label, style }) =>
              content.subTopics?.[key]?.length > 0 && (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {content.subTopics[key].map((t) => (
                      <span
                        key={t}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${style}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      )}

      {/* notes body */}
      <div id="note-body">
        <ReactMarkdown components={markdownStyles}>
          {content.notes?.replace(/\\n/g, "\n")}
        </ReactMarkdown>
      </div>

      {/* revision points */}
      {content.revisionPoints?.length > 0 && (
        <div id="note-revision" className="rounded-2xl bg-violet-50 p-4">
          <h3 className="text-sm font-bold text-violet-900">Quick Revision</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {content.revisionPoints.map((point) => (
              <li key={point} className="mt-1">
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* questions */}
      {(content.questions?.short?.length > 0 ||
        content.questions?.long?.length > 0) && (
        <div id="note-questions" className="grid gap-4 sm:grid-cols-2">
          {content.questions.short?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-slate-800">
                Short Questions
              </h3>
              <ul className="mt-2 list-decimal pl-5 text-sm text-slate-600">
                {content.questions.short.map((q) => (
                  <li key={q} className="mt-1">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {content.questions.long?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-slate-800">
                Long Questions
              </h3>
              <ul className="mt-2 list-decimal pl-5 text-sm text-slate-600">
                {content.questions.long.map((q) => (
                  <li key={q} className="mt-1">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* diagram */}
      {content.diagram && (
        <div id="note-diagram" className="rounded-2xl border border-slate-200 p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-800">Diagram</h3>
          <MermaidDiagram chart={content.diagram} />
        </div>
      )}

      {/* charts */}
      {content.charts?.length > 0 && (
        <div id="note-charts" className="grid gap-4 md:grid-cols-2">
          {content.charts.map((chart) => (
            <NoteChart key={chart.title} chart={chart} />
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesView;
