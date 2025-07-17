import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // <-- nuevo

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false); // <-- importante
  }, []);

  const login = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      setUser(decoded);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("role", decoded.role);
      if (decoded.id) localStorage.setItem("userId", decoded.id);
      if (decoded.uniqueNumber) localStorage.setItem("uniqueNumber", decoded.uniqueNumber);
      if (decoded.role === "brand") localStorage.setItem("brandId", decoded.id);
    } catch {
      setUser(null);
      setToken(null);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}