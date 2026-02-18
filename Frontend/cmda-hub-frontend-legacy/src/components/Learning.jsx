import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import learning from '../../public/learning.mp4'

const Learning = () => {
  return (
    <div>
    <Navbar />
    <div>
      <section className="m-20">
        <h1 className="m-20 text-3xl text-center font-bold">
          Analyzing Historical Market Crashes and Recoveries
        </h1>
      </section>
      <div className="m-20 flex justify-center">
        <div className="card glass w-1/2 max-w-2xl">
          <figure>
            <video controls className="w-full h-72">
              <source src={learning} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </figure>
          <div className="card-body">
            <h2 className="card-title text-xl">Learning Stock Market</h2>
            <p>Understand the basics of trading and market analysis.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-warning">Learn now!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  )
}

export default Learning
