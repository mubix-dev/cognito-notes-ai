import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.svg";

function LoadingScreen() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white px-4">
      <motion.img
        src={logo}
        alt="Cognito Notes"
        className="h-10 w-auto"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      {showHint && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xs text-center text-sm text-slate-500"
        >
          Waking up the server… this can take up to a minute on the first
          visit. Thanks for your patience!
        </motion.p>
      )}
    </div>
  );
}

export default LoadingScreen;
