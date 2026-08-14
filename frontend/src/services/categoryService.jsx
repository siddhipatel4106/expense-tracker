const API_BASE_URL = "https://siddhiexpense.rf.gd/api/categories";

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

// Get all categories
export const getCategories = async (type = '') => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }
        
        const url = type ? 
            `${API_BASE_URL}/read.php?type=${type}&user_id=${userId}` : 
            `${API_BASE_URL}/read.php?user_id=${userId}`;
            
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { status: 'error', message: 'Network error' };
    }
};

// Create new category
export const createCategory = async (categoryData) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }
        
        const response = await fetch(`${API_BASE_URL}/create.php`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                ...categoryData,
                user_id: userId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating category:', error);
        return { status: 'error', message: 'Network error' };
    }
};

// Update category
export const updateCategory = async (categoryData) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }
        
        const response = await fetch(`${API_BASE_URL}/update.php`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                ...categoryData,
                user_id: userId
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating category:', error);
        return { status: 'error', message: 'Network error' };
    }
};

// Delete category
export const deleteCategory = async (category_id) => {
    try {
        const userId = getUserId();
        if (!userId) {
            return { status: 'error', message: 'Please login first' };
        }
        
        const response = await fetch(`${API_BASE_URL}/delete.php`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ 
                category_id,
                user_id: userId 
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting category:', error);
        return { status: 'error', message: 'Network error' };
    }
};