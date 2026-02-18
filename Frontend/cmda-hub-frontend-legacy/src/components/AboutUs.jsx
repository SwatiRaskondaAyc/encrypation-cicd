
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaChartLine, FaUsers, FaShieldAlt, FaRocket } from "react-icons/fa";
import accord from '/accord_fintech_logo.png'
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800 dark:bg-slate-800 dark:text-white">
      <Helmet>
        <title>About CMDA Hub | Empowering Investors with Intelligent Market Analytics</title>
        <meta
          name="description"
          content="Discover CMDA Hub - Your next-generation Capital Market Data Analytics platform. AI-powered insights, portfolio analysis, and educational tools for smarter investing."
        />
        <link rel="canonical" href="https://cmdahub.com/about" />

        {/* Open Graph (for Facebook, LinkedIn) */}
        <meta property="og:title" content="About CMDA Hub | Empowering Investors with Intelligent Market Analytics" />
        <meta
          property="og:description"
          content="Transform your investment strategy with CMDA's AI-powered analytics, portfolio insights, and collaborative trading community."
        />
        <meta property="og:url" content="https://cmdahub.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cmdahub.com/about-cover.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About CMDA Hub | Empowering Investors with Intelligent Market Analytics" />
        <meta
          name="twitter:description"
          content="Join CMDA Hub - Where data-driven insights meet intelligent investing. AI analytics, portfolio management, and market education in one platform."
        />
        <meta name="twitter:image" content="https://cmdahub.com/about-cover.jpg" />
      </Helmet>

      <Navbar />

      <section className="pt-24 px-4 sm:px-8 lg:px-20 py-12 dark:bg-slate-800 dark:text-white">
        {/* Header */}
        <motion.div
          className="text-center mb-16 dark:bg-slate-800 dark:text-white"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white">About CMDA Hub</h2>
          <div className="w-24 h-1 bg-sky-800 mx-auto mt-4 rounded-full dark:bg-slate-800 dark:text-white"></div>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto dark:text-gray-300">
            Transforming how investors interact with capital markets through intelligent analytics,
            AI-powered insights, and collaborative learning.
          </p>
        </motion.div>

        {/* Enhanced Mission & Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-20 dark:bg-slate-800 dark:text-white">
          {/* Our Mission Card - Enhanced */}
          <motion.div
            className="bg-white dark:bg-slate-800 dark:text-white border border-sky-400 rounded-xl p-6 shadow-lg hover:shadow-gray-400 transition duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <FaRocket className="text-cyan-700 text-2xl mr-3 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold text-black dark:text-white">Our Mission</h3>
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-white mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                CMDA<span className="text-cyan-700 dark:text-cyan-400">Hub</span>
              </span>{" "}
              is revolutionizing capital market education and analysis through our next-generation
              analytics platform. We're dedicated to bridging the wealth gap by empowering investors
              with data-driven intelligence.
            </p>
            <div className="bg-sky-50 dark:bg-slate-700 p-4 rounded-lg mt-4">
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                "We transform complex market data into actionable insights, helping you make
                informed decisions instead of speculative guesses."
              </p>
            </div>
          </motion.div>

          {/* Our Values Card - Enhanced */}
          <motion.div
            className="bg-white border border-sky-400 rounded-xl p-6 shadow-lg hover:shadow-gray-400 transition duration-300 dark:bg-slate-800 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-cyan-700 text-2xl mr-3 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold text-black dark:text-white">Why Choose CMDA Hub?</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <FaChartLine className="text-cyan-700 mt-1 mr-3 dark:text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">AI-Powered Intelligence</h4>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    Machine learning algorithms predict price movements and identify hidden market patterns
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FaUsers className="text-cyan-700 mt-1 mr-3 dark:text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Collaborative Community</h4>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    Integrated simulator and social features to share achievements and strategies
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-cyan-700 mt-1 mr-3 dark:text-cyan-400">⚡</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Beginner-Friendly Analytics</h4>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    Dynamic charts, pattern recognition, and jargon-free explanations
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-cyan-700 mt-1 mr-3 dark:text-cyan-400">🎯</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Portfolio Intelligence</h4>
                  <p className="text-gray-700 text-sm dark:text-gray-300">
                    Clear visualization of gains, losses, and actionable insights beyond spreadsheets
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Target Audience Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-center mb-12 dark:text-white">Who We Empower</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Beginner Investors */}
            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Beginner Investors</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Overwhelmed by conflicting advice and complex terminology? We simplify your journey:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Dynamic analysis with advanced graphs and candlestick patterns
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Automatic pattern identification with clear explanations
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  AI tools that uncover hard-to-find company fundamentals
                </li>
              </ul>
            </div>

            {/* Active Traders */}
            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Active Traders</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Tired of wasting hours on manual analysis? Accelerate your decision-making:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Real-time updates and detailed company fundamentals
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Advanced market indicators and customizable charts
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  All critical data consolidated in one platform
                </li>
              </ul>
            </div>

            {/* Portfolio Managers */}
            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Portfolio Holders</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Need clarity beyond spreadsheet numbers? Understand the 'why' behind performance:
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Clear visualization of gains, losses, and key changes
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Early risk and opportunity identification
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-700 mr-2 dark:text-cyan-400">•</span>
                  Organized insights to replace scattered tools
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="mt-24 bg-sky-50  px-6 py-12 rounded-2xl shadow-inner dark:bg-slate-800 dark:text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 items-center gap-12 dark:bg-slate-800 dark:text-white">
            {/* Left: Text Content */}
            <div className="dark:bg-slate-800 dark:text-white">
              <h3 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                Ready to Transform Your <span className="text-cyan-700 dark:text-cyan-400">Investment Journey</span>?
              </h3>
               <p className="text-gray-700 text-lg mb-6 leading-relaxed dark:text-white">
                Ready to transform your investment strategy? Reach out for personalized guidance on leveraging CMDA Hub's powerful analytics.
                Whether you're beginning your investment journey or optimizing complex portfolios, our team is dedicated to helping you
                make smarter, data-driven decisions and achieve your financial goals.
              </p>

              <div className="space-y-4 dark:bg-slate-800 dark:text-white">
                <div className="flex items-center gap-3 text-gray-700 text-lg dark:text-white">
                  <FaEnvelope className="text-sky-500 text-xl" />
                  <a href="mailto:support@cmdahub.com" className="hover:underline dark:text-white">
                    support@cmdahub.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-lg dark:text-white">
                  <FaPhoneAlt className="text-sky-500 text-xl" />
                  <a href="tel:+1234567890" className="hover:underline dark:text-white">
                    9860998411
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="w-full flex justify-center dark:text-white dark:bg-slate-800">
              <img
                src="/about.jpg"
                alt="CMDA Hub Analytics Platform"
                className="rounded-2xl w-full max-w-md object-cover"
              />
            </div>
          </div>

          <div className="mt-12  flex flex-col items-center text-sm text-gray-500 dark:bg-slate-800 dark:text-gray-400">
            <span className="mb-4">Powered by</span>


            <div className="flex items-center justify-center gap-x-10 mb-4 dark:bg-slate-100">
              <img
                src="/ayclogo2.png"
                alt="AYC Logo"
                className="w-40 h-30 object-contain"
              />
              <img
                src={accord}
                alt="Accord Fintech Logo"
                className="w-40 h-30 object-contain"
              />
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 text-xs max-w-xl leading-relaxed dark:text-white">
              <span className="font-semibold dark:text-white">Accord Fintech</span> is our trusted
              <span className="font-semibold dark:text-white"> database provider</span>, delivering
              reliable and comprehensive financial market data that powers our advanced analytics platform.
            </p>
          </div>

        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;