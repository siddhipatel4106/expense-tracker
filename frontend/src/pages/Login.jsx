import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Mail, 
    Lock, 
    LogIn, 
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = (e) => {
    e.preventDefault();

    // Validation
    if (email.trim() === "") {
      setMessage("Email is required.");
      setIsSuccess(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setIsSuccess(false);
      return;
    }

    if (password.trim() === "") {
      setMessage("Password is required.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);

    fetch("http://localhost:8888/expense_tracker/backend/api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    .then((res) => res.json())
    .then((data) => {
      setLoading(false);
      setMessage(data.message);
      setIsSuccess(data.status === "success");

      if (data.status === "success") {
        // Store user data and token
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("expires_at", data.expires_at);
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log(err);
      setMessage("Server Error");
      setIsSuccess(false);
    });
  };

  return (
    <div className='min-h-screen bg-blue-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-md'>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>Expense Tracker</h1>
          <p className='text-gray-600 text-sm mt-1'>
            Welcome back, Please log in to your account.
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
        <form onSubmit={login}>
          <div className="mb-4">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className="mb-2">
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="text-right mb-6">
            <Link to="/forgot-password" className='text-sm text-blue-600 hover:text-blue-800 hover:underline'>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full bg-blue-600 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Log In
              </>
            )}
          </button>


<p className='text-center text-sm font-medium mt-4 text-gray-600'>
    Don't have an account?
    <Link to="/register" className='text-blue-600 hover:text-blue-800 hover:underline ml-1'>
        Register Here
    </Link>
</p>


<div className="mt-4 text-center">
    <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
        ← Back to Home
    </Link>
</div>
        </form>
      </div>
    </div>
  );
};

export default Login;