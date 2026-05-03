// ============================================================
// B-COM BELIZE — Admin API Service (Secured)
// ============================================================
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

const adminRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Request failed');
  }

  return response.json();
};

export const getAdminStats = () => adminRequest('/admin/stats');
export const getAdminReviews = () => adminRequest('/admin/reviews');
export const getAdminPayments = () => adminRequest('/admin/payments');
export const getAdminCustomers = () => adminRequest('/customers');
export const getAdminOrders = () => adminRequest('/orders');

export const updateOrderStatus = (id, status) =>
  adminRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });

export const approveReview = (id) =>
  adminRequest(`/reviews/${id}/approve`, { method: 'PUT' });

export const deleteReview = (id) =>
  adminRequest(`/reviews/${id}`, { method: 'DELETE' });

export const updateProduct = (id, data) =>
  adminRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const deleteProduct = (id) =>
  adminRequest(`/products/${id}`, { method: 'DELETE' });

export const addProduct = (data) =>
  adminRequest('/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export default adminRequest;