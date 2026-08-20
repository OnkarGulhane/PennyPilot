import axiosClient from './axiosClient';

export const dashboardApi = {
  getSummary: () => axiosClient.get('/dashboard/summary'),
  getCategorySummary: () => axiosClient.get('/dashboard/category-summary'),
  getMonthlySummary: () => axiosClient.get('/dashboard/monthly-summary'),
};
