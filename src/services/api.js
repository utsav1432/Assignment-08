import axios from 'axios';

const API_URL = 'https://todo-backend.onrender.com/api/tasks';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllTasks = async () => {
  const response = await api.get('/');
  return response.data;
};

export const createTask = async (title, description = '') => {
  const response = await api.post('/', {
    data: { title, description, completed: false }
  });
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await api.put(`/${id}`, { data: updates});
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const toggleComplete = async (id, currentStatus) => {
  const response = await axios.put(`${API_URL}/${id}/toggle`);
  return response.data;
};

export default api;