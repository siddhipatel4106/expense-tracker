import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getIncomes, deleteIncome } from '../services/incomeService';
import { getCategories } from '../services/categoryService';

const IncomeList = () => {
    const navigate = useNavigate();
    const [incomes, setIncomes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Filter state
    const [filters, setFilters] = useState({
        category_id: '',
        from_date: '',
        to_date: '',
        payment_method: ''
    });

    const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Bank Transfer'];

    // Check if user is logged in
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            navigate('/login');
        }
    }, [navigate]);

    // Load categories and incomes
    useEffect(() => {
        loadCategories();
        loadIncomes();
    }, []);

    const loadCategories = async () => {
        const result = await getCategories('Income');
        if (result.status === 'success') {
            setCategories(result.data);
        }
    };

    const loadIncomes = async () => {
        setLoading(true);
        const result = await getIncomes(filters);
        if (result.status === 'success') {
            setIncomes(result.data);
        } else {
            setMessage(result.message);
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Apply filters
    const applyFilters = () => {
        loadIncomes();
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            category_id: '',
            from_date: '',
            to_date: '',
            payment_method: ''
        });
        setTimeout(() => loadIncomes(), 100);
    };

    // Handle delete
    const handleDelete = async (income_id) => {
        if (!window.confirm('Are you sure you want to delete this income entry?')) {
            return;
        }

        setLoading(true);
        const result = await deleteIncome(income_id);
        
        if (result.status === 'success') {
            setMessage(result.message);
            setIsSuccess(true);
            loadIncomes();
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message);
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return '₹' + parseFloat(amount).toFixed(2);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get category name
    const getCategoryName = (category_id) => {
        const category = categories.find(c => c.category_id === category_id);
        return category ? category.category_name : 'Unknown';
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
                        <Link to="/add-income" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            + Add Income
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

            <div className="container mx-auto p-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Income List</h2>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-md mb-4 ${isSuccess ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                        {message}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category_id"
                                value={filters.category_id}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                name="from_date"
                                value={filters.from_date}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                name="to_date"
                                value={filters.to_date}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select
                                name="payment_method"
                                value={filters.payment_method}
                                onChange={handleFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Methods</option>
                                {paymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={applyFilters}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={resetFilters}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Income List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">Loading incomes...</p>
                        </div>
                    ) : incomes.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No income entries found</p>
                            <Link to="/add-income" className="mt-2 inline-block text-blue-600 hover:underline">
                                Add your first income
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {incomes.map((income) => (
                                        <tr key={income.income_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(income.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                                                    {getCategoryName(income.category_id)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {income.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {income.payment_method}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                {formatCurrency(income.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/edit-income/${income.income_id}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(income.income_id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomeList;