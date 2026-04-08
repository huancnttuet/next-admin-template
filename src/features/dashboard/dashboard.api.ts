import axios from 'axios';
import { DashboardData } from './dashboard.type';

export const getDashboardData = async () => {
  const { data } = await axios.get<DashboardData>('/api/dashboard/summary');
  return data;
};
