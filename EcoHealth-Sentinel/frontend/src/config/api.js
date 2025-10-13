// frontend/src/config/api.js (new file banayein)
export const API_CONFIG = {
  NODE_API: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  PYTHON_API: process.env.REACT_APP_PYTHON_API_URL || 'http://localhost:8000/api',
  FRONTEND_URL: 'http://localhost:3000'
};

export default API_CONFIG;
