import { useState } from 'react';
import { FiKey, FiShield, FiLogIn, FiArrowLeft, FiAlertTriangle, FiUserPlus } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const AdminLoginForm = ({ onLogin, onSwitchToUser, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    const success = await onLogin(email, password, true);
    if (!success) {
      setError('Invalid admin credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border border-gray-700 mb-4">
          <FiShield className="text-2xl text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">
          Admin Portal
        </h2>
        <p className="text-gray-400">
          Restricted access to salon management
        </p>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700 flex items-start">
          <FiAlertTriangle className="flex-shrink-0 mr-2 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiShield className="text-gray-500" />
          </div>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiKey className="text-gray-500" />
          </div>
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-purple-500/20"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FiLogIn className="mr-2" />
          )}
          Admin Sign In
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-800 text-center">
        <button
          onClick={onSwitchToSignup}
          className="inline-flex items-center text-gray-400 hover:text-purple-400 transition mb-3"
        >
          <FiUserPlus className="mr-1" /> Register new admin
        </button>
        <button
          onClick={onSwitchToUser}
          className="block w-full text-sm text-gray-400 hover:text-purple-400 transition"
        >
          <FiArrowLeft className="inline mr-1" /> Back to user login
        </button>
      </div>
    </div>
  );
};

export default AdminLoginForm;