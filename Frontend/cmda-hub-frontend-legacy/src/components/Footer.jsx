
import React from 'react';
import { FaPhoneAlt, FaYoutube, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Footer = () => {
  const { isLoggedIn } = useAuth();

  const logActivity = async (message) => {
    console.log(`Activity logged: ${message}`);
    return Promise.resolve();
  };

  const handleNavClick = async (label) => {
    await logActivity(`${label} tab clicked`);
  };

  const handleDashboardClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error('Please login to access the Dashboard');
    } else {
      handleNavClick('Dashboard');
    }
  };

  const handleSocialClick = (platform) => {
    logActivity(`Clicked on ${platform}`);
    const socialLinks = {
      Youtube: 'https://www.youtube.com/@aYc_Analytics_Pvt_Ltd',
      Instagram: 'https://www.instagram.com/aycanalytics_/',
      LinkedIn: 'https://in.linkedin.com/company/ayc-analytics-business-intelligence',
      Facebook: 'https://www.facebook.com/profile.php?id=61577860989803',
    };
    window.open(socialLinks[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-white">
              #CMD<span className="text-sky-600">A</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crafting Strategic Solutions for Business Excellence
            </p>
            <p className="text-sm italic text-gray-500">
              "Empowering businesses with data-driven insights."
            </p>
            <div className="flex space-x-3">
              {[
                { platform: 'Youtube', Icon: FaYoutube, color: 'hover:bg-red-600' },
                { platform: 'Instagram', Icon: FaInstagram, color: 'hover:bg-pink-600' },
                { platform: 'LinkedIn', Icon: FaLinkedin, color: 'hover:bg-blue-600' },
                { platform: 'Facebook', Icon: FaFacebook, color: 'hover:bg-blue-600' },
              ].map(({ platform, Icon, color }) => (
                <button
                  key={platform}
                  onClick={() => handleSocialClick(platform)}
                  className={`p-2 rounded-md bg-gray-800 ${color} text-white hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-opacity-50`}
                  aria-label={platform}
                >
                  <Icon className="text-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-sky-600 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Portfolio', to: '/portfolio' },
                { label: 'Equity Insights', to: '/equityinsights' },
                { label: 'Research Panel', to: '/researchpanel', onClick: handleDashboardClick },
                { label: 'About Us', to: '/about' },
              ].map(({ label, to, onClick = () => handleNavClick(label) }) => (
                <li key={label}>
                  <Link
                    to={to}
                    onClick={onClick}
                    className="text-gray-300 hover:text-sky-600 transition-colors duration-200 text-sm flex items-center group focus:outline-none focus:text-sky-600"
                  >
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-sky-600 pb-2">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Support', to: '/support' },
                { label: 'Terms & Conditions', to: '/terms' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    onClick={() => handleNavClick(label)}
                    className="text-gray-300 hover:text-sky-600 transition-colors duration-200 text-sm flex items-center group focus:outline-none focus:text-sky-600"
                  >
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-sky-600 pb-2">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaLocationDot className="text-cyan-600 text-lg mr-3 mt-1" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  aYc Analytics 3rd floor, Incube co-working space, next to Medipoint Hospital, opposite to Bank of Baroda ATM, Tejaswini Housing Society, Aundh, Pune, Maharashtra 411045
                </p>
              </div>
              <div className="flex items-center">
                <MdEmail className="text-cyan-600 text-lg mr-3" />
                <a
                  href="mailto:support@cmdahub.com"
                  className="text-gray-300 hover:text-sky-600 transition-colors duration-200 text-sm"
                >
                  support@cmdahub.com
                </a>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-cyan-600 text-lg mr-3" />
                <a
                  href="tel:+919860998411"
                  className="text-gray-300 hover:text-sky-600 transition-colors duration-200 text-sm"
                >
                  +91 9860998411
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-400 mb-4 sm:mb-0">
            © {new Date().getFullYear()} All rights reserved by{' '}
            <span className="font-semibold text-white">
              #CMD<span className="text-sky-600">A</span>
            </span>
          </p>
          <div className="flex space-x-4 sm:space-x-6">
            {[
              { label: 'Privacy Policy', to: '/terms' },
              { label: 'Terms of Service', to: '/terms' },
              // { label: 'Cookie Policy', to: '/cookies' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-gray-400 hover:text-sky-600 transition-colors duration-200 focus:outline-none focus:text-sky-600"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;