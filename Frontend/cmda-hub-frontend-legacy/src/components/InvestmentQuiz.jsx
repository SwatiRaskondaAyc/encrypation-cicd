// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const InvestmentQuiz = ({ token: propToken, email: propEmail, onComplete }) => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(propToken || '');
//   const [showQuiz, setShowQuiz] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   // Quiz answers state
//   const [answers, setAnswers] = useState({
//     userInvestmentExperience: '',
//     primaryInvestmentGoal: '',
//     preferredAssetType: '',
//     investmentActivityFrequency: '',
//     mainInvestmentChallenge: ''
//   });

//   const questions = [
//     {
//       id: 'userInvestmentExperience',
//       title: 'Investment Experience',
//       description: 'How would you describe your experience with capital markets investments?',
//       options: [
//         { value: 'Beginner', label: 'Beginner (less than 1 year)' },
//         { value: 'Intermediate', label: 'Intermediate (1-5 years)' },
//         { value: 'Advanced', label: 'Advanced (5+ years)' },
//         { value: 'Expert', label: 'Expert (professional or high-volume trader)' }
//       ]
//     },
//     {
//       id: 'primaryInvestmentGoal',
//       title: 'Primary Investment Goal',
//       description: "What's your main goal for using investment tools like ours?",
//       options: [
//         { value: 'Long-term wealth building', label: 'Long-term wealth building' },
//         { value: 'Short-term trading opportunities', label: 'Short-term trading opportunities' },
//         { value: 'Research and education', label: 'Research and education' },
//         { value: 'Portfolio monitoring and diversification', label: 'Portfolio monitoring and diversification' }
//       ]
//     },
//     {
//       id: 'preferredAssetType',
//       title: 'Preferred Asset Types',
//       description: 'Which asset classes interest you most? (Select one primary)',
//       options: [
//         { value: 'Stocks and equities', label: 'Stocks and equities' },
//         { value: 'Bonds and fixed income', label: 'Bonds and fixed income' },
//         { value: 'Mutual funds/ETFs', label: 'Mutual funds/ETFs' },
//         { value: 'Derivatives and options', label: 'Derivatives and options' }
//       ]
//     },
//     {
//       id: 'investmentActivityFrequency',
//       title: 'Frequency of Activity',
//       description: 'How often do you engage with investments?',
//       options: [
//         { value: 'Daily', label: 'Daily (active trader)' },
//         { value: 'Weekly', label: 'Weekly' },
//         { value: 'Monthly', label: 'Monthly' },
//         { value: 'Occasionally', label: 'Occasionally (a few times a year)' }
//       ]
//     },
//     {
//       id: 'mainInvestmentChallenge',
//       title: 'Key Challenge (Optional)',
//       description: "What's your biggest challenge in investing right now?",
//       options: [
//         { value: 'Market volatility and timing', label: 'Market volatility and timing' },
//         { value: 'Analyzing data and trends', label: 'Analyzing data and trends' },
//         { value: 'Choosing the right assets', label: 'Choosing the right assets' },
//         { value: 'Staying informed on regulations/news', label: 'Staying informed on regulations/news' }
//       ],
//       optional: true
//     }
//   ];

//   // Check if quiz should be shown (only if not passed via props)
//   useEffect(() => {
//     const checkQuizStatus = async () => {
//       const storedToken = propToken || localStorage.getItem('authToken');
//       if (!storedToken) {
//         navigate('/login');
//         return;
//       }

//       setToken(storedToken);

//       try {
//         const response = await axios.get('/api/profile/status', {
//           headers: { Authorization: `Bearer ${storedToken}` }
//         });

//         if (!response.data.quizCompleted) {
//           setShowQuiz(true);
//         } else {
//           navigate('/home', { replace: true });
//         }
//       } catch (err) {
//         // If in modal (props passed), always show
//         if (propToken) {
//           setShowQuiz(true);
//         } else {
//           navigate('/home', { replace: true });
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     // If used in modal (props), show immediately
//     if (propToken) {
//       setToken(propToken);
//       setShowQuiz(true);
//       setIsLoading(false);
//     } else {
//       checkQuizStatus();
//     }
//   }, [navigate, propToken]);

//   // Update progress
//   useEffect(() => {
//     const answered = Object.values(answers).filter(v => v !== '').length;
//     const required = 4;
//     setProgress((answered / required) * 100);
//   }, [answers]);

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const handleAnswer = (questionId, value) => {
//     setAnswers(prev => ({ ...prev, [questionId]: value }));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError('');

//     try {
//       await axios.post('/api/profile/submit', answers, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (onComplete) {
//         onComplete();
//       } else {
//         navigate('/home', { replace: true });
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save your profile. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkip = async () => {
//     setIsSubmitting(true);
//     setError('');

//     try {
//       await axios.post('/api/profile/skip', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (onComplete) {
//         onComplete();
//       } else {
//         navigate('/home', { replace: true });
//       }
//     } catch (err) {
//       setError('Failed to skip quiz. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!showQuiz) {
//     return null;
//   }

//   const currentQ = questions[currentQuestion];
//   const isLastQuestion = currentQuestion === questions.length - 1;
//   const canProceed = answers[currentQ.id] !== '' || currentQ.optional;

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//         <div className="text-center p-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//           <h1 className="text-3xl font-bold">Personalize Your Investment Journey</h1>
//           <p className="text-lg mt-2 opacity-90">Help us understand your investment style (optional • 2 minutes)</p>
//         </div>

//         <div className="p-8 space-y-8">
//           {/* Progress Bar */}
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>Question {currentQuestion + 1} of {questions.length}</span>
//               <span>{Math.round(progress)}% Complete</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div 
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           {/* Question */}
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-2xl font-semibold text-gray-800 mb-2">
//                 {currentQ.title}
//               </h3>
//               <p className="text-gray-600">{currentQ.description}</p>
//               {currentQ.optional && (
//                 <p className="text-sm text-gray-500 mt-2 italic">This question is optional</p>
//               )}
//             </div>

//             <div className="space-y-4">
//               {currentQ.options.map((option) => (
//                 <label
//                   key={option.value}
//                   className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
//                     ${answers[currentQ.id] === option.value 
//                       ? 'border-blue-500 bg-blue-50 shadow-md' 
//                       : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
//                     }`}
//                   onClick={() => handleAnswer(currentQ.id, option.value)}
//                 >
//                   <input
//                     type="radio"
//                     name={currentQ.id}
//                     value={option.value}
//                     checked={answers[currentQ.id] === option.value}
//                     onChange={() => handleAnswer(currentQ.id, option.value)}
//                     className="w-5 h-5 text-blue-600 focus:ring-blue-500"
//                   />
//                   <span className="flex-1 text-lg font-medium text-gray-800">
//                     {option.label}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Navigation */}
//           <div className="flex justify-between items-center pt-6">
//             <button
//               onClick={handlePrevious}
//               disabled={currentQuestion === 0}
//               className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               Previous
//             </button>

//             <button
//               onClick={handleSkip}
//               disabled={isSubmitting}
//               className="px-6 py-3 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//               Skip Quiz
//             </button>

//             {isLastQuestion ? (
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting || progress < 80}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//               >
//                 {isSubmitting ? 'Saving...' : 'Complete Profile'}
//               </button>
//             ) : (
//               <button
//                 onClick={handleNext}
//                 disabled={!canProceed}
//                 className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-lg"
//               >
//                 Next
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             )}
//           </div>

//           <div className="text-center pt-8 border-t border-gray-200">
//             <p className="text-sm text-gray-500">
//               You can always update your preferences later in settings
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvestmentQuiz;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const InvestmentQuiz = ({ token: propToken, email: propEmail, onComplete }) => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(propToken || '');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const [answers, setAnswers] = useState({
//     userInvestmentExperience: '',
//     primaryInvestmentGoal: '',
//     preferredAssetType: '',
//     investmentActivityFrequency: '',
//     mainInvestmentChallenge: ''
//   });

//   const questions = [
//     {
//       id: 'userInvestmentExperience',
//       title: 'Investment Experience',
//       description: 'How would you describe your experience with capital markets investments?',
//       options: [
//         { value: 'Beginner', label: 'Beginner (less than 1 year)' },
//         { value: 'Intermediate', label: 'Intermediate (1-5 years)' },
//         { value: 'Advanced', label: 'Advanced (5+ years)' },
//         { value: 'Expert', label: 'Expert (professional or high-volume trader)' }
//       ]
//     },
//     {
//       id: 'primaryInvestmentGoal',
//       title: 'Primary Investment Goal',
//       description: "What's your main goal for using investment tools like ours?",
//       options: [
//         { value: 'Long-term wealth building', label: 'Long-term wealth building' },
//         { value: 'Short-term trading opportunities', label: 'Short-term trading opportunities' },
//         { value: 'Research and education', label: 'Research and education' },
//         { value: 'Portfolio monitoring and diversification', label: 'Portfolio monitoring and diversification' }
//       ]
//     },
//     {
//       id: 'preferredAssetType',
//       title: 'Preferred Asset Types',
//       description: 'Which asset classes interest you most? (Select one primary)',
//       options: [
//         { value: 'Stocks and equities', label: 'Stocks and equities' },
//         { value: 'Bonds and fixed income', label: 'Bonds and fixed income' },
//         { value: 'Mutual funds/ETFs', label: 'Mutual funds/ETFs' },
//         { value: 'Derivatives and options', label: 'Derivatives and options' }
//       ]
//     },
//     {
//       id: 'investmentActivityFrequency',
//       title: 'Frequency of Activity',
//       description: 'How often do you engage with investments?',
//       options: [
//         { value: 'Daily', label: 'Daily (active trader)' },
//         { value: 'Weekly', label: 'Weekly' },
//         { value: 'Monthly', label: 'Monthly' },
//         { value: 'Occasionally', label: 'Occasionally (a few times a year)' }
//       ]
//     },
//     {
//       id: 'mainInvestmentChallenge',
//       title: 'Key Challenge (Optional)',
//       description: "What's your biggest challenge in investing right now?",
//       options: [
//         { value: 'Market volatility and timing', label: 'Market volatility and timing' },
//         { value: 'Analyzing data and trends', label: 'Analyzing data and trends' },
//         { value: 'Choosing the right assets', label: 'Choosing the right assets' },
//         { value: 'Staying informed on regulations/news', label: 'Staying informed on regulations/news' }
//       ],
//       optional: true
//     }
//   ];

//   // ✅ Check if quiz already completed
//   useEffect(() => {
//     const checkQuizStatus = async () => {
//       const storedToken = propToken || localStorage.getItem('authToken');

//       if (!storedToken) {
//         navigate('/login', { replace: true });
//         return;
//       }

//       setToken(storedToken);

//       try {
//         const response = await axios.get('/api/profile/status', {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         });

//         if (response?.data?.quizCompleted) {
//           if (onComplete) onComplete();
//           navigate('/login', { replace: true });
//         } else {
//           setIsLoading(false);
//         }
//       } catch (err) {
//         console.error('Quiz status check failed:', err);
//         navigate('/login', { replace: true });
//       }
//     };

//     checkQuizStatus();
//   }, [navigate, propToken, onComplete]);

//   const handleAnswer = (questionId, value) => {
//     setAnswers(prev => ({ ...prev, [questionId]: value }));
//   };

//   const smoothRedirectToLogin = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       navigate('/login', { replace: true });
//     }, 300);
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError('');

//     try {
//       await axios.post('/api/profile/submit', answers, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (onComplete) onComplete();
//       smoothRedirectToLogin();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save your profile. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkip = async () => {
//     setIsSubmitting(true);
//     setError('');

//     try {
//       await axios.post('/api/profile/skip', {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (onComplete) onComplete();
//       smoothRedirectToLogin();
//     } catch (err) {
//       setError('Failed to skip quiz. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const requiredCount = 4;
//   const answeredCount = questions.filter(q => q.optional ? true : answers[q.id] !== '').length;
//   const progress = (answeredCount / requiredCount) * 100;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-3 text-sm text-gray-600">Redirecting...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-full overflow-hidden flex flex-col">
//       <div className="text-center p-5 pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-shrink-0">
//         <h1 className="text-lg md:text-xl font-bold">Personalize Your Investment Journey</h1>
//         <p className="text-xs md:text-sm mt-1 opacity-90">Help us understand your investment style (optional • 2 minutes)</p>
//       </div>

//       <div className="flex-1 overflow-y-auto px-4 py-3">
//         <div className="max-w-2xl mx-auto space-y-5">

//           <div className="space-y-1.5">
//             <div className="flex justify-between text-xs text-gray-600">
//               <span>{answeredCount} of {requiredCount} required</span>
//               <span>{Math.round(progress)}% Complete</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
//               {error}
//             </div>
//           )}

//           <div className="space-y-5">
//             {questions.map((q, idx) => (
//               <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//                 <div className="mb-3">
//                   <h3 className="text-sm md:text-base font-semibold text-gray-800">
//                     {idx + 1}. {q.title}
//                   </h3>
//                   <p className="text-xs md:text-sm text-gray-600 mt-1">{q.description}</p>
//                   {q.optional && (
//                     <p className="text-xs text-gray-500 italic mt-1">Optional</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   {q.options.map((option) => (
//                     <label
//                       key={option.value}
//                       className={`flex items-center space-x-2 p-2.5 rounded-lg border cursor-pointer transition-all text-xs md:text-sm
//                         ${answers[q.id] === option.value 
//                           ? 'border-blue-500 bg-blue-50 shadow-sm' 
//                           : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                         }`}
//                       onClick={() => handleAnswer(q.id, option.value)}
//                     >
//                       <input
//                         type="radio"
//                         name={q.id}
//                         value={option.value}
//                         checked={answers[q.id] === option.value}
//                         onChange={() => handleAnswer(q.id, option.value)}
//                         className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="flex-1 font-medium text-gray-800">
//                         {option.label}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="text-center pt-2">
//             <p className="text-xs text-gray-500">
//               You can always update your preferences later in settings
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
//         <div className="max-w-2xl mx-auto flex gap-3 justify-between">
//           <button
//             onClick={handleSkip}
//             disabled={isSubmitting}
//             className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
//           >
//             Skip Quiz
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting || progress < 100}
//             className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? 'Saving...' : 'Complete Profile'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvestmentQuiz;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const InvestmentQuiz = ({ token: propToken, email: propEmail, onComplete }) => {
//   const navigate = useNavigate();
//   const [token, setToken] = useState(propToken || '');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const [answers, setAnswers] = useState({
//     userInvestmentExperience: '',
//     primaryInvestmentGoal: '',
//     preferredAssetType: '',
//     mainInvestmentChallenge: ''
//   });

//   const API_BASE = import.meta.env.VITE_URL;

//   useEffect(() => {
//     const storedToken = propToken || localStorage.getItem('authToken');
//     if (!storedToken) navigate('/login', { replace: true });
//     setToken(storedToken);
//   }, [propToken, navigate]);

//   const handleAnswer = (questionId, value) => {
//     setAnswers((prev) => ({ ...prev, [questionId]: value }));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError('');
//     try {
//       await axios.post(`${API_BASE}/profile/submit`, answers, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (onComplete) onComplete();
//       navigate('/login', { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Something went wrong.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSkip = async () => {
//     try {
//       await axios.post(`${API_BASE}/profile/skip`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (onComplete) onComplete();
//       navigate('/login', { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to skip quiz.');
//     }
//   };

//   const allAnswered =
//     answers.userInvestmentExperience &&
//     answers.primaryInvestmentGoal &&
//     answers.preferredAssetType;

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
//         <h1 className="text-lg md:text-xl font-semibold">Personalize Your Experience</h1>
//         <button
//           onClick={handleSkip}
//           className="text-sm font-medium underline hover:text-gray-100"
//         >
//           Skip
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 text-sm text-center">
//           {error}
//         </div>
//       )}

//       {/* 2x2 Grid */}
//       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-5xl mx-auto w-full">
//         {/* Q1 */}
//         <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
//           <h3 className="text-gray-800 font-semibold mb-2">1. Investment Experience</h3>
//           {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
//             <label
//               key={level}
//               className={`block text-sm px-3 py-2 rounded-lg cursor-pointer border mb-2 transition ${answers.userInvestmentExperience === level
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//               onClick={() => handleAnswer('userInvestmentExperience', level)}
//             >
//               <input
//                 type="radio"
//                 name="experience"
//                 checked={answers.userInvestmentExperience === level}
//                 onChange={() => handleAnswer('userInvestmentExperience', level)}
//                 className="mr-2 text-blue-600"
//               />
//               {level}
//             </label>
//           ))}
//         </div>

//         {/* Q2 */}
//         <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
//           <h3 className="text-gray-800 font-semibold mb-2">2. Primary Investment Goal</h3>
//           {[
//             'Long-term wealth building',
//             'Short-term trading opportunities',
//             'Research and education',
//             'Portfolio monitoring and diversification',
//           ].map((goal) => (
//             <label
//               key={goal}
//               className={`block text-sm px-3 py-2 rounded-lg cursor-pointer border mb-2 transition ${answers.primaryInvestmentGoal === goal
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//               onClick={() => handleAnswer('primaryInvestmentGoal', goal)}
//             >
//               <input
//                 type="radio"
//                 name="goal"
//                 checked={answers.primaryInvestmentGoal === goal}
//                 onChange={() => handleAnswer('primaryInvestmentGoal', goal)}
//                 className="mr-2 text-blue-600"
//               />
//               {goal}
//             </label>
//           ))}
//         </div>

//         {/* Q3 */}
//         <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
//           <h3 className="text-gray-800 font-semibold mb-2">3. Preferred Asset Type</h3>
//           {[
//             'Stocks and equities',
//             'Bonds and fixed income',
//             'Mutual funds/ETFs',
//             'Derivatives and options',
//           ].map((asset) => (
//             <label
//               key={asset}
//               className={`block text-sm px-3 py-2 rounded-lg cursor-pointer border mb-2 transition ${answers.preferredAssetType === asset
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//               onClick={() => handleAnswer('preferredAssetType', asset)}
//             >
//               <input
//                 type="radio"
//                 name="asset"
//                 checked={answers.preferredAssetType === asset}
//                 onChange={() => handleAnswer('preferredAssetType', asset)}
//                 className="mr-2 text-blue-600"
//               />
//               {asset}
//             </label>
//           ))}
//         </div>

//         {/* Q4 */}
//         <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
//           <h3 className="text-gray-800 font-semibold mb-2">4. Key Challenge (Optional)</h3>
//           {[
//             'Market volatility and timing',
//             'Analyzing data and trends',
//             'Choosing the right assets',
//             'Staying informed on regulations/news',
//           ].map((challenge) => (
//             <label
//               key={challenge}
//               className={`block text-sm px-3 py-2 rounded-lg cursor-pointer border mb-2 transition ${answers.mainInvestmentChallenge === challenge
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//               onClick={() => handleAnswer('mainInvestmentChallenge', challenge)}
//             >
//               <input
//                 type="radio"
//                 name="challenge"
//                 checked={answers.mainInvestmentChallenge === challenge}
//                 onChange={() => handleAnswer('mainInvestmentChallenge', challenge)}
//                 className="mr-2 text-blue-600"
//               />
//               {challenge}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Bottom Fixed Submit Button */}
//       <div className="p-4 border-t bg-white shadow-inner">
//         <div className="max-w-5xl mx-auto">
//           <button
//             onClick={handleSubmit}
//             disabled={!allAnswered || isSubmitting}
//             className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
//           >
//             {isSubmitting ? 'Saving...' : 'Complete Profile →'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvestmentQuiz;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TrendingUp,
  Target,
  PieChart,
  AlertCircle,
  ArrowRight,
  SkipForward,
  CheckCircle2
} from 'lucide-react';

const InvestmentQuiz = ({ token: propToken, email: propEmail, onComplete }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(propToken || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);

  const [answers, setAnswers] = useState({
    userInvestmentExperience: '',
    primaryInvestmentGoal: '',
    preferredAssetType: '',
    mainInvestmentChallenge: ''
  });

  const API_BASE = import.meta.env.VITE_URL;

  useEffect(() => {
    const storedToken = propToken || localStorage.getItem('authToken');
    if (!storedToken) navigate('/login', { replace: true });
    setToken(storedToken);
  }, [propToken, navigate]);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/profile/submit`, answers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onComplete) {
        // onComplete();
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      await axios.post(`${API_BASE}/profile/skip`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onComplete) {
        // onComplete();
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to skip quiz.');
    }
  };

  const allAnswered =
    answers.userInvestmentExperience &&
    answers.primaryInvestmentGoal &&
    answers.preferredAssetType;

  const questions = [
    {
      id: 'userInvestmentExperience',
      title: 'Investment Experience',
      subtitle: 'How would you describe your investment knowledge?',
      icon: <TrendingUp className="w-5 h-5" />,
      options: [
        { label: 'Beginner', description: 'New to investing, learning the basics' },
        { label: 'Intermediate', description: 'Some experience, comfortable with common terms' },
        { label: 'Advanced', description: 'Regular investor, understand market dynamics' },
        { label: 'Expert', description: 'Professional or highly experienced investor' }
      ]
    },
    {
      id: 'primaryInvestmentGoal',
      title: 'Primary Goal',
      subtitle: 'What are you aiming to achieve?',
      icon: <Target className="w-5 h-5" />,
      options: [
        { label: 'Long-term wealth building', description: 'Retirement, generational wealth' },
        { label: 'Short-term trading opportunities', description: 'Active trading, quick gains' },
        { label: 'Research and education', description: 'Learning and skill development' },
        { label: 'Portfolio monitoring', description: 'Tracking and diversifying existing investments' }
      ]
    },
    {
      id: 'preferredAssetType',
      title: 'Preferred Assets',
      subtitle: 'Which assets interest you most?',
      icon: <PieChart className="w-5 h-5" />,
      options: [
        { label: 'Stocks and equities', description: 'Company shares, growth stocks' },
        { label: 'Bonds and fixed income', description: 'Government/corporate bonds' },
        { label: 'Mutual funds/ETFs', description: 'Diversified funds, index tracking' },
        { label: 'Derivatives and options', description: 'Advanced financial instruments' }
      ]
    },
    {
      id: 'mainInvestmentChallenge',
      title: 'Key Challenge',
      subtitle: 'What hurdles do you face? (Optional)',
      icon: <AlertCircle className="w-5 h-5" />,
      optional: true,
      options: [
        { label: 'Market volatility', description: 'Timing and price fluctuations' },
        { label: 'Analyzing data', description: 'Interpreting trends and reports' },
        { label: 'Choosing assets', description: 'Asset selection and allocation' },
        { label: 'Staying informed', description: 'News, regulations, updates' }
      ]
    }
  ];

  const progress = (Object.values(answers).filter(Boolean).length / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Elegant Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Investment Profile</h1>
                <p className="text-xs text-gray-500">Personalize your experience</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="text-xs text-gray-500 mb-1">
                  {Math.round(progress)}% Complete
                </div>
                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleSkip}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip for now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Tailor Your Investment Journey
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us understand your preferences to deliver a personalized experience
            with relevant insights and recommendations.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${activeQuestion === question.id ? 'ring-2 ring-blue-500' : ''
                } ${question.optional ? 'border-gray-200' : 'border-gray-100'}`}
              onMouseEnter={() => setActiveQuestion(question.id)}
              onMouseLeave={() => setActiveQuestion(null)}
            >
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${answers[question.id]
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                      }`}>
                      {question.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {question.title}
                        </h3>
                        {question.optional && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{question.subtitle}</p>
                    </div>
                  </div>

                  {answers[question.id] && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleAnswer(question.id, option.label)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${answers[question.id] === option.label
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 ring-1 ring-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${answers[question.id] === option.label
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                            }`}>
                            {answers[question.id] === option.label && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {option.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-8 mt-1">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator - Mobile */}
        <div className="block sm:hidden mb-6">
          <div className="text-center mb-2">
            <span className="text-sm text-gray-600">
              {Object.values(answers).filter(Boolean).length} of 3 required questions answered
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Fixed Action Button */}
        <div className="sticky bottom-6 z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 max-w-md mx-auto">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${allAnswered
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Your Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Profile</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!allAnswered && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Please answer all required questions to continue
              </p>
            )}

            <div className="text-center mt-4">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
              >
                Skip and complete later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentQuiz;
