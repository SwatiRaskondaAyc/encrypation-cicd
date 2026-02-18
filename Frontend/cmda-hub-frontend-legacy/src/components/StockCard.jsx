import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import stockData from '../../public/list.json';
import Cards from './Cards';

const StockCard = () => {

  // const filterData = stockData.filter((data) => data.category === "⤵" );

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    dots: true,
    centerPadding: "60px",
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <h1 className="font-bold text-xl pb-2">Stocks</h1>
      <div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem expedita
          aliquid debitis fugiat, a omnis sapiente nisi ad nulla, labore cupiditate
          nemo consectetur voluptatibus ut temporibus adipisci vitae eius cumque?
        </p>
        <br />
        <Slider {...settings}>
          {stockData.map((stock) => (
            <Cards stock={stock} key={stock.id} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default StockCard;
