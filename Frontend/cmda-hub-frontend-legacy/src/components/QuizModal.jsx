// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, Toaster } from "react-hot-toast";
// import { motion } from "framer-motion";
// import Confetti from "react-confetti";

// const getRandomQuestions = (questions, count = 10) => {
//   const shuffled = [...questions].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// };

// const QuizEntryModal = ({ onStartQuiz, onClose }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ duration: 0.3 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//     >
//       <div className="relative bg-gradient-to-br from-cyan-500 to-slate-600 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center text-white">
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
//           {[...Array(20)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute bg-white rounded-full"
//               style={{
//                 width: `${Math.random() * 4 + 2}px`,
//                 height: `${Math.random() * 4 + 2}px`,
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//                 opacity: Math.random() * 0.5 + 0.5,
//                 animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
//               }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10">
//           <button
//             className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
//             onClick={onClose}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>

//           <div className="mb-6">
//             <div className="text-5xl mb-4">🧠</div>
//             <h3 className="text-3xl font-bold mb-2">Test Your Financial Knowledge!</h3>
//             <p className="text-lg opacity-90">
//               Take our 2-minute quiz and unlock premium financial insights
//             </p>
//           </div>

//           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-left">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-yellow-400/20 p-1 rounded-full">
//                 <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span>Discover your financial learning score</span>
//             </div>
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-yellow-400/20 p-1 rounded-full">
//                 <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <span>Only 10 quick questions</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="bg-yellow-400/20 p-1 rounded-full">
//                 <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <span>Personalized recommendations</span>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onStartQuiz}
//             className="w-full py-4 bg-white text-cyan-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//           >
//             <span>Start Quiz Now</span>
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//             </svg>
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const QuizResultModal = ({ score,  onRetake, onClose, onLogin }) => {
//   const passed = score >= 70;
//   const midRange = score >= 50 && score < 70;
//   const failed = score <= 40;

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//     >
//       <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
//         <button
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
//           onClick={onClose}
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         <div className="space-y-6">
//           <div>
//             <div className="text-7xl mb-4">
//               {failed ? "😞" : midRange ? "🤔" : "🎉"}
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
//               {failed ? "Better Luck Next Time!"
//                 : midRange ? "Good Effort!"
//                 : "Congratulations!"}
//             </h3>
//             <p className="text-gray-600 dark:text-gray-300 mt-2">
//               Your score: <span className="font-bold">{score}%</span> 
//             </p>
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
//             <p className="text-gray-700 dark:text-gray-200">
//               {failed ? "Don't worry, financial learning is a journey. Keep learning and try again!"
//                 : midRange ? "You're on the right track! A little more practice and you'll ace it next time."
//                 : "You've demonstrated excellent financial knowledge! Well done!"}
//             </p>
//           </div>

//           <div className="flex flex-col gap-3">
//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               onClick={onRetake}
//               className={`px-6 py-3 rounded-lg font-medium ${
//                 failed ? "bg-blue-600 hover:bg-blue-700 text-white"
//                 : midRange ? "bg-slate-600 hover:bg-slate-700 text-white"
//                 : "bg-green-600 hover:bg-green-700 text-white"
//               }`}
//             >
//               {failed ? "Try Again"
//                 : midRange ? "Retake Quiz to Improve"
//                 : "Retake Quiz"}
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               onClick={onClose}
//               className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg font-medium"
//             >
//               Close
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const QuizModal = ({ showModal, setShowModal, allQuestions, userId, onLoginClick }) => {
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [quizResult, setQuizResult] = useState(null);
//   const [displayedQuestions, setDisplayedQuestions] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showEntryModal, setShowEntryModal] = useState(true);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showResultModal, setShowResultModal] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     if (showModal && allQuestions.length > 0) {
//       console.log("allQuestions:", allQuestions);
//       const selected = getRandomQuestions(allQuestions, 10);
//       setDisplayedQuestions(selected);
//       setSelectedAnswers({});
//       setQuizResult(null);
//       setShowEntryModal(true);
//       setShowResultModal(false);
//       setShowConfetti(false);
//     }
//   }, [showModal, allQuestions]);

//   const handleOptionChange = (questionId, selectedOption) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: `Option_${selectedOption}`,
//     }));
//   };

//   const handleSubmit = async () => {
//     const payload = {
//       userId: parseInt(userId) || 0, // Fallback to 0 if userId is undefined
//       corporateUser: false,
//       answers: displayedQuestions.map((q) => ({
//         questionId: q.questionId.startsWith("Q") ? q.questionId : `Q${q.questionId}`,
//         selectedOption: selectedAnswers[q.questionId],
//       })),
//     };

//     if (payload.answers.some((ans) => !ans.selectedOption)) {
//       return toast.error("Please answer all questions.");
//     }

//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         toast.error("Please log in to submit the quiz.");
//         onLoginClick();
//         setIsSubmitting(false);
//         return;
//       }

//       console.log("Payload:", payload);
//       const res = await axios.post(`${API_BASE}/assessment/submit`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("API Response:", res.data);

//       if (res.status === 200 && res.data.score !== undefined) {
//         setQuizResult({
//           score: res.data.score,
//           resultStatus: res.data.resultStatus,
//         });
//         localStorage.setItem("hasTakenQuiz", "true"); // Mark quiz as taken
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 5000);
//         setTimeout(() => setShowResultModal(true), 6000); // 6-second pause before result modal
//         toast.success("Quiz submitted successfully!", {
//           icon: "🎉",
//           style: {
//             background: "linear-gradient(to right, #074f92ff, #0944c4ff)",
//             color: "white",
//           },
//         });
//       } else {
//         console.error("Unexpected response:", res);
//         toast.error("Invalid response from server.");
//       }
//     } catch (error) {
//       console.error("Submission failed:", error.response?.data || error);
//       toast.error(error.response?.data?.message || "Submission failed. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     setShowModal(false);
//     setSelectedAnswers({});
//     setQuizResult(null);
//     setShowEntryModal(true);
//     setShowResultModal(false);
//     setShowConfetti(false);
//     localStorage.setItem("hasSeenQuizModal", "true"); // Mark modal as seen
//   };

//   const startQuiz = () => {
//     setShowEntryModal(false);
//   };

//   const retakeQuiz = () => {
//     const selected = getRandomQuestions(allQuestions, 10);
//     setDisplayedQuestions(selected);
//     setSelectedAnswers({});
//     setQuizResult(null);
//     setShowResultModal(false);
//     setShowConfetti(false);
//   };

//   if (!showModal) return null;

//   const answeredQuestions = Object.keys(selectedAnswers).length;
//   const totalQuestions = displayedQuestions.length;
//   const progressPercentage = (answeredQuestions / totalQuestions) * 100;

//   return (
//     <>
//       {showEntryModal ? (
//         <QuizEntryModal onStartQuiz={startQuiz} onClose={handleClose} />
//       ) : showResultModal && quizResult ? (
//         <QuizResultModal
//           score={quizResult.score}
//           resultStatus={quizResult.resultStatus}
//           onRetake={retakeQuiz}
//           onClose={handleClose}
//           onLogin={!userId ? () => {
//             handleClose();
//             onLoginClick();
//           } : null}
//         />
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           transition={{ duration: 0.3 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//         >
//           {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
//           <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
//             <Toaster position="top-center" containerStyle={{ zIndex: 9999 }} />

//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
//               onClick={handleClose}
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <div className="text-center mb-6">
//               <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
//                 <span role="img" aria-label="book"></span> CapitalSense Challenge: Decode, Decide, Dominate
//               </h3>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Test your knowledge and unlock premium features!
//               </p>
//             </div>

//             <div className="mb-6">
//               <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2.5 rounded-full transition-all duration-300"
//                   style={{ width: `${progressPercentage}%` }}
//                 ></div>
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
//                 {answeredQuestions}/{totalQuestions} Questions Answered
//               </p>
//             </div>

//             {displayedQuestions.map((q, idx) => (
//               <motion.div
//                 key={q.questionId}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
//               >
//                 <p className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
//                   {idx + 1}. {q.question}
//                 </p>
//                 <div className="space-y-2">
//                   {["A", "B", "C", "D"].map((optionKey) => (
//                     <label
//                       key={optionKey}
//                       className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                         selectedAnswers[q.questionId] === `Option_${optionKey}`
//                           ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-500"
//                           : "hover:bg-gray-100 dark:hover:bg-gray-700"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name={q.questionId}
//                         value={optionKey}
//                         checked={selectedAnswers[q.questionId] === `Option_${optionKey}`}
//                         onChange={() => handleOptionChange(q.questionId, optionKey)}
//                         className="radio radio-info radio-sm"
//                       />
//                       <span className="text-gray-700 dark:text-gray-200">{optionKey}. {q[`option${optionKey}`]}</span>
//                     </label>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}

//             <div className="text-center mt-6">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 ${
//                   isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8z"
//                       />
//                     </svg>
//                     Submitting...
//                   </span>
//                 ) : (
//                   "Submit Quiz"
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </>
//   );
// };

// export default QuizModal;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const getRandomQuestions = (questions, count = 10) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const QuizEntryModal = ({ onStartQuiz, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="relative bg-gradient-to-br from-cyan-500 to-slate-600 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.5,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-3xl font-bold mb-2">Test Your Financial Knowledge!</h3>
            <p className="text-lg opacity-90">
              Take our 2-minute quiz and unlock premium financial insights
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-400/20 p-1 rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Discover your financial learning score</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-400/20 p-1 rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Only 10 quick questions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400/20 p-1 rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Personalized recommendations</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartQuiz}
            className="w-full py-4 bg-white text-cyan-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Start Quiz Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const QuizResultModal = ({ score,  onRetake, onClose, onLogin }) => {
  const passed = score >= 70;
  const midRange = score >= 50 && score < 70;
  const failed = score <= 40;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-6">
          <div>
            <div className="text-7xl mb-4">
              {failed ? "😞" : midRange ? "🤔" : "🎉"}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {failed ? "Better Luck Next Time!"
                : midRange ? "Good Effort!"
                : "Congratulations!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Your score: <span className="font-bold">{score}%</span> 
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200">
              {failed ? "Don't worry, financial learning is a journey. Keep learning and try again!"
                : midRange ? "You're on the right track! A little more practice and you'll ace it next time."
                : "You've demonstrated excellent financial knowledge! Well done!"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRetake}
              className={`px-6 py-3 rounded-lg font-medium ${
                failed ? "bg-blue-600 hover:bg-blue-700 text-white"
                : midRange ? "bg-slate-600 hover:bg-slate-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {failed ? "Try Again"
                : midRange ? "Retake Quiz to Improve"
                : "Retake Quiz"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg font-medium"
            >
              Close
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuizModal = ({ showModal, setShowModal, allQuestions, userId, onLoginClick }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    if (showModal && allQuestions.length > 0) {
      console.log("allQuestions:", allQuestions);
      const selected = getRandomQuestions(allQuestions, 10);
      setDisplayedQuestions(selected);
      setSelectedAnswers({});
      setQuizResult(null);
      setShowEntryModal(true);
      setShowResultModal(false);
      setShowConfetti(false);
    }
  }, [showModal, allQuestions]);

  const handleOptionChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: `Option_${selectedOption}`,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      userId: parseInt(userId) || 0, // Fallback to 0 if userId is undefined
      corporateUser: false,
      answers: displayedQuestions.map((q) => ({
        questionId: q.questionId.startsWith("Q") ? q.questionId : `Q${q.questionId}`,
        selectedOption: selectedAnswers[q.questionId],
      })),
    };

    if (payload.answers.some((ans) => !ans.selectedOption)) {
      return toast.error("Please answer all questions.");
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to submit the quiz.");
        onLoginClick();
        setIsSubmitting(false);
        return;
      }

      console.log("Payload:", payload);
      const res = await axios.post(`${API_BASE}/assessment/submit`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", res.data);

      if (res.status === 200 && res.data.score !== undefined) {

         const answersReveal = {};
          displayedQuestions.forEach(q => {
            const correctOption = Object.entries({
              A: q.optionA,
              B: q.optionB,
              C: q.optionC,
              D: q.optionD
            }).find(([key, value]) => value === q.correctAns)?.[0];

            const userSelected = selectedAnswers[q.questionId];
            answersReveal[q.questionId] = {
              correct: `Option_${correctOption}`,
              wrong: userSelected && userSelected !== `Option_${correctOption}` ? userSelected : null
            };
          });

          setRevealedAnswers(answersReveal);

        setQuizResult({
          score: res.data.score,
          resultStatus: res.data.resultStatus,
        });
        localStorage.setItem("hasTakenQuiz", "true"); // Mark quiz as taken
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setTimeout(() => setShowResultModal(true), 100*60); // 6-second pause before result modal
        toast.success("Quiz submitted successfully!", {
          icon: "🎉",
          style: {
            background: "linear-gradient(to right, #074f92ff, #0944c4ff)",
            color: "white",
          },
        });
      } else {
        console.error("Unexpected response:", res);
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Submission failed:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAnswers({});
    setQuizResult(null);
    setShowEntryModal(true);
    setShowResultModal(false);
    setShowConfetti(false);
    localStorage.setItem("hasSeenQuizModal", "true"); // Mark modal as seen
  };

  const startQuiz = () => {
    setShowEntryModal(false);
  };

  const retakeQuiz = () => {
    const selected = getRandomQuestions(allQuestions, 10);
    setDisplayedQuestions(selected);
    setSelectedAnswers({});
    setQuizResult(null);
    setShowResultModal(false);
    setShowConfetti(false);
  };

  if (!showModal) return null;

  const answeredQuestions = Object.keys(selectedAnswers).length;
  const totalQuestions = displayedQuestions.length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <>
      {showEntryModal ? (
        <QuizEntryModal onStartQuiz={startQuiz} onClose={handleClose} />
      ) : showResultModal && quizResult ? (
        <QuizResultModal
          score={quizResult.score}
          resultStatus={quizResult.resultStatus}
          onRetake={retakeQuiz}
          onClose={handleClose}
          onLogin={!userId ? () => {
            handleClose();
            onLoginClick();
          } : null}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <Toaster position="top-center" containerStyle={{ zIndex: 9999 }} />

            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={handleClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                <span role="img" aria-label="book"></span> CapitalSense Challenge: Decode, Decide, Dominate
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Test your knowledge and unlock premium features!
              </p>
            </div>

            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {answeredQuestions}/{totalQuestions} Questions Answered
              </p>
            </div>

            {displayedQuestions.map((q, idx) => (
              <motion.div
                key={q.questionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
              >
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3">
                  {idx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {/* {["A", "B", "C", "D"].map((optionKey) => (
                    <label
                      key={optionKey}
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                        selectedAnswers[q.questionId] === `Option_${optionKey}`
                          ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-500"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.questionId}
                        value={optionKey}
                        checked={selectedAnswers[q.questionId] === `Option_${optionKey}`}
                        onChange={() => handleOptionChange(q.questionId, optionKey)}
                        className="radio radio-info radio-sm"
                      />
                      <span className="text-gray-700 dark:text-gray-200">{optionKey}. {q[`option${optionKey}`]}</span>
                    </label>
                  ))} */}

                  {["A", "B", "C", "D"].map((optionKey) => {
                  const optionValue = `Option_${optionKey}`;
                  const reveal = revealedAnswers[q.questionId];
                  let optionClasses = "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700";

                  if (reveal) {
                    if (optionValue === reveal.correct) {
                      optionClasses = "flex items-center gap-3 p-3 rounded-md bg-green-100 border border-green-500 text-green-800";
                    } else if (optionValue === reveal.wrong) {
                      optionClasses = "flex items-center gap-3 p-3 rounded-md bg-red-100 border border-red-500 text-red-800";
                    }
                  } else if (selectedAnswers[q.questionId] === optionValue) {
                    optionClasses = "flex items-center gap-3 p-3 rounded-md bg-blue-100 border border-blue-500";
                  }

                  return (
                    <label key={optionKey} className={optionClasses}>
                      <input
                        type="radio"
                        name={q.questionId}
                        value={optionKey}
                        checked={selectedAnswers[q.questionId] === optionValue}
                        onChange={() => handleOptionChange(q.questionId, optionKey)}
                        disabled={!!reveal} // Prevent changes after submit
                        className="radio radio-info radio-sm"
                      />
                      <span className="text-gray-700 dark:text-gray-200">
                        {optionKey}. {q[`option${optionKey}`]}
                      </span>
                    </label>
                  );
                })}

                </div>
              </motion.div>
            ))}

            <div className="text-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Quiz"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default QuizModal;