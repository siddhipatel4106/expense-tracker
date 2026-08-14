const API_BASE_URL = "https://siddhiexpense.rf.gd/api/income";

// Helper function to get user_id
const getUserId = () => {
    return localStorage.getItem('user_id');
};

// Helper function to get headers
const getHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};

// Get all incomes with filters
export const getIncomes = async (filters = {}) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }

        let url = `${API_BASE_URL}/read.php?user_id=${userId}`;
        
        if (filters.category_id) {
            url += `&category_id=${filters.category_id}`;
        }
        if (filters.from_date) {
            url += `&from_date=${filters.from_date}`;
        }
        if (filters.to_date) {
            url += `&to_date=${filters.to_date}`;
        }
        if (filters.payment_method) {
            url += `&payment_method=${filters.payment_method}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching incomes:', error);
        return { status: 'error', message: 'Network error' };
    }
};

// Create new income
export const createIncome = async (incomeData) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }

        const response = await fetch(`${API_BASE_URL}/create.php`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                ...incomeData,
                user_id: userId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating income:', error);
        return { status: 'error', message: 'Network error' };
    }
};

// Update income
export const updateIncome = async (incomeData) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }

        const response = await fetch(`${API_BASE_URL}/update.php`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                ...incomeData,
                user_id: userId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating income:', error);
        return { status: 'error', message: 'Network error' };
    }
};

// Delete income
export const deleteIncome = async (income_id) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }

        const response = await fetch(`${API_BASE_URL}/delete.php`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ 
                income_id,
                user_id: userId 
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting income:', error);
        return { status: 'error', message: 'Network error' };
    }
};