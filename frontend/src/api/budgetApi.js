import axiosClient from './axiosClient';

export const budgetApi = {
  getBudgets: () => axiosClient.get('/budgets'),
  getBudgetById: (id) => axiosClient.get(`/budgets/${id}`),
  createBudget: (data) => axiosClient.post('/budgets', data),
  updateBudget: (id, data) => axiosClient.put(`/budgets/${id}`, data),
  deleteBudget: (id) => axiosClient.delete(`/budgets/${id}`),
};
