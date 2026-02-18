// In your App.jsx or a dedicated Route wrapper
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RedirectUppercase() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const path = location.pathname;
    const lowercasePath = path.toLowerCase();
    if (path !== lowercasePath) {
      navigate(lowercasePath + location.search, { replace: true });
    }
  }, [location, navigate]);
  
  return null;
}


export default RedirectUppercase;