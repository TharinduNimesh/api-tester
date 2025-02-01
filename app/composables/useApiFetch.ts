import type { UseFetchOptions } from "nuxt/app";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export function useApiFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { accessToken, setAccessToken } = useAuth();

  const defaults: UseFetchOptions<T> = {
    key: url,
    headers: accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {},
    watch: false,
    async onResponseError({ response }) {
      // Check for new access token in response headers
      const newToken = response.headers.get('X-New-Access-Token');
      if (newToken) {
        setAccessToken(newToken);
      }
    },
    ...options,
  };

  if (import.meta.client) {
    defaults.headers = {
      ...defaults.headers,
      "client-platform": "browser",
    };
  }

  return useFetch(url, defaults);
}

export async function $apiFetch<T>(
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
) {
  const { accessToken, setAccessToken } = useAuth();

  const headers = {
    ...(accessToken.value
      ? { Authorization: `Bearer ${accessToken.value}` }
      : {}),
    ...(import.meta.client ? { "client-platform": "browser" } : {}),
    ...options.headers,
  };

  try {
    const response = await $fetch<T>(url, {
      ...options,
      headers,
    });

    // Check response headers for new access token
    if (import.meta.client && process.client) {
      const newToken = document.querySelector('meta[name="x-new-access-token"]')?.getAttribute('content');
      if (newToken) {
        setAccessToken(newToken);
        // Remove the meta tag after reading
        document.querySelector('meta[name="x-new-access-token"]')?.remove();
      }
    }

    return response;
  } catch (error: any) {
    // Check for new access token even in error responses
    if (import.meta.client && process.client) {
      const newToken = error.response?.headers?.get('X-New-Access-Token');
      if (newToken) {
        setAccessToken(newToken);
      }
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error?.response?._data?.message || error.message,
    });
  }
}
