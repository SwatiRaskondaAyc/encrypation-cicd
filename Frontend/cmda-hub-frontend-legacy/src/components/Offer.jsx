import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Link } from 'react-router-dom'


const Offer = () => {
  return (
    <div >
      <Navbar/>
      <div className='flex flex-row m-10 p-10 '>
      <div>
  <div className="m-5 card-body items-center text-center">
    <h2 className="card-title">Equity Insignts Hub.!</h2>
    <p>Equity Insignts Hub.</p>
    <div className="card-actions justify-end">
      <Link to={'/equityinsights'} className="btn btn-warning">Learn More</Link>
     
    </div>
  </div>
</div>


<div>
<div className="m-5 card bg-neutral text-neutral-content w-96">
  <div className="card-body items-center text-center">
    <h2 className="card-title">User-Portfolio Reporting!</h2>
    <p>User-Portfolio Reporting.</p>
    <div className="card-actions justify-end">
      <Link to={'/portfolio'} className="btn btn-warning">Learn More</Link>
    </div>
  </div>
</div>
</div>
<div>
<div className="m-5 card bg-neutral text-neutral-content w-96">
  <div className="card-body items-center text-center">
    <h2 className="card-title">Upcoming Stocks....!</h2>
    <p>We are using cookies for no reason.</p>
    <div className="card-actions justify-end">
      <Link to={'/'} className="btn btn-warning">Learn More</Link>
     
    </div>
  </div>
</div>



</div>
      </div>
      <Footer/>
    </div>
  )
}


export default Offer