import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import portfolio from '../../public/portfolio.png';
import Login from './Login';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  return (
    <>
      <Navbar />
      <div>
        <h1>
          <p className="m-20 text-5xl text-center font-bold">
            Data to enrich your <span className="text-yellow-500">Portfolio</span>
            <p className="text-gray-800 dark:text-gray-300 mt-2 text-sm">
              With insight comes opportunity, We'll help you trade and invest better from the get-go
            </p>
          </p>
          <div className="flex flex-col items-center justify-center">
            <figure>
              <img
                className="h-auto w-full max-w-lg object-cover"
                src={portfolio}
                alt="portfolio"
              />
            </figure>
            <Link
              className="btn btn-primary mt-6 m-10"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Learn more
            </Link>
            <Login />
          </div>
        </h1>
      </div>
      <Footer />
    </>
  );
};

export default Portfolio;
