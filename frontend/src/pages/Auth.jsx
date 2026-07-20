import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import {
  FaGraduationCap,
  FaClipboardList,
  FaChartPie,
  FaChartLine,
  FaFilePdf,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import logo from "../assets/logo.svg";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { serverURL } from "../main";
import axios from "axios";
import HowItWorks from "../components/HowItWorks";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const FEATURES = [
  { label: "Exam Notes", Icon: FaGraduationCap },
  { label: "Project Notes", Icon: FaClipboardList },
  { label: "Charts", Icon: FaChartPie },
  { label: "Graphs", Icon: FaChartLine },
  { label: "PDFs", Icon: FaFilePdf },
  { label: "And More", Icon: FaWandMagicSparkles },
];

function Auth() {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;

      const result = await axios.post(
        `${serverURL}/api/auth/google`,
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white ">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center gap-x-4 gap-y-0.5 rounded-xl sm:rounded-2xl bg-violet-50 px-4 sm:px-6 md:px-8 py-2.5 shadow-lg border-2 border-violet-100"
      >
        <motion.img
          src={logo}
          alt="Cognito Notes"
          className="h-8 sm:h-10 w-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          whileHover={{
            scale: 1.04,
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
        />
        <motion.p
          className="text-xs sm:text-sm md:text-base font-medium text-indigo-950/60 tracking-wide"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Your AI-Powered Cognitive Study Partner
        </motion.p>
      </motion.header>

      <main className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-12 sm:mt-16 md:mt-24 flex flex-col md:flex-row items-center md:items-start gap-10 px-4 pb-12 md:pb-16">
        <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          <motion.button
            onClick={handleGoogleAuth}
            type="button"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{
              scale: 1.04,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{
              scale: 0.96,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            className="flex w-full max-w-xs sm:w-auto justify-center items-center gap-3 rounded-full border-2 border-violet-100 bg-violet-50 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-indigo-200/60 cursor-pointer"
          >
            <FcGoogle className="text-xl sm:text-2xl" />
            Continue with Google
          </motion.button>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="mt-4 max-w-md text-xs sm:text-sm text-slate-500"
          >
            You get instant{" "}
            <span className="font-semibold text-violet-600">
              50 free credits
            </span>{" "}
            to create exam notes, project notes, charts, graphs, PDFs and more.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="mt-2 max-w-md text-[10px] sm:text-[13px] text-slate-400"
          >
            Start with free credits • Upgrade any time for more credits •
            Instant Access
          </motion.p>
        </div>

        <div className="w-full md:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-4 perspective-[1000px]">
          {FEATURES.map(({ label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40, rotateX: -25 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 1.0 + i * 0.12, duration: 0.5 }}
              whileHover={{
                rotateX: 10,
                rotateY: -10,
                scale: 1.06,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-linear-to-br from-violet-300 to-violet-600 p-5 sm:p-6 text-white shadow-xl shadow-violet-300/50 transform-3d cursor-default"
            >
              <span className="transform-[translateZ(24px)]">
                <Icon className="text-2xl sm:text-3xl" />
              </span>
              <span className="text-xs sm:text-sm font-semibold transform-[translateZ(12px)]">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </main>

      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}

export default Auth;
