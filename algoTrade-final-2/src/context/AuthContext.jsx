import { createContext, useContext, useEffect, useState } from 'react';
import { signupUser, loginUser, logoutUser, getSession, createWallet, payViaUpi, buyCoin, sellCoin, swapCoin } from '../api/backend';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setInitializing(false);
  }, []);

  async function signup(details) {
    const newUser = await signupUser(details);
    setUser(newUser);
    return newUser;
  }

  async function login(credentials) {
    const loggedInUser = await loginUser(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  async function createUserWallet() {
    if (!user) throw new Error('You must be logged in.');
    const updated = await createWallet(user.email);
    setUser(updated);
    return updated;
  }

  async function payWithUpi(upiId, amount) {
    if (!user) throw new Error('You must be logged in.');
    const updated = await payViaUpi(user.email, upiId, amount);
    setUser(updated);
    return updated;
  }

  async function buyCrypto(coinId, amount, costInInr) {
    if (!user) throw new Error('You must be logged in.');
    const updated = await buyCoin(user.email, coinId, amount, costInInr);
    setUser(updated);
    return updated;
  }

  async function sellCrypto(coinId, amount, creditInr) {
    if (!user) throw new Error('You must be logged in.');
    const updated = await sellCoin(user.email, coinId, amount, creditInr);
    setUser(updated);
    return updated;
  }

  async function swapAsset(fromCoinId, toCoinId, fromAmount, toAmount) {
    if (!user) throw new Error('You must be logged in.');
    const updated = await swapCoin(user.email, fromCoinId, toCoinId, fromAmount, toAmount);
    setUser(updated);
    return updated;
  }

  const value = {
    user,
    isAuthenticated: !!user,
    initializing,
    signup,
    login,
    logout,
    createUserWallet,
    payWithUpi,
    buyCrypto,
    sellCrypto,
    swapAsset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
