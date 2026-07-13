// src/services/api.js
import { API_BASE_URL } from './apiConfig';

const BASE_URL = API_BASE_URL;

async function request(endpoint, options = {}) {
  const { headers, ...fetchOptions } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `API error: ${response.status}`);
  }

  return data;
}

export const getProducts = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return request(`/products${params ? '?' + params : ''}`);
};

export const getProduct = (id) => request(`/products/${id}`);

//Orders
export const createOrder = (orderData, token) =>
  request('/orders', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  // Reviews
export const getReviews = (productId) =>
  request(`/reviews/${productId}`);

export const submitReview = (reviewData) =>
  request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });

export const markHelpful = (reviewId) =>
  request(`/reviews/${reviewId}/helpful`, {
    method: 'PUT',
  });
