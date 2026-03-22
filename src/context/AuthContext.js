import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchTeacherMe, login } from '../services/mockTeacherApi';

const TOKEN_KEY = '@teacher_app/token';
const USER_KEY = '@teacher_app/user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (!active) return;

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else if (storedToken) {
          // If token exists but user doesn't, re-fetch.
          const me = await fetchTeacherMe();
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(me));
          setUser(me);
        }
      } catch {
        // Ignore errors and force login (multiRemove may not exist in all versions)
        await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
      } finally {
        if (active) setBooting(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => {
    async function doLogin({ username, password }) {
      const res = await login({ username, password });
      setToken(res.token);
      setUser(res.teacher);
      await AsyncStorage.setItem(TOKEN_KEY, res.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.teacher));
      return res.teacher;
    }

    async function doLogout() {
      setToken(null);
      setUser(null);
      await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
    }

    return {
      booting,
      token,
      user,
      login: doLogin,
      logout: doLogout,
    };
  }, [booting, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

