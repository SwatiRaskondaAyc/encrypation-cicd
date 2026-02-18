import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, TrendingUp, BarChart3, DollarSign, Activity, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);

      // Step 1: Fetch userType from backend
      const userTypeResponse = await axios.post(
        `${API_BASE}/auth/check-user-type`,
        { email }
      );
      const userType = userTypeResponse.data.userType;

      if (!userType) {
        throw new Error("User type could not be determined.");
      }

      // Step 2: Choose the correct API based on userType
      const apiUrl =
        userType === "corporate"
          ? `${API_BASE}/corporate/forgetpass`
          : `${API_BASE}/users/forgetpass`;

      // Step 3: Send password reset request
      const response = await axios.post(apiUrl, { email });

      if (response.status === 200) {
        const token = response.data.token;

        if (!token) {
          setMessage("Password reset link has been sent to your email.");
          toast.success("Reset link sent!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        // Redirect user to reset password page with token
        navigate(`/reset-password?type=${userType}&token=${token}`);
      }
    } catch (err) {
      console.error("Error:", err);

      if (
        err.response?.status === 404 ||
        err.response?.data?.message === "User not found"
      ) {
        setError("not-found");
      } else {
        setError(
          err.response?.data?.message || "Something went wrong. Please try again later."
        );
        toast.error("Failed to send reset link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative overflow-hidden pt-20 md:pt-24">
      <Helmet>
        <title>Forgot Password – CMDA Hub</title>
        <meta name="description" content="Reset your password to regain access to your CMDA Hub account and market insights." />
      </Helmet>

      <Navbar isLoggedIn={false} />

      {/* Animated stock chart background (similar to Login page for consistency) */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M0,50 L20,45 L40,60 L60,30 L80,40 L100,20"
            stroke="currentColor"
            strokeWidth="0.2"
            fill="none"
            className="text-blue-500"
          />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            d="M0,70 L20,65 L40,80 L60,50 L80,60 L100,40"
            stroke="currentColor"
            strokeWidth="0.2"
            fill="none"
            className="text-green-500"
          />
        </svg>
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 text-blue-500/30 hidden lg:block"
      >
        <TrendingUp size={48} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-10 text-blue-500/30 hidden lg:block"
      >
        <ShieldCheck size={48} />
      </motion.div>

      <div className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4">
                <Mail className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error === "not-found" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl mb-6"
                >
                  <p className="text-amber-800 dark:text-amber-200 font-semibold mb-1">Account not found</p>
                  <p className="text-amber-700/80 dark:text-amber-300/80 text-sm mb-3">It looks like you haven't registered with this email yet.</p>
                  <Link
                    to="/signup"
                    className="inline-flex items-center text-sm font-bold text-amber-900 dark:text-amber-100 underline decoration-amber-500 underline-offset-4 hover:text-amber-600 transition-colors"
                  >
                    Create a new account instead?
                  </Link>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3 rounded-xl mb-6 text-red-600 dark:text-red-400 text-sm text-center font-medium"
                >
                  {error}
                </motion.div>
              ) : null}

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-3 rounded-xl mb-6 text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-901 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                disabled={loading}
                className={`relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl text-lg font-bold text-white transition-all duration-300 shadow-xl overflow-hidden ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Send Reset Link"
                )}

                {/* Subtle shimmer effect on hover */}
                <AnimatePresence>
                  {isHovered && !loading && (
                    <motion.div
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} /> */}
    </div>
  );
};

export default ForgotPassword;

