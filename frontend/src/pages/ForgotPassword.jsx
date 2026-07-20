import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Mail, 
    ArrowLeft, 
    Send, 
    CheckCircle, 
    AlertCircle,
    User 
} from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

    // For OTP verification
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [emailToReset, setEmailToReset] = useState("");

    // Send OTP
    const sendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!email.trim()) {
            setMessage("Email is required");
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address");
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8888/expense_tracker/backend/api/forgot-password/send-otp.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.status === "success") {
                setMessage(data.message);
                setIsSuccess(true);
                setShowOtpInput(true);
                setGeneratedOtp(data.otp); // Store OTP for verification
                setEmailToReset(email);
                setStep(2);
            } else {
                setMessage(data.message);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage("Server Error. Please try again.");
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Verify OTP
    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!otp.trim()) {
            setMessage("Please enter the OTP");
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost/expense_tracker/backend/api/forgot-password/verify-otp.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email: emailToReset,
                    otp: otp,
                    generated_otp: generatedOtp 
                })
            });
            const data = await response.json();

            if (data.status === "success") {
                setMessage(data.message);
                setIsSuccess(true);
                setStep(3);
            } else {
                setMessage(data.message);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage("Server Error. Please try again.");
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Reset Password
    const resetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (newPassword.length < 6) {
            setMessage("Password must be at least 6 characters");
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost/expense_tracker/backend/api/forgot-password/reset-password.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email: emailToReset,
                    new_password: newPassword 
                })
            });
            const data = await response.json();

            if (data.status === "success") {
                setMessage(data.message);
                setIsSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setMessage(data.message);
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage("Server Error. Please try again.");
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Render different steps
    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <form onSubmit={sendOtp}>
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
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Enter your registered email to receive OTP
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full bg-blue-600 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send OTP
                                </>
                            )}
                        </button>
                    </form>
                );

            case 2:
                return (
                    <form onSubmit={verifyOtp}>
                        <div className="mb-4">
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Enter OTP
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                OTP sent to {emailToReset}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full bg-blue-600 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Verify OTP
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                setShowOtpInput(false);
                                setOtp("");
                            }}
                            className="w-full mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                            ← Go Back
                        </button>
                    </form>
                );

            case 3:
                return (
                    <form onSubmit={resetPassword}>
                        <div className="mb-3">
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                />
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
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full bg-green-600 text-white rounded-lg py-2.5 font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Reset Password
                                </>
                            )}
                        </button>
                    </form>
                );

            default:
                return null;
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-2xl p-8 w-full max-w-md'>
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "Reset Password"}
                    </h1>
                    <p className='text-gray-600 text-sm mt-1'>
                        {step === 1 && "Enter your email to receive OTP"}
                        {step === 2 && "Enter the 6-digit OTP sent to your email"}
                        {step === 3 && "Create a new password for your account"}
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

                {/* Step Content */}
                {renderStep()}

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;