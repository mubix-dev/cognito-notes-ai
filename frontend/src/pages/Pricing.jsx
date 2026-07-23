import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { FaCheck, FaCoins } from "react-icons/fa6";
import { serverURL } from "../main";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$0.99",
    amount: 99,
    credits: 60,
    features: [
      "60 credits",
      "Exam & project notes",
      "Diagrams and charts",
      "PDF download & MCQ quizzes",
    ],
    button: "Buy Starter",
    popular: false,
  },
  {
    id: "student",
    name: "Student",
    price: "$1.99",
    amount: 199,
    credits: 150,
    features: [
      "150 credits",
      "Everything in Starter",
      "Detailed notes mode",
      "Priority generation",
    ],
    button: "Buy Student",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$2.99",
    amount: 299,
    credits: 300,
    features: [
      "300 credits",
      "Everything in Student",
      "Longest detailed notes",
      "Early access to new features",
    ],
    button: "Buy Pro",
    popular: false,
  },
];

function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState("");
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState(() => {
    if (searchParams.get("success"))
      return "Payment successful! Your credits have been added.";
    if (searchParams.get("canceled"))
      return "Payment canceled. You have not been charged.";
    return "";
  });

  const handleBuy = async (planId) => {
    setMessage("");
    setLoadingPlan(planId);
    try {
      const result = await axios.post(
        `${serverURL}/api/payment/checkout`,
        { planId },
        { withCredentials: true },
      );
      window.location.assign(result.data.data.url);
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message ||
          (error.response?.status === 404
            ? "Payments are coming soon!"
            : "Could not start checkout. Please try again."),
      );
      setLoadingPlan("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar isPaymentPage={true}/>

      <div className="mx-3 sm:mx-6 md:mx-auto md:max-w-[85%] xl:max-w-[80%] mt-12 sm:mt-16 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Simple <span className="text-violet-600">Pricing</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-slate-500">
            Buy credits once, use them for notes, diagrams, charts and PDFs.
            No subscriptions.
          </p>
          {message && (
            <p className="mx-auto mt-4 w-fit rounded-full bg-violet-50 px-5 py-2 text-sm font-medium text-violet-700">
              {message}
            </p>
          )}
        </motion.div>

        <div className="mt-12 grid gap-6 perspective-distant sm:grid-cols-2 lg:grid-cols-3 lg:items-center">
          {PLANS.map(({ id, name, price, credits, features, button, popular }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 40, rotateX: -25 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              whileHover={{
                y: -10,
                scale: popular ? 1.08 : 1.04,
                transition: { type: "spring", stiffness: 300, damping: 16 },
              }}
              className={`transform-3d rounded-2xl p-6 sm:p-8 ${
                popular
                  ? "relative bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-300/60 lg:scale-105"
                  : "border border-slate-200 bg-white text-slate-900 shadow-sm"
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                  Most Popular
                </span>
              )}

              <p className={`text-sm font-semibold uppercase tracking-wide ${popular ? "text-violet-200" : "text-slate-400"}`}>
                {name}
              </p>
              <p className="mt-2 text-4xl font-bold">{price}</p>
              <p className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${popular ? "text-violet-100" : "text-slate-500"}`}>
                <FaCoins className="text-amber-400" />
                {credits} credits
              </p>

              <ul className="mt-6 flex flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <FaCheck className={popular ? "text-amber-300" : "text-violet-600"} />
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                type="button"
                disabled={loadingPlan !== ""}
                onClick={() => handleBuy(id)}
                whileHover={{
                  scale: loadingPlan ? 1 : 1.04,
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                whileTap={{
                  scale: loadingPlan ? 1 : 0.96,
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                className={`mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                  popular
                    ? "bg-white text-violet-700 hover:bg-violet-50"
                    : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
              >
                {loadingPlan === id && (
                  <span
                    className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                      popular ? "border-violet-600" : "border-white"
                    }`}
                  />
                )}
                {loadingPlan === id ? "Redirecting..." : button}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Pricing;
