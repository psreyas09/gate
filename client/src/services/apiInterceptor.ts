import { handleLocalApi } from './localApi';

export function installApiInterceptor() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString =
      typeof input === 'string'
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;

    // Only intercept /api/ routes
    if (urlString.startsWith('/api/') || urlString.includes('/api/')) {
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        try {
          const res = await originalFetch(input, init);
          // If the Express server answered with valid status (not 404 or server gateway error)
          if (res.status !== 404 && res.status !== 502 && res.status !== 503) {
            return res;
          }
        } catch {
          // If local Express server is not running, seamlessly fall back to local browser storage
        }
      }

      // Handle in-browser via localApi (Vercel, offline, or standalone)
      return handleLocalApi(urlString, init);
    }

    return originalFetch(input, init);
  };
}
