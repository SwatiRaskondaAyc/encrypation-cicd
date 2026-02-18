
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import GoogleLoginButton from './GoogleLoginButton';

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGift,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Lottie from "lottie-react";
import stockMarketAnim from "/public/assets/stock-market-3d.json";

import GoogleRegisterButton from "./GoogleRegisterButton";
import InvestmentQuiz from "./InvestmentQuiz";

const IndividualSignUp = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // watches
  const password = watch("password");

  const location = useLocation();

  /** ✅ GOOGLE FLOW DETECTION */
  const googlePendingData = location.state?.pendingData || null;
  const isGoogleFlow = !!googlePendingData;

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  // form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullPhone, setFullPhone] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // email OTP states (manual flow only)
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [blockTimer, setBlockTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // quiz
  const [showQuizPage, setShowQuizPage] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [userEmail, setUserEmail] = useState("");

  /** ✅ Pre-fill from Google */
  useEffect(() => {
    if (isGoogleFlow) {
      setValue("fullname", googlePendingData.name || "");
    }
  }, [isGoogleFlow, googlePendingData, setValue]);

  const countryCodeRegister = register("countryCode");
  const mobileNumRegister = register("mobileNum", {
    pattern: { value: /^[0-9]{10}$/, message: "Exactly 10 digits" },
  });

  /* ==================== MANUAL OTP LOGIC ==================== */
  const sendOtp = async () => {
    if (isGoogleFlow) return; // ✅ prevent execution

    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }
    setIsSending(true);
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, { email });
      setOtpSent(true);
      setSuccessMessage("OTP sent successfully!");
      setTimer(30);
    } catch (error) {
      setErrorMessage(error.response?.data || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (isGoogleFlow) return;
    if (otp.length !== 6) {
      setErrorMessage("Enter a valid 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    try {
      await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
      setIsOtpVerified(true);
      setSuccessMessage("Email verified!");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value.replace(/\D/g, "").slice(0, 6));
  };

  /* ==================== PHONE LOGIC ==================== */
  const handlePhoneChange = (value, country) => {
    const dialCode = country.dialCode;
    const countryCodeWithPlus = "+" + dialCode;

    const cleanedFull = value.replace(/[^\d+]/g, "");
    let localNumber = cleanedFull;

    if (cleanedFull.startsWith(countryCodeWithPlus)) {
      localNumber = cleanedFull.slice(countryCodeWithPlus.length);
    } else if (cleanedFull.startsWith(dialCode)) {
      localNumber = cleanedFull.slice(dialCode.length);
    }

    const cleanedLocal = localNumber.replace(/\D/g, "").slice(0, 10);

    setFullPhone(value);
    setValue("countryCode", countryCodeWithPlus);
    setValue("mobileNum", cleanedLocal);
  };

  /* ==================== SUBMIT LOGIC ==================== */
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    let endpoint = "";
    let payload = {};

    if (isGoogleFlow) {
      endpoint = `${API_BASE}/auth/google/complete`;
      payload = {
        pendingToken: googlePendingData.pendingToken,
        promoCode: data.promoCode || "",
        countryCode: data.countryCode || "",
        mobileNum: data.mobileNum || "",
      };
    } else {
      if (!isOtpVerified) {
        toast.error("Please verify your email first");
        setIsSubmitting(false);
        return;
      }
      if (data.password !== data.confirmpassword) {
        toast.error("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      endpoint = `${API_BASE}/auth/individual/register`;
      payload = {
        fullname: data.fullname,
        email: email,
        password: data.password,
        countryCode: data.countryCode || "",
        mobileNum: data.mobileNum || "",
        promoCode: data.promoCode || "",
      };
    }

    try {
      const res = await axios.post(endpoint, payload);
      const result = res.data;

      toast.success("Registration successful!");

      const token = result.token || "";
      localStorage.setItem("authToken", token);

      setAuthToken(token);
      setUserEmail(isGoogleFlow ? googlePendingData.email : email);

      if (result.showInvestmentQuiz && !result.quizCompleted) {
        setShowQuizPage(true);
      } else {
        setShowQuizPage(true);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed!";
      if (msg.toLowerCase().includes("promo")) {
        setPromoCodeError(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==================== QUIZ SCREEN ==================== */
  if (showQuizPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <InvestmentQuiz
          token={authToken}
          email={userEmail}
          onComplete={() => navigate("/login")}
        />
      </div>
    );
  }

  /* ==================== UI RENDER ==================== */
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative">

      {/* LEFT PANEL */}
      <div className="absolute top-4 right-4">
        <a href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600">
          Already have an account? <span className="underline">Sign in</span>
        </a>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-gradient-to-br from-blue-900 via-indigo-900 to-sky-900 text-white">
        <div className="w-40 h-40 md:w-56 md:h-56">
          <Lottie animationData={stockMarketAnim} loop autoplay />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
          Create your CMDA account
        </h1>
        <p className="text-base md:text-lg text-center opacity-90">
          Empower your decisions with advanced <strong>Capital Market Data Analysis (CMDA)</strong>.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl">

          {/* ✅ Google button ONLY visible for manual flow */}
          {!isGoogleFlow && (
            <>
              <div className="mb-10">
                <GoogleLoginButton />
              </div>
              <div className="relative my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-xs text-gray-600">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            </>
          )}

          <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-extrabold text-center mb-6">
              {isGoogleFlow ? "Complete Your Registration" : "Create Your CMDA Account"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              {/* FULL NAME */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder=" "
                  {...register("fullname", { required: "Full name required" })}
                  disabled={isGoogleFlow}
                  readOnly={isGoogleFlow}
                  className="peer pl-10 w-full h-11 bg-gray-50 border rounded-lg"
                />
                <label className="absolute left-10 -top-3 bg-white text-xs">
                  Full Name
                </label>
                {errors.fullname && <p className="text-xs text-red-600">{errors.fullname.message}</p>}
              </div>

              {/* ==================== MANUAL EMAIL/OTP ==================== */}
              {!isGoogleFlow && (
                <>
                  {/* email */}
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      disabled={isOtpVerified || isSending}
                      placeholder=" "
                      className="peer pl-10 w-full h-11 bg-gray-50 border rounded-lg"
                    />
                    <label className="absolute left-10 -top-3 bg-white text-xs">
                      Email
                    </label>
                    {isOtpVerified && (
                      <FaCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>

                  {/* dynamic messages */}
                  <div className="min-h-6">
                    {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                    {successMessage && <p className="text-xs text-green-600">{successMessage}</p>}
                  </div>

                  {/* send OTP or block */}
                  {!otpSent && !isOtpVerified && email && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={isSending}
                      className="w-full h-11 bg-blue-600 text-white rounded-lg"
                    >
                      {isSending ? "Sending..." : "Send OTP"}
                    </button>
                  )}

                  {/* OTP input and verify */}
                  {otpSent && !isOtpVerified && (
                    <>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => handleOtpChange(e.target.value)}
                        className="w-full h-11 text-center bg-gray-50 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={isVerifying || otp.length !== 6}
                        className="w-full h-11 bg-green-600 text-white rounded-lg"
                      >
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </button>
                    </>
                  )}
                </>
              )}

              {/* ==================== GOOGLE EMAIL DISPLAY ==================== */}
              {isGoogleFlow && (
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={googlePendingData.email}
                    disabled
                    readOnly
                    className="w-full pl-10 h-11 bg-gray-200 border rounded-lg"
                  />
                  <label className="absolute left-10 -top-3 bg-white text-xs">
                    Email
                  </label>
                </div>
              )}

              {/* ==================== MANUAL PASSWORD FIELDS ==================== */}
              {!isGoogleFlow && (
                <>
                  {/* Password */}
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      {...register("password", {
                        required: "Password required",
                        pattern: {
                          value: /(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/,
                          message: "Min 9 chars, 1 number & 1 special char",
                        },
                      })}
                      className="peer pl-10 w-full h-11 bg-gray-50 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <label className="absolute left-10 -top-3 bg-white text-xs">
                      Password
                    </label>
                    {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=" "
                      {...register("confirmpassword", {
                        required: "Confirm password required",
                        validate: (v) => v === password || "Passwords must match",
                      })}
                      className="peer pl-10 w-full h-11 bg-gray-50 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <label className="absolute left-10 -top-3 bg-white text-xs">
                      Confirm Password
                    </label>
                    {errors.confirmpassword && <p className="text-xs text-red-600">{errors.confirmpassword.message}</p>}
                  </div>
                </>
              )}

              {/* ==================== PHONE FOR BOTH ==================== */}
              <input type="hidden" {...countryCodeRegister} />
              <input type="hidden" {...mobileNumRegister} />
              <div className="relative">
                <PhoneInput
                  country="in"
                  value={fullPhone}
                  onChange={handlePhoneChange}
                  inputClass="!w-full !h-11 pl-16"
                  containerClass="!w-full"
                />
                <label className="absolute left-16 -top-3 bg-white text-xs">
                  Country & Contact Number (Optional)
                </label>
              </div>

              {/* ==================== PROMO CODE BOTH ==================== */}
              <div className="relative">
                <FaGift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder=" "
                  {...register("promoCode", {
                    onChange: () => setPromoCodeError(""),
                  })}
                  className={`peer pl-10 w-full h-11 bg-gray-50 border rounded-lg ${promoCodeError ? "border-red-500" : ""
                    }`}
                />
                <label className="absolute left-10 -top-3 bg-white text-xs">
                  Promo Code (Optional)
                </label>
                {promoCodeError && (
                  <p className="text-xs text-red-600">{promoCodeError}</p>
                )}
              </div>

              {/* ==================== PASSWORD RULES ONLY MANUAL ==================== */}
              {!isGoogleFlow && (
                <div className="p-3 bg-blue-50 text-xs rounded-lg">
                  <p>Password must:</p>
                  <ul className="list-disc ml-4">
                    <li>Minimum 9 characters</li>
                    <li>At least 1 lowercase letter</li>
                    <li>At least 1 number</li>
                    <li>At least 1 special character</li>
                  </ul>
                </div>
              )}

              {/* ==================== SUBMIT BUTTON ==================== */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    {isGoogleFlow ? "Complete Registration" : "Create Account"}
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IndividualSignUp;
