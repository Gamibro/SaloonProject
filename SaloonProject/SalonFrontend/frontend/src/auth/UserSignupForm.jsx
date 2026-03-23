import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const UserSignupForm = ({ onSignup, onSwitchToLogin }) => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   password: '',
  //   confirmPassword: ''
  // });
  // const [errors, setErrors] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   password: '',
  //   confirmPassword: '',
  //   general: ''
  // });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    general: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters";
    return "";
  };

  // const validateEmail = (email) => {
  //   if (!email) return 'Email is required';
  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!re.test(email)) return 'Please enter a valid email address';
  //   return '';
  // };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const re = /^\d+$/;
    if (!re.test(phone)) return "Phone number must contain only digits";
    if (phone.length !== 10) return "Phone number must be 10 digits";
    return "";
  };

  // const validatePassword = (password) => {
  //   if (!password) return 'Password is required';
  //   if (password.length < 6) return 'Password must be at least 6 characters';
  //   // Add more complex password rules if needed
  //   // const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  //   // if (!re.test(password)) return 'Password must contain at least one uppercase letter, one lowercase letter and one number';
  //   return '';
  // };

  // const validateConfirmPassword = (confirmPassword, password) => {
  //   if (!confirmPassword) return 'Please confirm your password';
  //   if (confirmPassword !== password) return 'Passwords do not match';
  //   return '';
  // };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      // email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      // password: validatePassword(formData.password),
      // confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      general: "",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number to only allow numbers
    if (name === "phone") {
      // Only allow numbers and limit to 10 characters
      const numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));
// https://nvsalonbackend.dockyardsoftware.com/api/Auth/register
// https://localhost:7014/api/Auth/register
    try {
      const response = await fetch("https://nvsalonbackend.dockyardsoftware.com/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          // email: formData.email,
          phone: formData.phone
          // password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      onSignup(formData);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Signup failed. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Join Us
        </h2>
        <p className="text-indigo-200">Create your account to get started</p>
      </div>

      {errors.general && (
        <div className="bg-red-900/50 text-red-100 p-3 rounded-lg mb-4 border border-red-700">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative h-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-indigo-300" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`h-12 bg-indigo-900/30 border ${
                errors.name ? "border-red-500" : "border-indigo-700"
              } text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 w-full
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
        </div>

        {/* <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-indigo-300" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`bg-indigo-900/30 border ${errors.email ? 'border-red-500' : 'border-indigo-700'} text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div> */}

        <div className="space-y-1">
          <div className="relative h-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="text-indigo-300" />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              className={`h-12 bg-indigo-900/30 border ${
                errors.phone ? "border-red-500" : "border-indigo-700"
              } text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 w-full
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-400 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="text-indigo-300" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            className={`bg-indigo-900/30 border ${errors.password ? 'border-red-500' : 'border-indigo-700'} text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
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
            className={`bg-indigo-900/30 border ${errors.confirmPassword ? 'border-red-500' : 'border-indigo-700'} text-white placeholder-indigo-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
        </div> */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center shadow-lg hover:shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-indigo-300">
        <button
          onClick={onSwitchToLogin}
          className="inline-flex items-center text-white hover:text-blue-300 transition"
        >
          <FiArrowLeft className="mr-1" /> Back to login
        </button>
      </div>
    </div>
  );
};

export default UserSignupForm;
