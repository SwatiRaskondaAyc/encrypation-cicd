// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Images from "../../../public/image.json";
// import SlideImages from "./SlideImages";

// const EquitySlider = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     autoplay: true,
//     speed: 1000,
//     autoplaySpeed: 5000,
//     cssEase: "linear",
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false, // Hide arrows for better mobile experience
//     responsive: [
//       {
//         breakpoint: 1024, // Tablets
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 768, // Mobile landscape
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 480, // Mobile portrait
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: true,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="max-w-screen-xl container mx-auto md:px-20 px-4 py-8 dark:bg-slate-900 dark:text-white">
//       <div className="md:my-12 my-8">
//         <Slider className="m-4" {...settings}>
//           {Images.map((img) => (
//             <SlideImages img={img} key={img.id} />
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default EquitySlider;
