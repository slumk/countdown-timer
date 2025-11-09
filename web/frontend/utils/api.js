export async function apiRequest(path, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  return response.json();
}
