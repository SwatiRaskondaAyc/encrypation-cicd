// pages/OAuth2RedirectHandler.jsx
// import { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import React from 'react'

// const OAuth2RedirectHandler = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // useEffect(() => {
//   //   const token = searchParams.get("token");;
//   //   if (token) {
        
//   //       localStorage.setItem('authToken', token); // Store token in localStorage
//   //       alert('Login successful');
//   //       navigate('/home');
//   //   } else {
//   //     alert('Google login failed!');
//   //     navigate('/');
//   //   }
//   // }, []);

//   useEffect(() => {
//   const token = searchParams.get("token");

//   if (token) {
//     console.log("Token received in URL:", token);
//     localStorage.setItem("authToken", token);
//     alert("Login successful");
//     navigate("/home");
//   } else {
//     console.error("No token found in redirect URL.");
//     alert("Login failed. No token received.");
//     navigate("/");
//   }
// }, []);


//   return <div>Redirecting...</div>;
// };
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem('authToken', token);
      alert('Login successful');
      navigate('/home');
    } else {
      alert('Google login failed!');
      navigate('/');
    }
  }, [searchParams, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;