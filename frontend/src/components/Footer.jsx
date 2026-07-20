import { motion } from "framer-motion";
import logo from "../assets/logo.svg";

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16 border-t border-violet-200 bg-violet-50"
    >
      <div className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-6">
        <img src={logo} alt="Cognito Notes" className="h-7 w-auto" />
        <p className="text-xs text-slate-500">
          © 2026 Cognito Notes. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-slate-500">
          <a href="#" className="hover:text-violet-600">
            About
          </a>
          <a href="#" className="hover:text-violet-600">
            Contact
          </a>
          <a href="#" className="hover:text-violet-600">
            Terms
          </a>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
