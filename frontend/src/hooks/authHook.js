import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userLogin, setUserLogin] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken, login) => {
    setToken(jwtToken);
    setUserLogin(login);

    localStorage.setItem(storageName, JSON.stringify({
      userLogin: login,
      token: jwtToken
    }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserLogin(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userLogin);
    };

    setReady(true);

  }, [login]);

  return { login, logout, token, userLogin, ready };
}