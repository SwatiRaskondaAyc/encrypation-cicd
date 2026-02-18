import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { KeyRound, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";

const CorporateResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/corporate/corp/resetpassword`,
        {
          token: token,
          newPassword: data.password,
          confirmPassword: data.confirmpassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(response.data);
      setError("");
      setShowLoginModal(true);
      toast.success("Password reset successful!");
    } catch (err) {
      setError(err.response?.data || "Failed to reset password. Please try again.");
      toast.error("Failed to reset password.");
    }
  };

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col relative overflow-hidden pt-20 md:pt-24">
      <Helmet>
        <title>Corporate Reset Password – CMDA Hub</title>
        <meta name="description" content="Securely reset your CMDA Hub corporate account password." />
      </Helmet>

      <Navbar isLoggedIn={false} />

      {/* Animated background elements */}
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
        </svg>
      </div>

      {/* Floating Decorative Icons */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 text-blue-500/20 hidden lg:block"
      >
        <KeyRound size={64} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-20 text-blue-500/20 hidden lg:block"
      >
        <ShieldCheck size={64} />
      </motion.div>

      <div className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/10 rounded-3xl mb-4 group ring-4 ring-blue-500/5">
                <FaLock className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                Corporate Reset
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Update your corporate account security.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 rounded-2xl mb-8 text-red-600 dark:text-red-400 text-sm font-medium flex items-center"
              >
                <div className="mr-3 bg-red-100 dark:bg-red-900/40 p-1 rounded-full text-red-600">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* New Password */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    placeholder="At least 9 characters"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: "Doesn't meet security requirements",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-semibold ml-1">{errors.password.message}</p>
                )}

                {/* Password Strength Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 p-4 bg-gray-100/50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                  <RequirementItem met={password?.length >= 9} text="Min 9 characters" />
                  <RequirementItem met={/^[A-Z]/.test(password || '')} text="Starts with Uppercase" />
                  <RequirementItem met={/[a-z]/.test(password || '')} text="One Lowercase" />
                  <RequirementItem met={/\d/.test(password || '')} text="One Number" />
                  <RequirementItem met={/[@$!%*?&]/.test(password || '')} text="Special Char (@$!%*?&)" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 ml-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 shadow-sm"
                    placeholder="Repeat your password"
                    {...register("confirmpassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
                {errors.confirmpassword && (
                  <p className="text-red-500 text-xs font-semibold ml-1">{errors.confirmpassword.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                type="submit"
                className="relative w-full flex justify-center items-center py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-xl transition-all duration-300 overflow-hidden"
              >
                Reset Corporate Password
                <AnimatePresence>
                  {isHovered && (
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
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-10 overflow-hidden"
            >
              {/* Success Decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />

              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="text-blue-500 dark:text-blue-400" size={56} />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                  Success! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  Your corporate password has been updated. You can now securely log in with your new credentials.
                </p>

                <div className="space-y-4">
                  <button
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    onClick={() => window.location.href = "/login"}
                  >
                    Go to Sign In
                  </button>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold italic">
                    Tip: Corporate policies usually recommend updating passwords regularly.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center gap-2 text-xs font-semibold ${met ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
    <CheckCircle2 size={14} className={met ? 'opacity-100' : 'opacity-30'} />
    <span>{text}</span>
  </div>
);

export default CorporateResetPassword;
