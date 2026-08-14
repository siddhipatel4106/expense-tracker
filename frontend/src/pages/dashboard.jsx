import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    PlusCircle, 
    List, 
    Tags, 
    BarChart3, 
    User, 
    LogOut,
    TrendingUp,
    TrendingDown,
    Wallet,
    Calendar,
    Filter,
    Edit,
    Trash2,
    X,
    Save,
    DollarSign,
    CreditCard,
    CheckCircle,
    AlertCircle,
    User as UserIcon,
    Mail,
    Lock,
    Key,
    Menu
} from 'lucide-react';
import { getCategories } from '../services/categoryService';
import { getIncomes } from '../services/incomeService';
import { getExpenses, updateExpense } from '../services/expenseService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dashboard Data
    const [dashboardData, setDashboardData] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        totalTransactions: 0,
        recentTransactions: []
    });

    // Categories Data
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categoryForm, setCategoryForm] = useState({
        category_id: '',
        category_name: '',
        type: 'Expense'
    });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState('add');

    // Income Data
    const [incomes, setIncomes] = useState([]);
    const [incomeForm, setIncomeForm] = useState({
        category_id: '',
        amount: '',
        payment_method: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [incomeModalMode, setIncomeModalMode] = useState('add');

    // Expense Data
    const [expenses, setExpenses] = useState([]);
    const [expenseForm, setExpenseForm] = useState({
        expense_id: '',
        category_id: '',
        amount: '',
        payment_method: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseModalMode, setExpenseModalMode] = useState('add');

    // Report Filters
    const [reportFilter, setReportFilter] = useState('month');
    const [customFromDate, setCustomFromDate] = useState('');
    const [customToDate, setCustomToDate] = useState('');
    const [filteredIncomes, setFilteredIncomes] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    // Profile Data
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const paymentMethods = ['Cash', 'UPI', 'Credit Card', 'Bank Transfer'];

    // Check if user is logged in
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        const userData = localStorage.getItem('user_data');
        
        if (!userId) {
            navigate('/login');
            return;
        }

        if (userData) {
            const user = JSON.parse(userData);
            setUserName(user.first_name || 'User');
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                email: user.email || ''
            });
        }

        loadDashboardData();
        loadCategories();
        loadIncomes();
        loadExpenses();
    }, []);

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load Dashboard Data
    const loadDashboardData = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:8888/expense_tracker/backend/api/dashboard.php?user_id=${userId}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                setDashboardData(data.data);
            }
        } catch (error) {
            console.log('Error fetching dashboard data:', error);
        }
    };

    // Load Categories
    const loadCategories = async () => {
        const result = await getCategories(categoryFilter);
        if (result.status === 'success') {
            setCategories(result.data);
        }
    };

    // Load Incomes
    const loadIncomes = async () => {
        const result = await getIncomes();
        if (result.status === 'success') {
            setIncomes(result.data);
        }
    };

    // Load Expenses
    const loadExpenses = async () => {
        const result = await getExpenses();
        if (result.status === 'success') {
            setExpenses(result.data);
        }
    };

    // Handle Logout
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Format Currency
    const formatCurrency = (amount) => {
        return '₹' + parseFloat(amount || 0).toFixed(2);
    };

    // Format Date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get Category Name
    const getCategoryName = (category_id) => {
        const category = categories.find(c => c.category_id === category_id);
        return category ? category.category_name : 'Unknown';
    };

    // Show Message
    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    // CATEGORY CRUD Operations
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!categoryForm.category_name.trim()) {
            showMessage('Category name is required', 'error');
            setLoading(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            let url, method, body;

            if (categoryModalMode === 'add') {
                url = 'https://siddhiexpense.rf.gd/expense_tracker/backend/api/categories/create.php';
                method = 'POST';
                body = JSON.stringify({
                    category_name: categoryForm.category_name,
                    type: categoryForm.type,
                    user_id: userId
                });
            } else {
                url = 'https://siddhiexpense.rf.gd/expense_tracker/backend/api/categories/update.php';
                method = 'PUT';
                body = JSON.stringify({
                    category_id: categoryForm.category_id,
                    category_name: categoryForm.category_name,
                    user_id: userId
                });
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                setShowCategoryModal(false);
                loadCategories();
                setCategoryForm({
                    category_id: '',
                    category_name: '',
                    type: 'Expense'
                });
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error saving category', 'error');
        }
        setLoading(false);
    };

    const handleCategoryDelete = async (category_id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch('https://siddhiexpense.rf.gd/expense_tracker/backend/api/categories/delete.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_id, user_id: userId })
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                loadCategories();
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error deleting category', 'error');
        }
    };

    // INCOME CRUD Operations
    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!incomeForm.category_id || !incomeForm.amount || !incomeForm.payment_method || !incomeForm.date) {
            showMessage('Please fill all required fields', 'error');
            setLoading(false);
            return;
        }

        if (parseFloat(incomeForm.amount) <= 0) {
            showMessage('Amount must be greater than 0', 'error');
            setLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (incomeForm.date > today) {
            showMessage('Date cannot be in the future', 'error');
            setLoading(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            let url, method, body;

            if (incomeModalMode === 'add') {
                url = 'https://siddhiexpense.rf.gd/expense_tracker/backend/api/income/create.php';
                method = 'POST';
                body = JSON.stringify({ ...incomeForm, user_id: userId });
            } else {
                url = 'https://siddhiexpense.rf.gd/expense_tracker/backend/api/income/update.php';
                method = 'PUT';
                body = JSON.stringify({ ...incomeForm, user_id: userId });
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                setShowIncomeModal(false);
                loadIncomes();
                loadDashboardData();
                setIncomeForm({
                    category_id: '',
                    amount: '',
                    payment_method: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                });
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error saving income', 'error');
        }
        setLoading(false);
    };

    const handleIncomeDelete = async (income_id) => {
        if (!window.confirm('Are you sure you want to delete this income entry?')) return;

        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch('http://localhost:8888/expense_tracker/backend/api/income/delete.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ income_id, user_id: userId })
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                loadIncomes();
                loadDashboardData();
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error deleting income', 'error');
        }
    };

    // EXPENSE CRUD Operations
    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!expenseForm.category_id || !expenseForm.amount || !expenseForm.payment_method || !expenseForm.date) {
            showMessage('Please fill all required fields', 'error');
            setLoading(false);
            return;
        }

        if (parseFloat(expenseForm.amount) <= 0) {
            showMessage('Amount must be greater than 0', 'error');
            setLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (expenseForm.date > today) {
            showMessage('Date cannot be in the future', 'error');
            setLoading(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            let url, method, body;

            if (expenseModalMode === 'add') {
                url = 'https://siddhiexpense.rf.gd/expense_tracker/backend/api/expense/create.php';
                method = 'POST';
                body = JSON.stringify({ ...expenseForm, user_id: userId });
            } else {
                url = 'https://siddhiexpense.rf.gd/expense_tracker/backend/api/expense/update.php';
                method = 'PUT';
                body = JSON.stringify({ 
                    expense_id: expenseForm.expense_id,
                    category_id: expenseForm.category_id,
                    amount: expenseForm.amount,
                    payment_method: expenseForm.payment_method,
                    description: expenseForm.description,
                    date: expenseForm.date,
                    user_id: userId 
                });
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                setShowExpenseModal(false);
                loadExpenses();
                loadDashboardData();
                setExpenseForm({
                    expense_id: '',
                    category_id: '',
                    amount: '',
                    payment_method: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                });
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error saving expense', 'error');
        }
        setLoading(false);
    };

    const handleExpenseDelete = async (expense_id) => {
        if (!window.confirm('Are you sure you want to delete this expense entry?')) return;

        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch('https://siddhiexpense.rf.gd/expense_tracker/backend/api/expense/delete.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expense_id, user_id: userId })
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                loadExpenses();
                loadDashboardData();
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error deleting expense', 'error');
        }
    };

    // Apply Report Filters
    const applyReportFilters = () => {
        const now = new Date();
        let fromDate = '';
        let toDate = now.toISOString().split('T')[0];

        switch(reportFilter) {
            case 'today':
                fromDate = toDate;
                break;
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - now.getDay());
                fromDate = weekStart.toISOString().split('T')[0];
                break;
            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                fromDate = monthStart.toISOString().split('T')[0];
                break;
            case 'custom':
                fromDate = customFromDate;
                toDate = customToDate;
                break;
            default:
                fromDate = '';
                toDate = '';
        }

        // Filter incomes
        const filteredInc = incomes.filter(income => {
            if (!fromDate && !toDate) return true;
            const incomeDate = income.date;
            if (fromDate && toDate) {
                return incomeDate >= fromDate && incomeDate <= toDate;
            }
            return true;
        });
        setFilteredIncomes(filteredInc);

        // Filter expenses
        const filteredExp = expenses.filter(expense => {
            if (!fromDate && !toDate) return true;
            const expenseDate = expense.date;
            if (fromDate && toDate) {
                return expenseDate >= fromDate && expenseDate <= toDate;
            }
            return true;
        });
        setFilteredExpenses(filteredExp);
    };

    useEffect(() => {
        applyReportFilters();
    }, [reportFilter, customFromDate, customToDate, incomes, expenses]);

    // Profile Update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch('https://siddhiexpense.rf.gd/expense_tracker/backend/api/profile/update.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    username: profileData.username,
                    email: profileData.email
                })
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                const userData = JSON.parse(localStorage.getItem('user_data'));
                userData.first_name = profileData.first_name;
                userData.last_name = profileData.last_name;
                userData.username = profileData.username;
                userData.email = profileData.email;
                localStorage.setItem('user_data', JSON.stringify(userData));
                setUserName(profileData.first_name);
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error updating profile', 'error');
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (passwordData.new_password.length < 6) {
            showMessage('New password must be at least 6 characters', 'error');
            setLoading(false);
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            showMessage('Passwords do not match', 'error');
            setLoading(false);
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch('https://siddhiexpense.rf.gd/expense_tracker/backend/api/profile/change-password.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password
                })
            });
            const result = await response.json();

            if (result.status === 'success') {
                showMessage(result.message, 'success');
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            showMessage('Error changing password', 'error');
        }
        setLoading(false);
    };

    // Mobile Navigation Toggle
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Sidebar Navigation Component (Desktop)
    const Sidebar = () => (
        <div className="hidden lg:block bg-blue-50 shadow-lg w-64 min-h-screen fixed left-0 top-0 overflow-y-auto z-50">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-900">Expense Tracker</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome, {userName}</p>
            </div>
            <nav className="p-4">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'add-transaction', label: 'Add Transaction', icon: PlusCircle },
                    { id: 'transactions', label: 'Transactions', icon: List },
                    { id: 'categories', label: 'Categories', icon: Tags },
                    { id: 'reports', label: 'Reports', icon: BarChart3 },
                    { id: 'profile', label: 'Profile', icon: User },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-200 flex items-center gap-3 ${
                                activeTab === item.id 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 mt-4 border-t pt-4"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </nav>
        </div>
    );

    // Mobile Header with Navigation
    const MobileHeader = () => (
        <div className="lg:hidden bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-between p-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
                    <p className="text-sm text-gray-600">Welcome, {userName}</p>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>
        </div>
    );

    // Mobile Menu Overlay
    const MobileMenu = () => (
        <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={toggleMobileMenu}
            ></div>
            
            {/* Menu Panel */}
            <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                        <p className="text-sm text-gray-600">Welcome, {userName}</p>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'add-transaction', label: 'Add Transaction', icon: PlusCircle },
                        { id: 'transactions', label: 'Transactions', icon: List },
                        { id: 'categories', label: 'Categories', icon: Tags },
                        { id: 'reports', label: 'Reports', icon: BarChart3 },
                        { id: 'profile', label: 'Profile', icon: User },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-200 flex items-center gap-3 ${
                                    activeTab === item.id 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 mt-4 border-t pt-4"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        </div>
    );

    // Message Component
    const Message = () => {
        if (!message) return null;
        const Icon = messageType === 'success' ? CheckCircle : AlertCircle;
        return (
            <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
                <Icon size={20} />
                <span className="font-medium">{message}</span>
                <button onClick={() => { setMessage(''); setMessageType(''); }} className="ml-4">
                    <X size={18} />
                </button>
            </div>
        );
    };

    // Render different sections
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'add-transaction':
                return renderAddTransaction();
            case 'transactions':
                return renderTransactions();
            case 'categories':
                return renderCategories();
            case 'reports':
                return renderReports();
            case 'profile':
                return renderProfile();
            default:
                return renderDashboard();
        }
    };

    // Dashboard Section
    const renderDashboard = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.totalIncome)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Expense</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(dashboardData.totalExpense)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <TrendingDown className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Balance</p>
                            <p className={`text-2xl font-bold ${dashboardData.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {formatCurrency(dashboardData.balance)}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Wallet className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Transactions</p>
                            <p className="text-2xl font-bold text-gray-700">{dashboardData.totalTransactions}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full">
                            <Calendar className="text-gray-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {dashboardData.recentTransactions.length > 0 ? (
                    <div className="divide-y">
                        {dashboardData.recentTransactions.map((transaction, index) => (
                            <div key={index} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{transaction.description || 'Transaction'}</p>
                                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                                </div>
                                <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No transactions yet</p>
                )}
            </div>
        </div>
    );

    // Add Transaction Section
    const renderAddTransaction = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-6">New Transaction</h2>
            <p className="text-gray-600 mb-6">Enter the details of your income or expense below.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-600" size={24} />
                        <h3 className="text-xl font-semibold text-green-600">Add Income</h3>
                    </div>
                    <form onSubmit={handleIncomeSubmit}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={incomeForm.amount}
                                onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                value={incomeForm.category_id}
                                onChange={(e) => setIncomeForm({...incomeForm, category_id: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.filter(c => c.type === 'Income').map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                            <select
                                value={incomeForm.payment_method}
                                onChange={(e) => setIncomeForm({...incomeForm, payment_method: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Method</option>
                                {paymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                value={incomeForm.date}
                                onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Add any details about this transaction..."
                                value={incomeForm.description}
                                onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Income'}
                        </button>
                    </form>
                </div>

                {/* Expense Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="text-red-600" size={24} />
                        <h3 className="text-xl font-semibold text-red-600">Add Expense</h3>
                    </div>
                    <form onSubmit={handleExpenseSubmit}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={expenseForm.amount}
                                onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                value={expenseForm.category_id}
                                onChange={(e) => setExpenseForm({...expenseForm, category_id: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.filter(c => c.type === 'Expense').map(cat => (
                                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                            <select
                                value={expenseForm.payment_method}
                                onChange={(e) => setExpenseForm({...expenseForm, payment_method: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Method</option>
                                {paymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                            <input
                                type="date"
                                value={expenseForm.date}
                                onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Add any details about this transaction..."
                                value={expenseForm.description}
                                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    // Transactions Section
    const renderTransactions = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">All Transactions</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} />
                    Income Transactions
                </h3>
                {incomes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {incomes.map(income => (
                                    <tr key={income.income_id}>
                                        <td className="px-4 py-3 text-sm">{formatDate(income.date)}</td>
                                        <td className="px-4 py-3 text-sm">{getCategoryName(income.category_id)}</td>
                                        <td className="px-4 py-3 text-sm">{income.payment_method}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-600">{formatCurrency(income.amount)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    setIncomeForm({
                                                        income_id: income.income_id,
                                                        category_id: income.category_id,
                                                        amount: income.amount,
                                                        payment_method: income.payment_method,
                                                        description: income.description || '',
                                                        date: income.date
                                                    });
                                                    setIncomeModalMode('edit');
                                                    setShowIncomeModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleIncomeDelete(income.income_id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No income transactions</p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <TrendingDown size={20} />
                    Expense Transactions
                </h3>
                {expenses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {expenses.map(expense => (
                                    <tr key={expense.expense_id}>
                                        <td className="px-4 py-3 text-sm">{formatDate(expense.date)}</td>
                                        <td className="px-4 py-3 text-sm">{getCategoryName(expense.category_id)}</td>
                                        <td className="px-4 py-3 text-sm">{expense.payment_method}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-red-600">{formatCurrency(expense.amount)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    setExpenseForm({
                                                        expense_id: expense.expense_id,
                                                        category_id: expense.category_id,
                                                        amount: expense.amount,
                                                        payment_method: expense.payment_method,
                                                        description: expense.description || '',
                                                        date: expense.date
                                                    });
                                                    setExpenseModalMode('edit');
                                                    setShowExpenseModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleExpenseDelete(expense.expense_id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No expense transactions</p>
                )}
            </div>
        </div>
    );

    // Categories Section
    const renderCategories = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Category Management</h2>
            
            <button
                onClick={() => {
                    setCategoryModalMode('add');
                    setCategoryForm({ category_id: '', category_name: '', type: 'Expense' });
                    setShowCategoryModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 mb-4 flex items-center gap-2"
            >
                <PlusCircle size={20} />
                Add Category
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[400px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {categories.map(category => (
                                    <tr key={category.category_id}>
                                        <td className="px-6 py-4">{category.category_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                category.type === 'Income' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {category.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setCategoryModalMode('edit');
                                                    setCategoryForm({
                                                        category_id: category.category_id,
                                                        category_name: category.category_name,
                                                        type: category.type
                                                    });
                                                    setShowCategoryModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleCategoryDelete(category.category_id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="p-6 text-gray-500 text-center">No categories found</p>
                )}
            </div>
        </div>
    );

    // Reports Section with Filters - FIXED CUSTOM DATE RANGE
    const renderReports = () => {
        const totalIncome = filteredIncomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
        const totalExpense = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const balance = totalIncome - totalExpense;

        const categoryExpenses = {};
        filteredExpenses.forEach(expense => {
            const categoryName = getCategoryName(expense.category_id);
            if (!categoryExpenses[categoryName]) {
                categoryExpenses[categoryName] = 0;
            }
            categoryExpenses[categoryName] += parseFloat(expense.amount);
        });

        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Reports</h2>
                
                {/* Filters - FIXED LAYOUT */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-gray-600" />
                        <h3 className="text-lg font-semibold">Filter Reports</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setReportFilter('today')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                reportFilter === 'today' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setReportFilter('week')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                reportFilter === 'week' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => setReportFilter('month')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                reportFilter === 'month' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setReportFilter('custom')}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                reportFilter === 'custom' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            Custom Range
                        </button>
                    </div>
                    
                    {/* Custom Date Range - FIXED LAYOUT */}
                    {reportFilter === 'custom' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                    <input
                                        type="date"
                                        value={customFromDate}
                                        onChange={(e) => setCustomFromDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                    <input
                                        type="date"
                                        value={customToDate}
                                        onChange={(e) => setCustomToDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={applyReportFilters}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600">Total Income</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-600">Total Expense</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="text-sm text-gray-600">Balance</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>

                {/* Category Wise Expenses */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Category Wise Expenses</h3>
                    {Object.keys(categoryExpenses).length > 0 ? (
                        <div className="space-y-3">
                            {Object.entries(categoryExpenses).map(([category, amount]) => (
                                <div key={category} className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium">{category}</span>
                                    <span className="text-red-600 font-semibold">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No expenses recorded in this period</p>
                    )}
                </div>
            </div>
        );
    };

    // Profile Section
    const renderProfile = () => (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-6">Profile Settings</h2>
            
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full">
                        <UserIcon size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">{profileData.first_name} {profileData.last_name}</h3>
                        <p className="text-blue-100">@{profileData.username}</p>
                        <p className="text-blue-100">{profileData.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Update */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User size={20} />
                        Update Profile
                    </h3>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                value={profileData.first_name}
                                onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={profileData.last_name}
                                onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lock size={20} />
                        Change Password
                    </h3>
                    <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    // Modals
    // Category Modal - FIXED VERSION
const CategoryModal = () => (
    showCategoryModal && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                        {categoryModalMode === 'add' ? 'Add Category' : 'Edit Category'}
                    </h3>
                    <form onSubmit={handleCategorySubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={categoryForm.category_name}
                                onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                placeholder="Enter category name"
                                autoFocus
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                value={categoryForm.type}
                                onChange={(e) => setCategoryForm({...categoryForm, type: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                disabled={categoryModalMode === 'edit'}
                            >
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                            {categoryModalMode === 'edit' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Type cannot be changed after creation
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setCategoryForm({
                                        category_id: '',
                                        category_name: '',
                                        type: 'Expense'
                                    });
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
);
    const IncomeModal = () => (
        showIncomeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">
                            {incomeModalMode === 'add' ? 'Add Income' : 'Edit Income'}
                        </h3>
                        <form onSubmit={handleIncomeSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={incomeForm.amount}
                                    onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={incomeForm.category_id}
                                    onChange={(e) => setIncomeForm({...incomeForm, category_id: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.filter(c => c.type === 'Income').map(cat => (
                                        <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={incomeForm.payment_method}
                                    onChange={(e) => setIncomeForm({...incomeForm, payment_method: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Method</option>
                                    {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={incomeForm.date}
                                    onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={incomeForm.description}
                                    onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowIncomeModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );

    const ExpenseModal = () => (
        showExpenseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">
                            {expenseModalMode === 'add' ? 'Add Expense' : 'Edit Expense'}
                        </h3>
                        <form onSubmit={handleExpenseSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={expenseForm.category_id}
                                    onChange={(e) => setExpenseForm({...expenseForm, category_id: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.filter(c => c.type === 'Expense').map(cat => (
                                        <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={expenseForm.payment_method}
                                    onChange={(e) => setExpenseForm({...expenseForm, payment_method: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Method</option>
                                    {paymentMethods.map(method => (
                                        <option key={method} value={method}>{method}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={expenseForm.date}
                                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowExpenseModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <Sidebar />
            
            {/* Mobile Header */}
            <MobileHeader />
            
            {/* Mobile Menu */}
            <MobileMenu />
            
            {/* Message Toast */}
            <Message />
            
            {/* Main Content */}
            <div className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="p-4 md:p-6 lg:p-8">
                    {renderContent()}
                </div>
            </div>

            {/* Modals */}
            <CategoryModal />
            <IncomeModal />
            <ExpenseModal />
        </div>
    );
};

export default Dashboard;