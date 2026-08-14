import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    Lock, 
    Key, 
    ArrowLeft, 
    AlertCircle, 
    CheckCircle,
    Save
} from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [resetToken, setResetToken] = useState("");
    const [formData, setFormData] = useState({
        password: "",
        confirm_password: ""
    });
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get token from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        if (token) {
            setResetToken(token);
        } else {
            setMessage("Invalid reset link");
            setIsSuccess(false);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (formData.password.length < 6) {
            setMessage("Password must be at least 6 characters");
            setIsSuccess(false);
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setMessage("Passwords do not match");
            setIsSuccess(false);
            return;
        }

        setLoading(true);

        fetch("https://siddhiexpense.rf.gd/expense_tracker/backend/api/auth/reset-password.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reset_token: resetToken,
                password: formData.password,
                confirm_password: formData.confirm_password
            })
        })
        .then((res) => res.json())
        .then((data) => {
            setLoading(false);
            setMessage(data.message);
            setIsSuccess(data.status === "success");

            if (data.status === "success") {
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
        })
        .catch((err) => {
            setLoading(false);
            console.log(err);
            setMessage("Server Error");
            setIsSuccess(false);
        });
    };

    if (!resetToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-4">The password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
                {/* Back Button */}
                <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to Login</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                        <Key className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Enter your new password below.
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                        isSuccess 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                        {isSuccess ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="confirm_password"
                                placeholder="Re-enter new password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resetting...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Reset Password
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;