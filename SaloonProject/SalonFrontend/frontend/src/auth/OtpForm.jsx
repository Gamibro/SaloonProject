import axios from "axios";
import { useEffect, useRef, useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate,useParams } from "react-router-dom";
import toast from "react-hot-toast";

const RESEND_SECONDS = 30;

const OtpForm = () => {
  const {email: emailParams, phone:phoneParams} = useParams();
  const navigate = useNavigate();

  const initialEmail = emailParams ? decodeURIComponent(emailParams) : "";
  const initialPhone = phoneParams ? decodeURIComponent(phoneParams) : "";

  const [email] = useState(initialEmail);
  const [phone] = useState(initialPhone);
  const [otp, setOtp] = useState("");

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const sentRef = useRef(false); //To prevent rendering twice the otp
// https://nvsalonbackend.dockyardsoftware.com
// https://localhost:7014
  const API_BASE = "https://nvsalonbackend.dockyardsoftware.com";
  const SEND_URL = `${API_BASE}/api/Auth/otp/check`;    // send/start OTP
  const VERIFY_URL = `${API_BASE}/api/Auth/otp/verify`; // verify/check OTP

  // useEffect(() => {
  //   // if (!emailFromState || !phoneFromState) {
  //   //   navigate("/login", { replace: true });
  //   //   return;
  //   // }
  //   setEmail(emailFromState);
  //   setPhone(phoneFromState);
  // }, [emailFromState, phoneFromState, navigate]);

  useEffect(() => {
    if (!email || !phone || sentRef.current) return;
    sentRef.current = true;
    sendOtp();
  }, [email, phone]);

  //Clean the timer on mount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setTimeLeft(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const sendOtp = async()=>{
    try {
      setSending(true);
      await axios.post(SEND_URL, { email, phone });
      toast.success("OTP sent to your phone.");
      startResendTimer();
    } catch (err) {
      const msg = err?.response?.data || err?.message || "Failed to send OTP.";
      toast.error(String(msg));
    } finally {
      setSending(false);
    }
  }

  const verifyOtp = async()=> {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    try {
      setVerifying(true);
      await axios.post(VERIFY_URL, { email, phone, code: otp });
      toast.success("Phone verified. You’re all set!");
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data || err?.message || "OTP verification failed.";
      toast.error(String(msg));
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Verify Your Phone Number
        </h1>
        <p className="text-center text-indigo-200 mb-6">
          We sent a verification code to your phone number.
        </p>

        {/* Phone display */}
        <div className="mb-6">
          <input
            type="text"
            disabled
            value={phone}
            className="w-full h-11 text-center bg-blue-50 rounded-lg border border-indigo-300 px-3 text-[15px] font-semibold text-black"
          />
        </div>

        {/* OTP */}
        <p className="text-center text-indigo-200 mb-3">
          Enter 6-digit verification code
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
                className="w-15 h-12 mx-3 text-center text-black text-2xl bg-blue-50 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={verifyOtp}
            disabled={verifying || otp.length !== 6}
            className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg font-semibold disabled:opacity-60 transition"
          >
            {verifying ? "Verifying..." : "Verify Phone"}
          </button>

          <div className="w-full flex items-center gap-3">
            <button
              onClick={sendOtp}
              disabled={sending || timeLeft > 0}
              className="flex-1 h-11 border border-indigo-400 rounded-lg font-medium hover:bg-indigo-600/20 transition disabled:opacity-60"
            >
              {sending
                ? "Sending..."
                : timeLeft > 0
                ? `Resend in ${timeLeft}s`
                : "Resend Code"}
            </button>

            {/* <Link
              to="/login"
              className="h-11 flex items-center justify-center px-4 rounded-lg border border-transparent text-indigo-300 hover:text-white hover:underline"
            >
              Back to Login
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
