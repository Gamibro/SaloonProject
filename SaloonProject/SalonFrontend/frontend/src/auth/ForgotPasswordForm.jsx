import { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetToken('');
    setLoading(true);

    try {
      const response = await axios.post('https://nvsalonbackend.dockyardsoftware.com/api/Auth/forget-password', {
        email,
      });

      setMessage('Reset token generated (email sending disabled)');
      setResetToken(response.data.resetToken);  // Show token in UI
    } catch (err) {
      setError(err.response?.data || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700 mt-10">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {message && <p className="text-green-400 mb-4">{message}</p>}

      {resetToken && (
        <>
          <div className="bg-gray-800 p-3 mb-4 rounded text-yellow-400 break-all">
            <strong>Your reset token:</strong> {resetToken}
          </div>
          <button
            onClick={() => navigate('/reset-password', { state: { email, resetToken } })}
            className="mb-4 text-blue-400 underline"
          >
            Go to Reset Password
          </button>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-600 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Send Reset Link'}
        </button>
      </form>

      <button
        onClick={() => navigate('/')}
        className="mt-4 text-purple-300 hover:text-white text-sm underline"
      >
        Back to login
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
