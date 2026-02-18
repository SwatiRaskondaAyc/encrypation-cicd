import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import ChatLogin from './ChatLogin'

const StockTalks = () => {
  return (
    <div style={{color:"white",fontSize: '1rem',fontWeight:'bold'}}>
        <Navbar/>
        <div>
        <div
  class="hero min-h-screen"
  style={{
    backgroundImage:
      "url(https://img.freepik.com/free-vector/data-report-concept-illustration_114360-2530.jpg?t=st=1737106522~exp=1737110122~hmac=4c35561c685e1307c3884a03d7761f38726574dc3057661bc6adffa8c5679722&w=740)",
     
    backgroundPosition: "center",
    // width: "100vw", 
    height: "100vh", 
    
  }}>
  <div className="hero-overlay"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
      <p className="mb-5">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      
      <a
              className="btn btn-wide btn-warning bg-slate-800 dark:bg-slate-900 text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Start ChitChat
            </a>
            <ChatLogin />
    </div>
  </div>
</div>
        </div>
        <Footer/>
    </div>
  )
}

export default StockTalks