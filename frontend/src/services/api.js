import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export function handleApiError(error) {
  if (error.response) {
    return { message: error.response.data?.error || 'Request failed', status: error.response.status };
  }
  if (error.request) {
    return { message: 'No response from server', status: 0 };
  }
  return { message: error.message || 'Unexpected error', status: 0 };
}


