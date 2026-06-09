const API_BASE = "/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
    console.error(`[API Error] ${status}: ${message}`);
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const storedToken = token || localStorage.getItem("ats-genius-token");

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  // Only set Content-Type for non-FormData requests
  if (!(rest.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (storedToken) {
    headers["Authorization"] = `Bearer ${storedToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!res.ok) {
    // Try to extract error message from response
    let errorMessage = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      errorMessage = data.error || errorMessage;
    } catch {
      // Response body isn't JSON
    }

    // Auto-logout on 401
    if (res.status === 401) {
      localStorage.removeItem("ats-genius-token");
      localStorage.removeItem("ats-genius-user");
      window.location.href = "/auth";
    }

    throw new ApiError(res.status, errorMessage);
  }

  return res.json();
}
