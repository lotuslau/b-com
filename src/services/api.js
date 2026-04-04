// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export const getProducts = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return request(`/products${params ? '?' + params : ''}`);
};

export const getProduct = (id) => request(`/products/${id}`);

//Orders
export const createOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
export const getOrder = (ref) => request(`/orders/${ref}`);
//Auth
export const registerCustomer = (data) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const loginCustomer = (data) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Payments
export const initiatePayment = (paymentData) =>
  request('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });

// Sellers
export const registerSeller = (data) =>
  request('/sellers/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const createPayPalOrder = (amount) =>
  request('/payments/paypal/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });