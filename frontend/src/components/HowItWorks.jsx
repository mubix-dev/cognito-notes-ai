import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaKeyboard, FaDownload } from "react-icons/fa6";

const STEPS = [
  {
    Icon: FcGoogle,
    title: "Sign in with Google",
    desc: "One click, no forms. You get 50 free credits instantly.",
  },
  {
    Icon: FaKeyboard,
    title: "Describe your topic",
    desc: "Type your subject, chapter or paste your syllabus.",
  },
  {
    Icon: FaDownload,
    title: "Get notes, quizzes & PDFs",
    desc: "AI generates exam-ready notes with MCQ quizzes you can download and share.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-16 sm:mt-20 px-4">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-950">
        How it works
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {STEPS.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-violet-200 bg-violet-50 p-5"
          >
            <Icon className="text-2xl text-violet-600" />
            <p className="mt-3 text-sm font-semibold text-indigo-950">
              {i + 1}. {title}
            </p>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
