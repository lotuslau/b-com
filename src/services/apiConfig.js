const normalizeApiBaseUrl = (value) => {
  const input = (value || 'http://localhost:3001/api').trim();

  if (!input) {
    return 'http://localhost:3001/api';
  }

  const withoutTrailingSlash = input.replace(/\/+$/, '');
  return /\/api$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

export const getApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
