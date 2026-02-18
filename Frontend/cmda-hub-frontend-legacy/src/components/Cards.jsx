import React from 'react';

const Cards = ({ stock }) => {
  return (
    <div className="card bg-cyan-200 w-92 shadow-xl m-3 hover:scale-105 duration-200 dark:bg-cyan-600">
      <figure>
        <img
          src={stock.image}
          alt={stock.name}
          className="w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body p-10">
        <h2 className="card-title px-100">
          {stock.name}
          <div className="badge badge-blue"><b>{stock.category}</b></div>
        </h2>
        <div badge badge-outline cursor-pointer rounded-full border-2>
        <p>  {stock.price}</p>
        </div>
        <p><b>{stock.title}</b></p>
        <div className="card-actions justify-end">
         
          <div className="cursor-pointer rounded-full border-2 bg-warning duration-300 p-3 hover:bg-base-content hover:text-base-200">
           Read More
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
