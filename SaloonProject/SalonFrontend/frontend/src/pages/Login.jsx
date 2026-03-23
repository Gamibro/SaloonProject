import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserLoginForm from '../auth/UserLoginForm';
import AdminLoginForm from '../auth/AdminLoginForm';
import UserSignupForm from '../auth/UserSignupForm';
// import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';
// import { FiCheckCircle } from 'react-icons/fi';


const LoginPage = () => {
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(()=>{
    const params = new URLSearchParams(location.search);
    return params.get('mode') === 'signup' || params.get('signup') === '1';
  });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  // const { login } = useAuth();
  const navigate = useNavigate();

  const showLoginSuccess = (isAdmin) => {
    Swal.fire({
      title: 'Login Successful!',
      html: `
        <div class="text-center">
          <div class="text-green-400 text-6xl mb-4">
            <FiCheckCircle class="inline-block" />
          </div>
          <p class="text-gray-200 mb-2">Welcome back!</p>
          <p class="text-gray-300">You're now being redirected to your ${isAdmin ? 'admin dashboard' : 'account'}.</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#6366f1',
      background: '#1e1b4b',
      color: '#ffffff',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        popup: 'border-2 border-indigo-500 rounded-xl',
        icon: 'hidden'
      }
    });
  };

  const showSignupSuccess = (formData) => {
    Swal.fire({
      title: 'Account Created!',
      html: `
        <div class="text-center">
          <div class="text-green-400 text-6xl mb-4">
            <FiCheckCircle class="inline-block" />
          </div>
          <p class="text-gray-200 mb-2">Welcome to our salon!</p>
          <p class="text-gray-300">Your account has been successfully created.</p>
          <p class="text-gray-300 mt-2">You can now login with your Phone number.</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#6366f1',
      background: '#1e1b4b',
      color: '#ffffff',
      confirmButtonText: 'Verify Phone',
      customClass: {
        popup: 'border-2 border-indigo-500 rounded-xl',
        icon: 'hidden'
      }
    }).then(() => {
      navigate('/login', { state: { phone: formData.phone } });
      setIsSignup(false);
    });
  };

  // const handleLogin = async (email, password, isAdmin) => {
  //   try {
  //     const success = await login(email, password, isAdmin);
  //     if (success) {
  //       showLoginSuccess(isAdmin);
  //       setTimeout(() => {
  //         navigate(isAdmin ? '/admin' : '/');
  //       }, 2000);
  //     }
  //     return success;
  //   } catch (error) {
  //     Swal.fire({
  //       title: 'Login Failed',
  //       text: error.message || 'Invalid email or password',
  //       icon: 'error',
  //       confirmButtonColor: '#6366f1',
  //       background: '#1e1b4b',
  //       color: '#ffffff',
  //     });
  //     return false;
  //   }
  // };

  const handleSignup = async (formData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call your signup API here
      // const response = await signupApi(formData);
      
      showSignupSuccess(formData);
      return true;
    } catch (error) {
      Swal.fire({
        title: 'Signup Failed',
        text: error.message || 'Failed to create account',
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#ffffff',
      });
      return false;
    }
  };

  // if (isAdminLogin) {
  //   return (
  //     <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
  //       <AdminLoginForm 
  //         onLogin={(email, password) => handleLogin(email, password, true)}
  //         onSwitchToUser={() => setIsAdminLogin(false)}
  //       />
  //     </div>
  //   );
  // }
  if (isAdminLogin) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <AdminLoginForm
        onLoginSuccess={() => {
          showLoginSuccess(true);
          setTimeout(() => {
            navigate('/admin');           // or '/admin/dashboard' if you prefer one place
          }, 2000);
        }}
        onSwitchToUser={() => setIsAdminLogin(false)}
      />
    </div>
  );
}

  if (isSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex items-center justify-center p-4">
        <UserSignupForm 
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsSignup(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-pink-950 flex items-center justify-center p-4">
      <UserLoginForm 
        onSwitchToSignup={() => setIsSignup(true)}
        onSwitchToAdmin={() => setIsAdminLogin(true)}
      />
    </div>
  );
};

export default LoginPage;