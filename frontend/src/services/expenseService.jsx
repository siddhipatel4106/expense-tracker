const API_BASE_URL = "http://localhost:8888/expense_tracker/backend/api/expense";

const getUserId = () => localStorage.getItem('user_id');

const getHeaders = () => ({ 'Content-Type': 'application/json' });

export const getExpenses = async (filters = {}) => {
    try {
        const userId = getUserId();
        if (!userId) return { status: 'error', message: 'Please login first' };

        let url = `${API_BASE_URL}/read.php?user_id=${userId}`;
        
        if (filters.category_id) url += `&category_id=${filters.category_id}`;
        if (filters.from_date) url += `&from_date=${filters.from_date}`;
        if (filters.to_date) url += `&to_date=${filters.to_date}`;
        if (filters.payment_method) url += `&payment_method=${filters.payment_method}`;

        const response = await fetch(url, { method: 'GET', headers: getHeaders() });
        return await response.json();
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return { status: 'error', message: 'Network error' };
    }
};

export const getExpenseById = async (expense_id) => {
    try {
        const userId = getUserId();
        if (!userId) return { status: 'error', message: 'Please login first' };

        const response = await fetch(`${API_BASE_URL}/read.php?user_id=${userId}&expense_id=${expense_id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching expense:', error);
        return { status: 'error', message: 'Network error' };
    }
};

export const createExpense = async (expenseData) => {
    try {
        const userId = getUserId();
        if (!userId) return { status: 'error', message: 'Please login first' };

        const response = await fetch(`${API_BASE_URL}/create.php`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ ...expenseData, user_id: userId })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating expense:', error);
        return { status: 'error', message: 'Network error' };
    }
};

export const updateExpense = async (expenseData) => {
    try {
        const userId = getUserId();
        if (!userId) return { status: 'error', message: 'Please login first' };

        const response = await fetch(`${API_BASE_URL}/update.php`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ ...expenseData, user_id: userId })
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating expense:', error);
        return { status: 'error', message: 'Network error' };
    }
};

export const deleteExpense = async (expense_id) => {
    try {
        const userId = getUserId();
        if (!userId) return { status: 'error', message: 'Please login first' };

        const response = await fetch(`${API_BASE_URL}/delete.php`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ expense_id, user_id: userId })
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting expense:', error);
        return { status: 'error', message: 'Network error' };
    }
};