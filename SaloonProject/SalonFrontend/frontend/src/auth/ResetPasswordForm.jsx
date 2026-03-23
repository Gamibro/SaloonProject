import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email: prefillEmail, resetToken: prefillToken } = location.state || {};

  const [email, setEmail] = useState(prefillEmail || "");
  const [resetToken, setResetToken] = useState(prefillToken || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
    if (prefillToken) setResetToken(prefillToken);
  }, [prefillEmail, prefillToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post("https://nvsalonbackend.dockyardsoftware.com/api/Auth/reset-password", {
        email,
        resetToken,
        newPassword,
      });
      setMessage("Password reset successful! Redirecting to login...");
      
      // Redirect to login after a short delay (e.g., 2 seconds)
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Failed to reset password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700 mt-10"
    >
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-600 text-white"
      />
      <input
        type="text"
        placeholder="Reset Token"
        value={resetToken}
        onChange={(e) => setResetToken(e.target.value)}
        required
        className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-600 text-white"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-gray-600 text-white"
      />
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
      >
        Reset Password
      </button>

      {message && <p className="mt-4 text-green-400">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </form>
  );
};

export default ResetPasswordForm;
