import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';
import { ApiEndpoints, type ApiEndpointKey } from '@/configs/endpoints';
import { AppRoutes } from '@/configs/routes';

/**
 * Attach common interceptors to an Axios instance.
 */
function applyInterceptors(instance: AxiosInstance): AxiosInstance {
  instance.interceptors.request.use((config) => {
    // Token will be attached by the interceptor when needed
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized — redirect to sign in
        if (typeof window !== 'undefined') {
          window.location.href = AppRoutes.SignIn;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

/**
 * Create an Axios client for a specific API endpoint.
 *
 * @param baseURL  - Either an `ApiEndpointKey` (e.g. `'main'`) or a raw URL string
 * @param overrides - Optional Axios config overrides
 *
 * @example
 * ```ts
 * // Using a key from ApiEndpoints
 * const mediaClient = createApiClient('media')
 *
 * // Using a raw URL
 * const custom = createApiClient('https://custom-api.example.com')
 * ```
 */
export function createApiClient(
  baseURL: ApiEndpointKey | (string & {}),
  overrides?: Omit<CreateAxiosDefaults, 'baseURL'>,
): AxiosInstance {
  const resolvedURL =
    baseURL in ApiEndpoints ? ApiEndpoints[baseURL as ApiEndpointKey] : baseURL;

  const instance = axios.create({
    baseURL: resolvedURL,
    headers: { 'Content-Type': 'application/json' },
    ...overrides,
  });

  return applyInterceptors(instance);
}

/**
 * Default API client pointing to the primary backend (`ApiEndpoints.main`).
 *
 * Import this for quick, single-API usage:
 * ```ts
 * import apiClient from '@/lib/api-client'
 * ```
 */
const apiClient = createApiClient('main');

export default apiClient;
