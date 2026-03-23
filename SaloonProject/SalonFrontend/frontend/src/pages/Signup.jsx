
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showSuccessMessage = () => {
    Swal.fire({
      title: 'Account Created Successfully!',
      html: `
        <div class="text-center">
          <div class="text-green-400 text-6xl mb-4">
            <FiCheckCircle class="inline-block" />
          </div>
          <p class="text-gray-200 mb-2">Welcome to our salon community, <strong>${formData.name}</strong>!</p>
          <p class="text-gray-300">Your account has been successfully created.</p>
          <p class="text-gray-300 mt-2">You can now book appointments and enjoy our services.</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#6366f1',
      background: '#1e1b4b',
      color: '#ffffff',
      showConfirmButton: true,
      confirmButtonText: 'Continue to Login',
      customClass: {
        popup: 'border-2 border-indigo-500 rounded-xl',
        icon: 'hidden'
      },
      willClose: () => {
        const encodedEmail = encodeURIComponent(formData.email);
        const encodedPhone = encodeURIComponent(formData.phone);
        navigate(`/send-otp/${encodedEmail}/${encodedPhone}`);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        title: 'Password Mismatch',
        text: 'The passwords you entered do not match.',
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#ffffff',
      });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await signup(formData);
      if (success) {
        showSuccessMessage();
        
      } else {
        await Swal.fire({
          title: 'Signup Failed',
          text: 'Unable to create account. Please try again.',
          icon: 'error',
          confirmButtonColor: '#6366f1',
          background: '#1e1b4b',
          color: '#ffffff',
        });
      }
    } catch (err) {
      await Swal.fire({
        title: 'Error',
        text: err.message || 'An error occurred during signup',
        icon: 'error',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#ffffff',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-indigo-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Join Us
          </h2>
          <p className="text-indigo-200">
            Create your account to get started
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-indigo-300" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-indigo-900/30 border border-indigo-700 text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-indigo-300" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-indigo-900/30 border border-indigo-700 text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="text-indigo-300" />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="bg-indigo-900/30 border border-indigo-700 text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-indigo-300" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-indigo-900/30 border border-indigo-700 text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-indigo-300" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-indigo-900/30 border border-indigo-700 text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-blue-500/20"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-indigo-300">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-white hover:text-blue-300 transition"
          >
            <FiArrowLeft className="mr-1" /> Back to login
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-indigo-800 text-center">
          <button
            onClick={() => navigate('/admin-login')}
            className="text-indigo-300 hover:text-white text-sm"
          >
            Are you an admin? Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;