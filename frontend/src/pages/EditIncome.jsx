import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getIncomes, updateIncome } from '../services/incomeService';
import { getCategories } from '../services/categoryService';

const EditIncome = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        income_id: id,
        category_id: '',
        amount: '',
        payment_method: '',
        description: '',
        date: ''
    });

    const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Bank Transfer'];

    // Check if user is logged in
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            navigate('/login');
        }
    }, [navigate]);

    // Load categories and income data
    useEffect(() => {
        loadCategories();
        loadIncome();
    }, [id]);

    const loadCategories = async () => {
        const result = await getCategories('Income');
        if (result.status === 'success') {
            setCategories(result.data);
        }
    };

    const loadIncome = async () => {
        setLoading(true);
        const result = await getIncomes();
        if (result.status === 'success') {
            const income = result.data.find(i => i.income_id === parseInt(id));
            if (income) {
                setFormData({
                    income_id: income.income_id,
                    category_id: income.category_id,
                    amount: income.amount,
                    payment_method: income.payment_method,
                    description: income.description || '',
                    date: income.date
                });
            } else {
                setMessage('Income not found');
                setIsSuccess(false);
            }
        }
        setLoading(false);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validation
        if (!formData.category_id) {
            setMessage('Please select a category');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setMessage('Amount must be greater than 0');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        if (!formData.payment_method) {
            setMessage('Please select a payment method');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        if (!formData.date) {
            setMessage('Please select a date');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (formData.date > today) {
            setMessage('Date cannot be in the future');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        const result = await updateIncome(formData);

        if (result.status === 'success') {
            setMessage(result.message);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/income-list');
            }, 1500);
        } else {
            setMessage(result.message);
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Logout function
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex flex-wrap justify-between items-center">
                    <h1 className="text-2xl font-bold">Expense Tracker</h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Dashboard
                        </Link>
                        <Link to="/income-list" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                            View Incomes
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-4 max-w-2xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Income</h2>
                    <p className="text-gray-600">Update your income transaction</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-md mb-4 ${isSuccess ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {loading && !formData.category_id ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Loading income data...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method *
                                </label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter description (optional)"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Income'}
                                </button>
                                <Link
                                    to="/income-list"
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditIncome;