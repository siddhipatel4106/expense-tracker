import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
    User, 
    Mail, 
    Lock, 
    UserPlus,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    UserCheck
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const register = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple frontend validation
    if (form.first_name.trim() === "") {
      setMessage("First name is required");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (form.last_name.trim() === "") {
      setMessage("Last name is required");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (form.username.trim() === "") {
      setMessage("Username is required");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (form.email.trim() === "") {
      setMessage("Email is required");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage("Please enter a valid email address");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    if (form.password !== form.confirm_password) {
      setMessage("Passwords do not match");
      setIsSuccess(false);
      setLoading(false);
      return;
    }
    
      fetch("https://siddhiexpense.rf.gd/api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
    .then(async (res) => {
      const text = await res.text();
      console.log("Response:", text);

      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON: " + text);
      }
    })
    .then((data) => {
      setLoading(false);
      setMessage(data.message);
      setIsSuccess(data.success);

      if (data.success) {
        setForm({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          confirm_password: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
      setMessage(err.message);
      setIsSuccess(false);
    });
  }

  return (
    <div className='min-h-screen bg-blue-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-md'>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>Create an Account</h2>
          <p className='text-gray-600 text-sm mt-1'>
            Join Expense Tracker to manage your finances.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
            isSuccess
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {isSuccess ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{message}</span>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={register}>
          <div className="mb-3">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="John" 
                name="first_name" 
                onChange={handleChange} 
                value={form.first_name} 
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Doe" 
                onChange={handleChange} 
                name="last_name" 
                value={form.last_name} 
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Username
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="john_1" 
                onChange={handleChange} 
                name="username" 
                value={form.username} 
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="john@example.com" 
                onChange={handleChange} 
                name="email" 
                value={form.email} 
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter Password" 
                onChange={handleChange} 
                name="password" 
                value={form.password} 
                className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div className="mb-4">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Re-enter password"
                value={form.confirm_password}
                onChange={handleChange}
                className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className='w-full bg-blue-600 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>

          <p className='text-center text-sm font-medium mt-4 text-gray-600'>
            Already have an account? 
            <Link to="/login" className='text-blue-600 hover:text-blue-800 hover:underline ml-1'>
              Login Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;