export const API_URL = 'http://localhost:8080';

export const getAuthHeaders = (username?: string, password?: string) => {
  if (username && password) {
    return {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json',
    };
  }
  // Try to get from localStorage if not provided
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  if (storedUser) {
    const { username, password } = JSON.parse(storedUser);
    return {
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

export const fetcher = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Something went wrong');
  }

  return res.json();
};
