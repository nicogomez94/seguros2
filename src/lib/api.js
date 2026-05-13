export async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || "Error de red");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const money = (value) => `$${Number(value || 0).toLocaleString("es-AR")}/mes`;
export const isDebug = import.meta.env.VITE_DEBUG === "true";
