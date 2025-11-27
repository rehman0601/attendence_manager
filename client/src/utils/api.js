export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return response;
};
