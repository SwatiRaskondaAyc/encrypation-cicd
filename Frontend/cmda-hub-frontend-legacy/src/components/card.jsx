// import React from "react";
// import "./SolarSystem.css"; // CSS file for styling



// const Card = ({ stocks }) => {
//     const stocks = [
//         { name: "Stock A", price: "$100", category: "Tech", image: "image-url-1" },
//         { name: "Stock B", price: "$200", category: "Finance", image: "image-url-2" },
//         { name: "Stock C", price: "$150", category: "Health", image: "image-url-3" },
//       ];
      
//       <Card stocks={stocks} />;
//   return (
//     <div className="solar-system">
//       {/* The Sun */}
//       <div className="sun">Sun</div>

//       {/* The Orbiting Planets */}
//       {stocks.map((stock, index) => (
//         <div
//           key={index}
//           className="planet"
//           style={{
//             "--i": index, // Used in CSS for spacing
//           }}
//         >
//           <div className="card">
//             <img
//               src={stock.image}
//               alt={stock.name}
//               className="card-image"
//             />
//             <div className="card-info">
//               <h3>{stock.name}</h3>
//               <p>Price: {stock.price}</p>
//               <p>Category: {stock.category}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Card;
