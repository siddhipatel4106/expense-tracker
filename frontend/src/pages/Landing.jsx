import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Smartphone,
  Award,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      icon: TrendingUp,
      title: "Track Income",
      description:
        "Easily record and monitor all your income sources.",
    },
    {
      icon: TrendingDown,
      title: "Manage Expenses",
      description:
        "Keep track of every expense with detailed categories.",
    },
    {
      icon: Calendar,
      title: "Monthly Overview",
      description:
        "View monthly reports and financial summaries.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description:
        "Access your finances anytime from any device.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= Navbar ================= */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <Wallet className="w-8 h-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                Expense Tracker
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">

              <Link
                to="/login"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:block">Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1 px-3 sm:px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:block">Register</span>
              </Link>

            </div>
          </div>
        </div>
      </nav>

      {/* ================= Hero Section ================= */}

      <section className="pt-24 pb-12 lg:pt-28 lg:pb-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[75vh]">

            {/* Left Side */}

            <div className="space-y-5">

              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">

                <Award className="w-5 h-5" />

                <span className="text-sm font-medium">
                  Smart Finance Management
                </span>

              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">

                Take Control of Your{" "}

                <span className="text-blue-600">
                  Finances
                </span>

              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">

                Track your income, manage expenses, monitor your monthly balance,
                and achieve your financial goals with our smart expense tracker.

              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg"
                >
                  Get Started

                  <ArrowRight className="w-5 h-5" />

                </Link>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-7 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:border-blue-600 hover:text-blue-600 transition"
                >
                  <LogIn className="w-5 h-5" />

                  Sign In
                </Link>

              </div>

            </div>

            {/* Right Side */}

            <div className="hidden md:flex justify-center">

              <div className="w-full max-w-lg bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl p-6 lg:p-8">

                <div className="bg-white rounded-2xl p-6">

                  <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center gap-2">

                      <Wallet className="w-6 h-6 text-blue-600" />

                      <h3 className="font-semibold text-gray-800">
                        Dashboard Preview
                      </h3>

                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">

                    <div className="bg-green-50 rounded-lg p-3">

                      <p className="text-xs text-gray-500">
                        Income
                      </p>

                      <h4 className="font-bold text-green-600">
                        ₹45,000
                      </h4>

                    </div>

                    <div className="bg-red-50 rounded-lg p-3">

                      <p className="text-xs text-gray-500">
                        Expense
                      </p>

                      <h4 className="font-bold text-red-600">
                        ₹32,000
                      </h4>

                    </div>

                    <div className="bg-blue-50 rounded-lg p-3">

                      <p className="text-xs text-gray-500">
                        Balance
                      </p>

                      <h4 className="font-bold text-blue-600">
                        ₹13,000
                      </h4>

                    </div>

                  </div>

                  <div className="space-y-3">

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Salary</span>
                      <span className="font-semibold text-green-600">
                        +₹25,000
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Rent</span>
                      <span className="font-semibold text-red-600">
                        -₹10,000
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Freelance</span>
                      <span className="font-semibold text-green-600">
                        +₹8,000
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

            {/* ================= Features Section ================= */}

            <section className="py-12 lg:py-16 bg-gray-50">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

  <div className="text-center mb-12">

    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      Why Choose Expense Tracker?
    </h2>

    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
      Everything you need to manage your income and expenses in one
      simple, secure and user-friendly platform.
    </p>

  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

    {features.map((feature, index) => {

      const Icon = feature.icon;

      return (

        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
        >

          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition">

            <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition" />

          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {feature.title}
          </h3>

          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>

        </div>

      );

    })}

  </div>

</div>

</section>

{/* ================= Call To Action ================= */}

<section className="py-14 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-700">

<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

  <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">

    Ready to Take Control of Your Finances?

  </h2>

  <p className="text-lg md:text-xl text-blue-100 mb-8">

    Join thousands of users who are already tracking their income,
    expenses and savings with Expense Tracker.

  </p>

  <Link
    to="/register"
    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
  >

    <UserPlus className="w-5 h-5" />

    Create Free Account

    <ArrowRight className="w-5 h-5" />

  </Link>

</div>

</section>
      {/* ================= Footer ================= */}

      <footer className="bg-gray-900 text-gray-300">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Logo & About */}

            <div>

              <div className="flex items-center gap-2 mb-4">

                <Wallet className="w-8 h-8 text-blue-500" />

                <h2 className="text-2xl font-bold text-white">
                  Expense Tracker
                </h2>

              </div>

              <p className="text-gray-400 leading-relaxed">

                Manage your income, expenses and savings effortlessly with our
                secure and responsive Expense Tracker application.

              </p>

            </div>

            {/* Quick Links */}

            <div>

              <h3 className="text-xl font-semibold text-white mb-4">
                Quick Links
              </h3>

              <div className="flex flex-col gap-3">

                <Link
                  to="/login"
                  className="hover:text-blue-400 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hover:text-blue-400 transition"
                >
                  Register
                </Link>

                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Privacy Policy
                </a>

                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Terms & Conditions
                </a>

              </div>

            </div>

            {/* Contact */}

            <div>

              <h3 className="text-xl font-semibold text-white mb-4">
                Get Started
              </h3>

              <p className="text-gray-400 mb-5">

                Start tracking your finances today and build better money habits.

              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition shadow-lg"
              >

                <UserPlus className="w-5 h-5" />

                Register Now

              </Link>

            </div>

          </div>

          {/* Bottom Footer */}

          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-sm text-gray-400 text-center md:text-left">

              © 2026 Expense Tracker. All Rights Reserved.

            </p>

          </div>

        </div>

      </footer>

    </div>

  );
};

export default Landing;