




import React from 'react';
const chat = "/chat.png";
import { useForm } from 'react-hook-form';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import { FaUser, FaEnvelope, FaComment } from 'react-icons/fa';

const Support = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE}/support/support`,
        {
          fullname: data.username,
          email: data.email,
          query: data.query,
        },
        { withCredentials: true }
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error sending support query:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/2 bg-gradient-to-br from-sky-500 to-cyan-600 p-8 md:p-12 flex flex-col justify-center items-center text-white">
              <div className="max-w-md mx-auto text-center">
                <img
                  src={chat}
                  alt="Customer Support"
                  className="w-full max-w-xs mx-auto mb-8"
                />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  We're Here to Help!
                </h2>
                <p className="text-lg opacity-90">
                  Our support team is ready to assist you with any questions or issues you may have.
                </p>
                <div className="mt-8 space-y-4 text-left">
                  <div className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <FaComment className="text-lg" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Quick Response</h4>
                      <p className="text-sm opacity-80">Typically replies within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <FaUser className="text-lg" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Expert Support</h4>
                      <p className="text-sm opacity-80">Knowledgeable team ready to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:w-1/2 p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Contact <span className="text-sky-600">Support</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Fill out the form below and we'll get back to you soon.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Enter your username"
                        {...register('username', { required: true })}
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-500">Username is required</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                        {...register('email', {
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email.message || "Email is required"}
                      </p>
                    )}
                  </div>

                  {/* Query Field */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Your Query
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FaComment className="text-gray-400" />
                      </div>
                      <textarea
                        rows="4"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Describe your issue or question..."
                        {...register('query', { required: true })}
                      ></textarea>
                    </div>
                    {errors.query && (
                      <p className="mt-1 text-sm text-red-500">Please enter your query</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-700 to-sky-700 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;