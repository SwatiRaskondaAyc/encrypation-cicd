// import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

const allFaqs = {
  "Getting Started": [
    {
      question: "What is the 'Capital Market Data Analysis' application?",
      answer: "It's a platform to analyze and interpret financial market data for smarter decisions.",
      image: "https://cdn-icons-png.flaticon.com/512/1170/1170627.png"
    },
    {
      question: "How do I get started with the application?",
      answer: "Sign up, pick a plan, and follow the onboarding tutorial.",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    {
      question: "Is there a tutorial or support for beginners?",
      answer: "Yes! We offer a beginner-friendly guide and 24/7 support.",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png"
    },
  ],
  "Features": [
    {
      question: "How can this application help me analyze market trends?",
      answer: "It uses algorithms and visualizations to detect trends and anomalies.",
      image: "https://cdn-icons-png.flaticon.com/512/3242/3242257.png"
    },
    {
      question: "What types of data or insights does the platform provide?",
      answer: "Stock performance, indices, sector analysis, and predictive analytics.",
      image: "https://cdn-icons-png.flaticon.com/512/1584/1584906.png"
    },
    {
      question: "Can I customize the analysis based on specific sectors or markets?",
      answer: "Absolutely! Filter by sectors, regions, or preferences.",
      image: "https://cdn-icons-png.flaticon.com/512/3771/3771491.png"
    },
    {
      question: "Is the data updated in real-time?",
      answer: "Yes, the data updates in real-time for the latest insights.",
      image: "https://cdn-icons-png.flaticon.com/512/831/831610.png"
    },
  ],
  "Pricing": [
    {
      question: "What are the subscription plans or pricing options?",
      answer: "Free, basic, and premium plans — see the pricing page.",
      image: "https://cdn-icons-png.flaticon.com/512/3208/3208759.png"
    },
  ],
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Getting Started');
  const [viewType, setViewType] = useState('accordion');

  const [formData, setFormData] = useState({ name: '', email: '', complaint: '' });
  const [formErrors, setFormErrors] = useState({});

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  const isFormValid = () =>
    formData.name.trim() &&
    validateEmail(formData.email) &&
    formData.complaint.trim();

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid()) {
      alert('Complaint submitted successfully!');
      setFormData({ name: '', email: '', complaint: '' });
      setFormErrors({});
    } else {
      setFormErrors({
        name: !formData.name ? 'Name is required' : '',
        email: !validateEmail(formData.email) ? 'Invalid email' : '',
        complaint: !formData.complaint ? 'Complaint is required' : '',
      });
    }
  };

  const filteredFaqs = allFaqs[activeCategory].filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 dark:text-white min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-slate-800 dark:to-slate-700 py-12 mb-10 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">
          <motion.div
            className="flex-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Use the search and tabs to find your answers quickly.
            </p>
          </motion.div>

          <img
            src="/faq.avif"
            alt="FAQ Illustration"
            className="w-40 h-40 md:w-48 md:h-48 object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full px-4 py-3 mb-6 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Tabs */}
        <div className="relative mb-6">
          <div className="flex flex-wrap gap-4">
            {Object.keys(allFaqs).map(category => (
              <button
                key={category}
                className={`relative px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${activeCategory === category
                  ? 'bg-cyan-500 text-white border-blue-600'
                  : 'bg-gray-200 dark:bg-slate-700 dark:text-white'
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setViewType(viewType === 'accordion' ? 'cards' : 'accordion')}
            className="px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-700 transition-all"
          >
            Switch to {viewType === 'accordion' ? 'Card View' : 'Accordion View'}
          </button>
        </div>

        {/* FAQ List */}
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) =>
                viewType === 'accordion' ? (
                  <motion.details
                    key={index}
                    className="group bg-gray-50 dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none text-lg font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-4">
                        <motion.img
                          src={faq.image}
                          alt="icon"
                          className="w-8 h-8"
                          initial={{ rotate: -10 }}
                          animate={{ rotate: 0 }}
                          transition={{ duration: 0.4 }}
                        />
                        <span>{faq.question}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 pl-12 text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.details>
                ) : (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:scale-[1.01] hover:shadow-xl transition-transform duration-300"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img src={faq.image} alt="icon" className="w-10 h-10" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </motion.div>
                )
              )
            ) : (
              <motion.div
                className="col-span-2 text-center py-10 text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No FAQs match your search.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Complaint Form Section */}
      {/* <div className="bg-blue-50 dark:bg-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-10 items-center">
          {/* Form 
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md border dark:border-gray-700 space-y-5"
          >
            <h2 className="text-2xl font-semibold mb-4">Have any complaints?</h2>

            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded border dark:bg-slate-800 dark:border-gray-600"
              />
              {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded border dark:bg-slate-800 dark:border-gray-600"
              />
              {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Complaint</label>
              <textarea
                rows="4"
                value={formData.complaint}
                onChange={e => setFormData({ ...formData, complaint: e.target.value })}
                className="w-full p-3 rounded border dark:bg-slate-800 dark:border-gray-600"
              ></textarea>
              {formErrors.complaint && <p className="text-red-500 text-sm">{formErrors.complaint}</p>}
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className="bg-cyan-600 text-white px-5 py-3 rounded hover:bg-cyan-700 disabled:opacity-50"
            >
              Submit Complaint
            </button>
          </form>

          {/* Image 
          <div className="text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/8942/8942698.png"
              alt="Customer support"
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </div> */}

      <Footer />
    </div>
  );
};

export default FAQ;

