const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = {
    get: async (endpoint) => {
        const token = localStorage.getItem('gymshood_token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    post: async (endpoint, body) => {
        const token = localStorage.getItem('gymshood_token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    put: async (endpoint, body) => {
        const token = localStorage.getItem('gymshood_token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    delete: async (endpoint) => {
        const token = localStorage.getItem('gymshood_token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    upload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Use main backend URL for uploads
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Upload failed');
        return data;
    }
};

export const getMediaUrl = (url) => {
    if (!url) return "";

    // If it's already a full URL but not to localhost, return as is
    if (url.startsWith('http') && !url.includes('localhost:8000')) {
        return url;
    }

    // Extract the path if it's a localhost URL
    let path = url;
    if (url.includes('localhost:8000')) {
        path = url.split('localhost:8000')[1];
    }

    // Ensure path starts with /
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    // Combine with current BASE_URL from env
    return `${BASE_URL}${path}`;
};

const apiWrapper = {
    ...api,
    getMediaUrl
};

export default apiWrapper;
