import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 dark:bg-gray-900 p-6">
      <Helmet>
        <title>404 – Page Not Found | CMDA Hub</title>
        <meta
          name="description"
          content="Sorry, the page you’re looking for doesn’t exist or has been moved. Go back to CMDA Hub home page."
        />
        <link rel="canonical" href="https://cmdahub.com/404" />
      </Helmet>
      <Navbar />

      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-6">
        Page Not Found
      </h2>

      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn’t exist, has been removed, or the
        name might have changed.
      </p>

  <Link
  to="/"
  className="flex items-center gap-2 px-6 py-3 bg-white border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-700 hover:text-white transition"
>

  <FiArrowLeft />
    Go Back Home
</Link>
    </div>
  );
}
