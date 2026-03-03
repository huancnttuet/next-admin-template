import axios, { type AxiosInstance } from 'axios';
import { AppRoutes } from '@/configs/routes';
import { getErrorMessage } from './api-error';
import { toast } from 'sonner';

/**
 * Authenticated proxy client.
 *
 * Routes all requests through `/api/proxy/[...path]` which injects
 * the session `accessToken` server-side before forwarding to the backend.
 *
 * Use this instead of `apiClient` for endpoints that require authentication.
 *
 * @example
 * ```ts
 * // GET /api/proxy/users/paged-list?Page=1&PageSize=10
 * proxyClient.get('/users/paged-list', { params: { Page: 1, PageSize: 10 } })
 * ```
 */
function createProxyClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: '/api/proxy',
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        const message = getErrorMessage(error);
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred.');
      }

      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = AppRoutes.SignIn;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

const proxyClient = createProxyClient();

export default proxyClient;
