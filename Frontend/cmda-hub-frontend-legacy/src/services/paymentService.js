import axios from 'axios';
const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`; // Correct way in Vite

const API_BASE_URL = `${API_BASE}/api/payment`;
// Start payment
export const startPayment = async (paymentRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/start`, paymentRequest);
    return response.data; // Returns the order details from the server
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error; // Rethrow the error for proper handling in the component
  }
};

// Verify payment
export const verifyPayment = async (verificationRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, verificationRequest);
    return response.data; // Returns the verification status
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw error; // Rethrow the error for proper handling in the component
  }
};
