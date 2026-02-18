import React from 'react';

const SlideImages = ({ img }) => {
  return (
    <div className="flex flex-col items-center m-4">
    
      <h1>
        <p className="text-lg md:text-2xl text-center font-bold mb-4">
          {img.heading}
        </p>
      </h1>

      
      <div className="flex flex-col md:flex-row items-center dark:bg-slate-900 dark:text-white  w-full shadow-xl hover:scale-105 duration-200 rounded-lg overflow-hidden">
       
        <figure className="w-full md:w-1/2">
          <img
            src={img.image}
            alt={img.info}
            className="w-full object-cover h-64 md:h-96"
          />
        </figure>

        
        <div className="p-6 md:w-1/2 text-center md:text-left">
          <h2 className="text-lg md:text-xl font-semibold mb-4">{img.title}</h2>
          <p className="mb-6 text-sm md:text-base">{img.info}</p>
          <div className="flex justify-center md:justify-start">
            <button className="btn btn-warning btn-sm md:btn-md ">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideImages;
