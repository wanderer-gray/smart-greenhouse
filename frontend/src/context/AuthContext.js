import { createContext } from 'react';

function noop() { };

export const AuthContext = createContext({
  token: null,
  userLogin: null,
  login: noop,
  logout: noop,
  isAuthenticated: false
});