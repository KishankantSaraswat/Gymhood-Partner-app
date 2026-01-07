const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = {
    get: async (endpoint) => {
        const token = localStorage.getItem('gymshood_token');
        console.log(`🌐 API GET Request: ${BASE_URL}${endpoint}`);
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`❌ API Error (Non-JSON): ${response.status} ${response.statusText}`, text);
            throw new Error(`Server returned ${response.status} (${response.statusText}). Please check if API URL is correct.`);
        }

        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    post: async (endpoint, body) => {
        const token = localStorage.getItem('gymshood_token');
        console.log(`🌐 API POST Request: ${BASE_URL}${endpoint}`, body);
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(body)
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`❌ API Error (Non-JSON): ${response.status} ${response.statusText}`, text);
            throw new Error(`Server returned ${response.status} (${response.statusText}). Please check if API URL is correct.`);
        }

        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    put: async (endpoint, body) => {
        const token = localStorage.getItem('gymshood_token');
        console.log(`🌐 API PUT Request: ${BASE_URL}${endpoint}`, body);
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(body)
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`❌ API Error (Non-JSON): ${response.status} ${response.statusText}`, text);
            throw new Error(`Server returned ${response.status} (${response.statusText}). Please check if API URL is correct.`);
        }

        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    delete: async (endpoint) => {
        const token = localStorage.getItem('gymshood_token');
        console.log(`🌐 API DELETE Request: ${BASE_URL}${endpoint}`);
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`❌ API Error (Non-JSON): ${response.status} ${response.statusText}`, text);
            throw new Error(`Server returned ${response.status} (${response.statusText}). Please check if API URL is correct.`);
        }

        if (!response.ok) throw new Error(data.message || 'Something went wrong');
        return data;
    },
    upload: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        console.log(`🌐 API UPLOAD Request: ${BASE_URL}/upload`);
        // Use main backend URL for uploads
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`❌ API Error (Non-JSON): ${response.status} ${response.statusText}`, text);
            throw new Error(`Server returned ${response.status} (${response.statusText}). Please check if API URL is correct.`);
        }

        if (!response.ok) throw new Error(data.message || 'Upload failed');
        return data;
    }
};

export const getMediaUrl = (url) => {
    if (!url) return "";

    // If it's already a full URL that's NOT localhost:8000, return as is
    // This handles cases where we might have stored full external URLs in the past
    if (url.startsWith('http') && !url.includes('localhost:8000') && !url.includes('147.93.30.41')) {
        return url;
    }

    // Extract the path if it contains localhost:8000 or the old IP
    let path = url;
    if (url.includes('localhost:8000')) {
        path = url.split('localhost:8000')[1];
    } else if (url.includes('147.93.30.41')) {
        path = url.split('147.93.30.41')[1];
        // Handle cases where the IP might have stayed but port changed or path changed
        if (path.includes(':8000')) {
            path = path.split(':8000')[1];
        }
    }

    // Ensure path starts with /
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    // Combine with current BASE_URL from env
    // Ensure we don't have double slashes
    const cleanBaseUrl = BASE_URL.replace(/\/+$/, "");
    return `${cleanBaseUrl}${path}`;
};

const apiWrapper = {
    ...api,
    getMediaUrl
};

export default apiWrapper;
