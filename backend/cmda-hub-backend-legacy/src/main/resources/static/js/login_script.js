document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll(".input-group input");
    
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (input.value) {
                input.nextElementSibling.classList.add("filled");
            } else {
                input.nextElementSibling.classList.remove("filled");
            }
        });
    });
});


//---------------------------Google authentication ---------------------------------
// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIF7PR3_qi8LFjcJK6cBGcs9DYpx_E_5k",
    authDomain: "login-b8a91.firebaseapp.com",
    projectId: "login-b8a91",
    storageBucket: "login-b8a91.appspot.com",
    messagingSenderId: "213642792785",
    appId: "1:213642792785:web:65e567c32699dded438d70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
    const googleLogin = document.getElementById("google-login");

    if (googleLogin) {
        googleLogin.addEventListener("click", function() {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;

                    // Store user details in localStorage for use on index.html
                    localStorage.setItem('userName', user.displayName);
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('userProfilePicture', user.photoURL);

                    // Redirect to index.html
                    window.location.href = "/";
                }).catch((error) => {
                    console.error("Error during sign-in: ", error);
                });
        });
    }
});



