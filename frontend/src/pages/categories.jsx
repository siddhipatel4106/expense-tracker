import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // State for add/edit modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        category_id: '',
        category_name: '',
        type: 'Expense'
    });

    // Check if user is logged in
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            navigate('/login');
        }
    }, [navigate]);

    // Load categories
    useEffect(() => {
        loadCategories();
    }, [filterType]);

    const loadCategories = async () => {
        setLoading(true);
        const result = await getCategories(filterType);
        if (result.status === 'success') {
            setCategories(result.data);
        } else {
            setMessage('Failed to load categories');
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Open add modal
    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            category_id: '',
            category_name: '',
            type: 'Expense'
        });
        setShowModal(true);
        setMessage('');
    };

    // Open edit modal
    const openEditModal = (category) => {
        setModalMode('edit');
        setFormData({
            category_id: category.category_id,
            category_name: category.category_name,
            type: category.type
        });
        setShowModal(true);
        setMessage('');
    };

    // Handle form input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.category_name.trim()) {
            setMessage('Category name is required');
            setIsSuccess(false);
            setLoading(false);
            return;
        }

        let result;
        if (modalMode === 'add') {
            result = await createCategory({
                category_name: formData.category_name,
                type: formData.type
            });
        } else {
            result = await updateCategory({
                category_id: formData.category_id,
                category_name: formData.category_name
            });
        }

        if (result.status === 'success') {
            setMessage(result.message);
            setIsSuccess(true);
            setShowModal(false);
            loadCategories();
            setFormData({
                category_id: '',
                category_name: '',
                type: 'Expense'
            });
        } else {
            setMessage(result.message);
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Handle delete
    const handleDelete = async (category_id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        setLoading(true);
        const result = await deleteCategory(category_id);
        
        if (result.status === 'success') {
            setMessage(result.message);
            setIsSuccess(true);
            loadCategories();
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message);
            setIsSuccess(false);
        }
        setLoading(false);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setMessage('');
    };

    // Get category icon
    const getCategoryIcon = (type) => {
        return type === 'Income' ? '💰' : '💸';
    };

    // Get category type color
    const getTypeColor = (type) => {
        return type === 'Income' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
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
                        <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
                        <button
                            onClick={openAddModal}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            + Add Category
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-3 rounded-md mb-4 ${isSuccess ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                        {message}
                    </div>
                )}

                {/* Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <label className="font-medium text-gray-700">Filter by type:</label>
                        <button
                            onClick={() => setFilterType('')}
                            className={`px-4 py-2 rounded-md transition duration-200 ${
                                filterType === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('Income')}
                            className={`px-4 py-2 rounded-md transition duration-200 ${
                                filterType === 'Income' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setFilterType('Expense')}
                            className={`px-4 py-2 rounded-md transition duration-200 ${
                                filterType === 'Expense' ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            Expense
                        </button>
                    </div>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading && !showModal ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No categories found</p>
                            <button
                                onClick={openAddModal}
                                className="mt-2 text-blue-600 hover:underline"
                            >
                                Create your first category
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <tr key={category.category_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-2xl">
                                                {getCategoryIcon(category.type)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {category.category_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(category.type)}`}>
                                                    {category.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.category_id)}
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
                            </h3>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        name="category_name"
                                        value={formData.category_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={modalMode === 'edit'}
                                    >
                                        <option value="Income">Income</option>
                                        <option value="Expense">Expense</option>
                                    </select>
                                    {modalMode === 'edit' && (
                                        <p className="text-xs text-gray-500 mt-1">Type cannot be changed after creation</p>
                                    )}
                                </div>

                                {message && (
                                    <div className={`p-2 rounded-md text-sm mb-4 ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {message}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Category' : 'Update Category')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;