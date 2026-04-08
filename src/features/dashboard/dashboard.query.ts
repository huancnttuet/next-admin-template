import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from './dashboard.api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: getDashboardData,
  });
};
