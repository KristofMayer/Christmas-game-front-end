const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  let body = options.body;
  const isPlainObjectBody =
    body && typeof body === "object" && !(body instanceof FormData);

  if (isPlainObjectBody) {
    body = JSON.stringify(body);
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, { ...options, headers, body });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && data.error) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
