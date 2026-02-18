// --------------------before code 23/7-------------

import jwtDecode from "jwt-decode";

const JwtUtil = {
  extractEmail: (token) => {
    if (!token) {
      console.error("No token provided for decoding.");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      // console.log("Decoded token:", decoded); // Debugging
      return decoded.email || decoded.sub || null; // Adjust based on your token payload
    } catch (error) {
      console.error("Error decoding token:", error.message);
      return null;
    }
  },

  isTokenExpired: (token) => {
    if (!token) {
      console.error("No token provided for expiration check.");
      return true;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        console.warn("Token has no expiration claim.");
        return false; // If no expiration claim, assume it's valid (depends on your setup)
      }
      // return decoded.exp * 10000 < Date.now(); // Convert exp (in seconds) to ms
      return decoded.exp * 1000 < Date.now(); // Convert exp (seconds) to milliseconds
    } catch (error) {
      console.error("Error checking token expiration:", error.message);
      return true;
    }
  }
};

export default JwtUtil;

// import jwtDecode from 'jwt-decode';

// class JwtUtil {
//   static extractEmail(token) {
//     if (!token) {
//       console.error("No token provided for decoding.");
//       return null;
//     }
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.email || decoded.sub || null; // Adjust based on token payload
//     } catch (error) {
//       console.error("Error decoding token:", error.message);
//       return null;
//     }
//   }

//   static isTokenExpired(token) {
//     if (!token) {
//       console.error("No token provided for expiration check.");
//       return true;
//     }
//     try {
//       const decoded = jwtDecode(token);
//       if (!decoded.exp) {
//         console.warn("Token has no expiration claim.");
//         return false; // If no expiration claim, assume valid
//       }
//       return decoded.exp * 1000 < Date.now(); // Convert exp (seconds) to ms
//     } catch (error) {
//       console.error("Error checking token expiration:", error.message);
//       return true;
//     }
//   }
// }

// export default JwtUtil;


