import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCoins, FaPlus } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverURL } from "../main";
import { setUserData } from "../redux/userSlice";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

function Navbar({isMyNotes = false}) {
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverURL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-4 sm:mt-6 flex items-center justify-between rounded-xl sm:rounded-xl bg-violet-100/50 px-4 sm:px-6 md:px-8 py-2.5 shadow print:hidden"
    >
      <img onClick={()=>navigate("/")} src={logo} alt="Cognito Notes" className="h-8 sm:h-10 w-auto  cursor-pointer" />

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <motion.div
            onClick={() => {
              setShowBuyCredits(!showBuyCredits);
              setShowProfile(false);
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            whileHover={{
              scale: 1.04,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{
              scale: 0.96,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            className="flex items-center gap-2 rounded-full bg-white px-3 sm:px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm cursor-pointer"
          >
            <FaCoins className="text-amber-500" />
            {userData?.credits}
            <button
              type="button"
              className=" text-violet-600 hover:text-violet-800"
            >
              <FaPlus />
            </button>
          </motion.div>

          <AnimatePresence>
          {showBuyCredits && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-violet-200 bg-white p-4 shadow-lg"
            >
              <h3 className="font-bold text-indigo-950">Buy credits</h3>
              <p className="mt-1 text-sm text-slate-500">
                Use credits to generate PDFs, notes, AI diagrams and much more.
              </p>
              <button
                onClick={()=>navigate("/pricing")}
                type="button"
                className="mt-3 w-full cursor-pointer rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Buy More Credits
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.div
            onClick={() => {
              setShowProfile(!showProfile);
              setShowBuyCredits(false);
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            whileHover={{
              scale: 1.04,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            whileTap={{
              scale: 0.96,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-violet-600 text-sm sm:text-base font-semibold text-white shadow-sm cursor-pointer"
          >
            {userData?.name?.[0]?.toUpperCase() || "U"}
          </motion.div>

          <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-violet-200 bg-white p-2 shadow-lg"
            >
              {!isMyNotes ? <button
                onClick={()=>navigate("/history")}
                type="button"
                className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-violet-50"
              >
                My Notes
              </button>:<button
                onClick={()=>navigate("/notes")}
                type="button"
                className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-violet-50"
              >
                Create Notes
              </button>}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
