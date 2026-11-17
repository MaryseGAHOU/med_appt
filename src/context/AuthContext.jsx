import { createContext, useContext, useState } from 'react';
import { getSession, logout as apiLogout } from '../services/api.js';

const AuthContext = createContext(null);

/**
 * Keeps the signed-in user available across the app (Navbar, prefilled forms, ProfileCard…).
 * The session itself is persisted by the data layer (services/db.js).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  const handleLogin = (nextUser) => setUser(nextUser);

  const handleLogout = () => {
    apiLogout();
    setUser(null);
  };

  const handleUpdate = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, update: handleUpdate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
