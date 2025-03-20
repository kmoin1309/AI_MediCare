export const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

export const isValidToken = () => {
  const token = localStorage.getItem('token');
  return token && token.length > 0;
};
