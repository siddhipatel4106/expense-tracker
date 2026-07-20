// Simple API helper
const API_BASE_URL = "http://localhost/expense_tracker/backend/api";

const api = {
  // GET request
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  },
  
  // POST request
  post: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  },
  
  // PUT request
  put: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  },
  
  // DELETE request
  delete: async (endpoint) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    return response.json();
  }
};

export default api;