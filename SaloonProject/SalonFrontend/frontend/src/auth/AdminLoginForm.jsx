import { useEffect, useState } from "react";
import {
  FiShield,
  FiArrowLeft,
  FiAlertTriangle,
  FiPhone,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // Adjust path as needed

const AdminLoginForm = ({ onLoginSuccess, onSwitchToUser }) => {
  const { sendAdminOtp, verifyAdminOtp } = useAuth();
  const navigate = useNavigate();

  // const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // 'phone' | 'otp'
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const RESEND_SECONDS = 30;

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => (s > 1 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const effectivePhone = phone.replace(/\D/g, "").slice(0, 10);
  const validPhone = /^\d{10}$/.test(effectivePhone);
  const canSend = validPhone && timeLeft === 0;

  const handleSendOtp = async () => {
    try {
      setError("");
      // if (!name.trim()) return setError("Enter your username");
      if (!validPhone) return setError("Enter a valid 10-digit phone number");
      setSending(true);
      await sendAdminOtp(effectivePhone);
      setStep("otp");
      setTimeLeft(RESEND_SECONDS);
    } catch (e) {
      setError(e.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    try {
      setError("");
      if (otp.length !== 6) return setError("Please enter the 6-digit code");
      setVerifying(true);
      await verifyAdminOtp(effectivePhone, otp);
      if (onLoginSuccess) onLoginSuccess(); // let parent show the toast
      navigate("/admin/dashboard"); // then land on dashboard
    } catch (e) {
      setError(e.message || "OTP verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border border-gray-700 mb-4">
          <FiShield className="text-2xl text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">Admin Portal</h2>
        <p className="text-gray-400">Restricted access to salon management</p>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700 flex items-start">
          <FiAlertTriangle className="flex-shrink-0 mr-2 mt-0.5" />
          {error}
        </div>
      )}

      {/* Step 1: Name + Phone */}
      <div className="space-y-4">
        {/* <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Admin Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div> */}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiPhone className="text-gray-500" />
          </div>
          <input
            type="tel"
            placeholder="Admin Phone (10 digits)"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          disabled={!canSend || sending}
          onClick={handleSendOtp}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-purple-500/20 disabled:opacity-60"
        >
          {sending ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FiSend className="mr-2" />
          )}
          {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Send OTP"}
        </button>
      </div>

      {/* Step 2: OTP expand inline */}
      {step === "otp" && (
        <div className="mt-6">
          <p className="text-center text-gray-300 mb-3">
            Enter the 6-digit code sent to your phone
          </p>
          <div className="flex justify-center mb-6">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              isInputNum
              shouldAutoFocus
              renderInput={(props) => (
                <input
                  {...props}
                  type="tel"
                  inputMode="numeric"
                  className="w-15 h-7 mx-2 text-center text-black text-2xl  bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
            />
          </div>

          <button
            type="button"
            disabled={verifying || otp.length !== 6}
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg disabled:opacity-60"
          >
            {verifying ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FiCheck className="mr-2" />
            )}
            Verify & Sign In
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-800 text-center">
        <button
          onClick={onSwitchToUser}
          className="inline-flex items-center text-gray-400 hover:text-purple-400 transition"
        >
          <FiArrowLeft className="mr-1" /> Back to user login
        </button>
      </div>
    </div>
  );
};
// const { login } = useAuth();  // get login function from context
// const navigate = useNavigate();

// const [email, setEmail] = useState('');
// const [password, setPassword] = useState('');
// const [error, setError] = useState('');
// const [isLoading, setIsLoading] = useState(false);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!email || !password) {
//     setError('Please fill in all fields');
//     return;
//   }

//   setIsLoading(true);
//   setError('');

//   try {
//     // Use the login function from AuthContext, passing isAdminLogin=true
//     const success = await login(email, password, true);
//     console.log(success)

//     if (success) {
//       if (onLoginSuccess) onLoginSuccess();
//       navigate('/admin/dashboard');
//     } else {
//       setError('Invalid email or password');
//     }
//   } catch (err) {
//     setError(err.message || 'Login failed. Try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };

// return (
//   <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
//     <div className="text-center mb-8">
//       <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full border border-gray-700 mb-4">
//         <FiShield className="text-2xl text-purple-500" />
//       </div>
//       <h2 className="text-3xl font-bold mb-2 text-white">Admin Portal</h2>
//       <p className="text-gray-400">Restricted access to salon management</p>
//     </div>

//     {error && (
//       <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700 flex items-start">
//         <FiAlertTriangle className="flex-shrink-0 mr-2 mt-0.5" />
//         {error}
//       </div>
//     )}

//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <FiShield className="text-gray-500" />
//         </div>
//         <input
//           type="email"
//           placeholder="Admin Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <FiKey className="text-gray-500" />
//         </div>
//         <input
//           type="password"
//           placeholder="Admin Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-purple-500/20"
//       >
//         {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FiLogIn className="mr-2" />}
//         Admin Sign In
//       </button>
//     </form>

//     <div className="mt-6 pt-6 border-t border-gray-800 text-center">
//       <button
//         onClick={onSwitchToUser}
//         className="inline-flex items-center text-gray-400 hover:text-purple-400 transition"
//       >
//         <FiArrowLeft className="mr-1" /> Back to user login
//       </button>
//     </div>
//   </div>
// );

export default AdminLoginForm;
