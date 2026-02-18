import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PromoCodeStep = () => {
  const query = useQuery();
  const email = query.get('email');
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_BASE = window.location.hostname.startsWith('www.')
    ? import.meta.env.WWW_VITE_URL || 'https://www.cmdahub.com/api'
    : import.meta.env.VITE_URL || 'https://cmdahub.com/api';

  const handleApply = async () => {
    const token = sessionStorage.getItem('tempToken');
    if (!token) {
      toast.error('Missing temporary token. Please try signing up again.');
      navigate('/'); return;
    }
    if (!promoCode) {
      toast.error('Please enter a promo code or skip.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/auth/google/apply-promo`,
        { email, promoCode },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      toast.success(res.data.message || 'Promo applied successfully!');
      // Complete login using the token
      login(token);
      // Save user metadata if needed, e.g. from session
      localStorage.setItem('userType', 'individual');
      const name = sessionStorage.getItem('tempName') || '';
      const picture = sessionStorage.getItem('tempPicture') || '';
      localStorage.setItem('userName', name);
      localStorage.setItem('profilePicture', picture);
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('authChange'));
      sessionStorage.removeItem('tempToken');
      sessionStorage.removeItem('tempName');
      sessionStorage.removeItem('tempPicture');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data || 'Invalid or expired promo code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const token = sessionStorage.getItem('tempToken');
    if (!token) {
      toast.error('Missing temporary token. Please try signing up again.');
      navigate('/'); return;
    }
    // finalize login
    login(token);
    const name = sessionStorage.getItem('tempName') || '';
    const picture = sessionStorage.getItem('tempPicture') || '';
    localStorage.setItem('userType', 'individual');
    localStorage.setItem('userName', name);
    localStorage.setItem('profilePicture', picture);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('authChange'));
    sessionStorage.removeItem('tempToken');
    sessionStorage.removeItem('tempName');
    sessionStorage.removeItem('tempPicture');
    toast.success('Signed up successfully!');
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Welcome{email ? `, ${email}` : ''}!</h2>
      <p className="mb-4">If you have a promo code, enter it below (optional).</p>
      <input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        placeholder="Enter promo code"
        className="w-full p-2 border rounded mb-3"
      />
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >Apply</button>
        <button
          onClick={handleSkip}
          disabled={loading}
          className="px-4 py-2 border rounded"
        >Skip</button>
      </div>
    </div>
  );
};

export default PromoCodeStep;
