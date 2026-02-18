
import { useCallback } from "react";

const useAuth = () => {
  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken");
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!getAuthToken();
  }, [getAuthToken]);

  const login = useCallback((token) => {
    if (!token) return;
    localStorage.setItem("authToken", token);
  }, []);

  const logout = useCallback(() => {
    // localStorage.removeItem("authToken");
  }, []);

  // Provide a callable function but also attach named properties so both
  // `const isAuthenticated = useAuth()` and `const { isAuthenticated, token } = useAuth()` work.
  const authFn = isAuthenticated;
  authFn.isAuthenticated = isAuthenticated;
  authFn.getAuthToken = getAuthToken;
  authFn.login = login;
  authFn.logout = logout;
  authFn.token = getAuthToken();
  authFn.isLoggedIn = isAuthenticated;

  return authFn;
};

export default useAuth;