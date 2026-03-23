// import { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const login = (email, password, isAdminLogin = false) => {
//     // In a real app, this would call your authentication API
//     if ((email === 'user@example.com' && password === 'user123') || 
//         (email === 'admin@example.com' && password === 'admin123')) {
      
//       const userData = {
//         email,
//         name: isAdminLogin ? 'Admin User' : 'Regular User',
//         token: 'fake-jwt-token'
//       };
      
//       setUser(userData);
//       setIsAdmin(isAdminLogin);
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     setIsAdmin(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount (for persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAdmin(storedIsAdmin === 'true');
    }
    setLoading(false);
  }, []);

   // NEW: single place to set session + localStorage
  const setSession = (userData, token, isAdminFlag = false) => {
    setUser(userData);
    setIsAdmin(isAdminFlag);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', isAdminFlag ? 'true' : 'false');
    localStorage.setItem('token', token);
  };


  // const login = async (email, password, isAdminLogin = false) => {
  //   try {
  //     const url = isAdminLogin
  //       ? 'https://localhost:7014/api/AdminAuth/login'
  //       : 'https://localhost:7014/api/Auth/login'; // Adjust user login endpoint
 
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Invalid email or password');
  //     }

  //     const data = await response.json();

  //     // You should get token and user info from the response, adjust accordingly
  //     const userData = {
  //       email,
  //       name: isAdminLogin ? 'Admin User' : 'Regular User',
  //     };

  //     setUser(userData);
  //     setIsAdmin(isAdminLogin);

  //     // Save to localStorage
  //     localStorage.setItem('user', JSON.stringify(userData));
  //     localStorage.setItem('isAdmin', isAdminLogin ? 'true' : 'false');
  //     localStorage.setItem('token', data.token);

  //     return true;
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     return false;
  //   }
  // };

  // --- NEW: Admin OTP flow — send code to phone
  const sendAdminOtp = async (phone) => {
    // const res = await fetch('https://localhost:7014/api/AdminAuth/otp/check', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone }),
    // });
    // https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/otp/check
    // https://localhost:7014/api/AdminAuth/otp/check
     const res = await fetch('https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/otp/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) throw new Error((await res.text()) || 'Failed to send admin OTP');
    return true;
  };

  // --- NEW: Admin OTP flow — verify code and set admin session
  // Backend expected to return { token, user? }. We only require token.
  const verifyAdminOtp = async (phone, code, nameForSession = 'Admin User') => {
    // const res = await fetch('https://localhost:7014/api/AdminAuth/otp/verify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, code }),
    // });
    // https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/otp/verify
    // https://localhost:7014/api/AdminAuth/otp/verify
    const res = await fetch('https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) throw new Error((await res.text()) || 'Admin OTP verification failed');

    const data = await res.json();
    const token = data.token;
    if (!token) throw new Error('No token returned from admin verify');

    const userData = { name: nameForSession, phone };
    // isAdmin = true for admins
    setSession(userData, token, true);
    return true;
  };

  // NEW: user OTP flow — send code to phone
  // https://localhost:7014/api/Auth/otp/check
  // https://nvsalonbackend.dockyardsoftware.com/api/Auth/otp/check
  const sendUserOtp = async (phone) => {
    const res = await fetch('https://nvsalonbackend.dockyardsoftware.com/api/Auth/otp/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // backend will ignore missing email; you can drop it entirely
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) throw new Error((await res.text()) || 'Failed to send OTP');
    return true;
  };

  // NEW: user OTP flow — verify code and set session
  // Expect your backend to return { token, user? }
  // https://nvsalonbackend.dockyardsoftware.com/api/Auth/otp/verify
  // https://localhost:7014/api/Auth/otp/verify
  const verifyUserOtp = async (phone, code) => {
    const res = await fetch('https://nvsalonbackend.dockyardsoftware.com/api/Auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) throw new Error((await res.text()) || 'OTP verification failed');

    const data = await res.json();
    const token = data.token;
    const userData =
    { phone, name: 'Regular User' }; 

    if (!token) throw new Error('No token returned from verify');

    // isAdmin = false for normal users
    setSession(userData, token, false);
    return true;
  };

  const signup = async (formData) => {
    // Implement real signup API call here if you want
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signup, sendAdminOtp,verifyAdminOtp, logout, loading,sendUserOtp,verifyUserOtp}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
