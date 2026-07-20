import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";
import heroAiNotes from "../assets/hero-ai-notes.svg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-12 sm:mt-16 md:mt-20 flex flex-col md:flex-row items-center gap-10 px-4">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{
              y: -3,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="cursor-default text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 [text-shadow:0_2px_0_#e2e8f0,0_8px_16px_rgba(100,116,139,0.15)]"
          >
            Create Smart{" "}
            <span className="text-violet-600">AI Notes</span>{" "}
            in seconds
          </motion.h1>
          <p className="mt-5 text-base sm:text-lg font-medium text-slate-500">
            Generate exam-focused notes, project documentation, flow diagrams,
            and revision-ready content using AI — faster, clearer, smarter.
          </p>
          <motion.button
            onClick={()=>navigate("/notes")}
            type="button"
            whileHover={{
              scale: 1.04,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{
              scale: 0.96,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            className="mt-6 cursor-pointer rounded-full bg-violet-600 px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-violet-300/60"
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md md:max-w-full md:w-1/2"
        >
          <motion.img
            src={heroAiNotes}
            alt="Two students watching AI turn messy papers into clean notes, charts and documents"
            className="w-full"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>
      <Features />
      <Footer />
    </div>
  );
}

export default Home;
