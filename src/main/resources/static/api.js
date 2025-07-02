const API_BASE_URL = 'http://localhost:8080/api';

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // for cookies if using session management
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
}

export default {
    // Property related methods
    getProperties: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return fetchAPI(`/properties?${queryParams}`);
    },
    getPropertyById: (id) => fetchAPI(`/properties/${id}`),
    createProperty: (property) => fetchAPI('/properties', 'POST', properties),
    updateProperty: (id, property) => fetchAPI(`/properties/${id}`, 'PUT', properties),
    deleteProperty: (id) => fetchAPI(`/properties/${id}`, 'DELETE'),

    // Broker related methods (you'll need to implement these endpoints in your backend)
    getBrokers: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return fetchAPI(`/brokers?${queryParams}`);
    },
    
    // Authentication methods
    login: (credentials) => fetchAPI('/auth/login', 'POST', credentials),
    register: (userData) => fetchAPI('/auth/register', 'POST', userData),
    logout: () => fetchAPI('/auth/logout', 'POST'),
    getCurrentUser: () => fetchAPI('/auth/me')
};