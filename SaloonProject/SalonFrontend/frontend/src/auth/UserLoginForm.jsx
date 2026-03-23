// import { useState } from 'react';
// import { FiUser, FiLock, FiLogIn, FiArrowRight } from 'react-icons/fi';
// import { FaSpinner } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../auth/AuthContext';  // Import your auth hook

// const UserLoginForm = ({ onSwitchToSignup, onSwitchToAdmin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const { login } = useAuth();  
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     // Use context login function here, isAdminLogin false for user login
//     const success = await login(email.trim(), password, false);

//     if (!success) {
//       setError('Invalid email or password');
//     } else {
//       navigate('/book-now');
//     }

//     setIsLoading(false);
//   };



//   return (
//     <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
//           Welcome Back
//         </h2>
//         <p className="text-purple-200">Sign in to book your next appointment</p>
//       </div>

//       {error && (
//         <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiUser className="text-purple-300" />
//           </div>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="bg-purple-900/30 border border-purple-700 text-white placeholder-purple-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//           />
//         </div>

//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiLock className="text-purple-300" />
//           </div>
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="bg-purple-900/30 border border-blue-700 text-white placeholder-purple-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
//           />
//         </div>

//         <div className="flex justify-between items-center">
//           <label className="flex items-center text-purple-200 text-sm">
//             <input
//               type="checkbox"
//               className="rounded bg-purple-900/30 border-blue-700 text-pink-500 focus:ring-pink-500 mr-2"
//             />
//             Remember me
//           </label>
//           {/* <a href="#" className="text-purple-300 hover:text-white text-sm">
//             Forgot password?
//           </a> */}
//           <button
//             onClick={() => navigate('/forgot-password')}
//             className="text-purple-300 hover:text-white text-sm"
//             type="button"
//           >
//             Forgot password?
//           </button>

//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-gradient-to-r from-purple-800 to-blue-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-pink-500/20"
//         >
//           {isLoading ? (
//             <FaSpinner className="animate-spin mr-2" />
//           ) : (
//             <FiLogIn className="mr-2" />
//           )}
//           Sign In
//         </button>
//       </form>

//       <div className="mt-6 text-center text-purple-300">
//         <p className="mb-3">Don't have an account?</p>
//         <button
//           onClick={onSwitchToSignup}
//           className="inline-flex items-center text-white hover:text-pink-300 transition"
//         >
//           Create account <FiArrowRight className="ml-1" />
//         </button>
//       </div>

//       <div className="mt-6 pt-6 border-t border-purple-800 text-center">
//         <button
//           onClick={onSwitchToAdmin}
//           className="text-purple-300 hover:text-white text-sm"
//         >
//           Are you an admin? Sign in here
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserLoginForm;
import { useState,useEffect } from 'react';
import { FiPhone, FiSend, FiCheck, FiArrowRight } from 'react-icons/fi';
import { FaBackward, FaSpinner } from 'react-icons/fa';
import OTPInput from 'react-otp-input';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const UserLoginForm = ({ onSwitchToSignup, onSwitchToAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendUserOtp, verifyUserOtp } = useAuth();

  // ✅ Only use the prefilled number as a placeholder, not as the input value
  const placeholderPhone = location?.state?.phone || '';

  // ✅ Start with an empty input value
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // ✅ never auto-jump to OTP step
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const RESEND_SECONDS = 30;

  // ✅ No auto-send useEffect here. We removed it.

  // Use the typed value if present; otherwise fall back to the placeholder
  const effectivePhone = (phone || placeholderPhone).replace(/\D/g, '').slice(0, 10);
  const validPhone = /^\d{10}$/.test(effectivePhone);
  const canSend = validPhone && timeLeft === 0;

  // Timer only starts after user clicks Send OTP
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => (s > 1 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    try {
      setError('');
      if (!validPhone) {
        setError('Enter a valid 10-digit phone number');
        return;
      }
      setSending(true);
      await sendUserOtp(effectivePhone);
      // Lock the input to the number we used (optional but helpful)
      if (!phone && placeholderPhone) setPhone(effectivePhone);
      setStep('otp');
      setTimeLeft(RESEND_SECONDS);
    } catch (e) {
      setError(e.message || 'Failed to send OTP');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    try {
      setError('');
      if (otp.length !== 6) {
        setError('Please enter the 6-digit code');
        return;
      }
      setVerifying(true);
      await verifyUserOtp(effectivePhone, otp);
      navigate('/book-now');
    } catch (e) {
      setError(e.message || 'OTP verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
          Welcome Back
        </h2>
        <p className="text-purple-200">Sign in with your phone</p>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Phone */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiPhone className="text-purple-300" />
          </div>
          <input
            type="tel"
            placeholder={placeholderPhone ? placeholderPhone : 'Phone (10 digits)'}
            value={phone}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhone(v);
            }}
            className="bg-purple-900/30 border border-purple-700 text-white placeholder-purple-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          disabled={!canSend || sending}
          onClick={handleSendOtp}
          className="w-full bg-gradient-to-r from-purple-800 to-blue-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-pink-500/20 disabled:opacity-60"
        >
          {sending ? <FaSpinner className="animate-spin mr-2" /> : <FiSend className="mr-2" />}
          {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Send OTP'}
        </button>

        <button type="button"
        onClick={()=>{navigate("/")}}
        className='w-full bg-gradient-to-l text-white items-center from-blue-800 to-purple-600 hover:from-blue-500 hover:to-purple-700 py-2 rounded-lg font-medium transition flex-items justify-center'>
          Back to Home Page
        </button>
      </div>

      {/* Step 2: OTP */}
      {step === 'otp' && (
        <div className="mt-6">
          <p className="text-center text-purple-200 mb-3">Enter the 6-digit code we sent</p>
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
                  className="w-19 h-8 mx-2  text-center text-black text-2xl bg-blue-50 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            {verifying ? <FaSpinner className="animate-spin mr-2" /> : <FiCheck className="mr-2" />}
            Verify & Sign In
          </button>
        </div>
      )}

      {/* Links */}
      <div className="mt-6 text-center text-purple-300">
        <p className="mb-3">New here?</p>
        <button
          onClick={onSwitchToSignup}
          className="inline-flex items-center text-white hover:text-pink-300 transition"
        >
          Create account <FiArrowRight className="ml-1" />
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-purple-800 text-center">
        <button
          onClick={onSwitchToAdmin}
          className="text-purple-300 hover:text-white text-sm"
        >
          Are you an admin? Sign in here
        </button>
      </div>
    </div>
  );
};

export default UserLoginForm;
