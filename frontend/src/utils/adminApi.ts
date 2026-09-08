const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAdminToken = () => {
  return (
    localStorage.getItem('kisansetu_admin_token') ||
    localStorage.getItem('adminToken') ||
    localStorage.getItem('admin_token') ||
    localStorage.getItem('token')
  );
};

export const adminFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAdminToken();

  const headers = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong'
    );
  }

  return data;
};