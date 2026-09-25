import { handleLocalApi } from './localApi';

/**
 * Intercepts fetch requests to /api/ routes:
 * 1. Automatically attaches Bearer token if present.
 * 2. Attempts request against Express backend.
 * 3. Detects HTML SPA fallback (e.g. <!doctype html> from Vite/Vercel/Static server),
 *    405 Method Not Allowed (static server rejecting POST/PUT), 404, 50x, or non-JSON bodies.
 *    Whenever a non-JSON / proxy / static error occurs, immediately falls back to in-browser handleLocalApi.
 * 4. Ensures responses never throw "Unexpected token '<', <!doctype... is not valid JSON" or "Unexpected end of JSON input".
 */
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
      const token = localStorage.getItem('gate_auth_token');
      const modifiedInit: RequestInit = { ...(init || {}) };

      if (token) {
        const headers = new Headers(modifiedInit.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        modifiedInit.headers = headers;
      }

      // Try backend fetch first (works on localhost, LAN IP, or proxied servers)
      try {
        const res = await originalFetch(input, modifiedInit);

        // Check content-type: if HTML, the server served the SPA fallback page (e.g. index.html)
        const contentType = (res.headers.get('content-type') || '').toLowerCase();
        const isHtmlContentType =
          contentType.includes('text/html') ||
          contentType.includes('application/xhtml');

        // Check status codes indicating proxy failure, static server rejecting POST (405), or missing server endpoint
        const isProxyOrStaticError =
          res.status === 404 ||
          res.status === 405 ||
          res.status === 500 ||
          res.status === 501 ||
          res.status === 502 ||
          res.status === 503 ||
          res.status === 504 ||
          res.status === 0;

        if (isHtmlContentType || isProxyOrStaticError) {
          // Immediately route to in-browser localStorage implementation
          return handleLocalApi(urlString, modifiedInit);
        }

        // Peek body text to detect HTML disguise, empty body, or invalid non-JSON output
        try {
          const clone = res.clone();
          const text = await clone.text();
          const trimmed = text.trim();

          if (
            trimmed.startsWith('<') ||
            trimmed.toLowerCase().startsWith('<!doctype') ||
            trimmed.toLowerCase().startsWith('<html') ||
            (!res.ok && trimmed.length === 0)
          ) {
            // HTML document or empty error detected! Fall back to local store
            return handleLocalApi(urlString, modifiedInit);
          }

          // Verify body is parseable JSON before returning
          try {
            JSON.parse(trimmed);
          } catch {
            // Server did not return valid JSON! Fall back to local store
            return handleLocalApi(urlString, modifiedInit);
          }
        } catch {
          // If clone text read fails, fall back to local store
          return handleLocalApi(urlString, modifiedInit);
        }

        // Cross-Sync: If login returned 401 on backend, check if this user exists in localStorage
        // (e.g. registered while offline, on mobile LAN, or before a git pull). If so, auto-sync to backend!
        if (res.status === 401 && urlString.includes('/api/auth/login') && modifiedInit.body) {
          try {
            const body = JSON.parse(modifiedInit.body as string);
            const localUsers = JSON.parse(localStorage.getItem('gate_users') || '[]');
            const cleanUsername = (body.username || '').trim().toLowerCase();
            const localUser = localUsers.find(
              (u: any) => u.username.toLowerCase() === cleanUsername && u.password === body.password
            );
            if (localUser) {
              // Auto-register to backend to sync credentials
              const regRes = await originalFetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: localUser.username,
                  password: body.password,
                  email: localUser.email,
                  migrateGuestProgress: false,
                }),
              });
              if (regRes.ok) {
                const regData = await regRes.clone().json();
                if (regData.token) {
                  localStorage.setItem('gate_auth_token', regData.token);
                }
                return regRes;
              }
            }
          } catch {
            // Ignore and return original res
          }
        }

        // Cross-Sync: If register or reset-password succeeded on backend, mirror user credentials
        // in localStorage so offline and local fallback always has the account!
        if (
          (res.status === 200 || res.status === 201) &&
          (urlString.includes('/api/auth/register') || urlString.includes('/api/auth/reset-password')) &&
          modifiedInit.body
        ) {
          try {
            const body = JSON.parse(modifiedInit.body as string);
            const localUsers = JSON.parse(localStorage.getItem('gate_users') || '[]');
            const cleanUsername = (body.username || '').trim();
            const password = body.password || body.newPassword;
            const existingIdx = localUsers.findIndex(
              (u: any) => u.username.toLowerCase() === cleanUsername.toLowerCase()
            );
            if (existingIdx >= 0) {
              localUsers[existingIdx].password = password;
              if (body.email) localUsers[existingIdx].email = body.email;
            } else {
              localUsers.push({
                id: `usr_${Date.now()}`,
                username: cleanUsername,
                email: body.email || null,
                password: password,
                created_at: new Date().toISOString(),
              });
            }
            localStorage.setItem('gate_users', JSON.stringify(localUsers));
          } catch {
            // Ignore
          }
        }

        return res;
      } catch {
        // Network failure / offline: fall back to local browser storage
      }

      // Handle in-browser via localApi (offline, Vercel, or standalone)
      return handleLocalApi(urlString, modifiedInit);
    }

    return originalFetch(input, init);
  };
}
