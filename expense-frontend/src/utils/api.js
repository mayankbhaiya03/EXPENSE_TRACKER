const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://expense-tracker-t1l2.onrender.com";

function buildUrl(path = "") {
    const base = String(API_BASE).replace(/\/+$/, "");
    const p = path ? (path.startsWith("/") ? path : `/${path}`) : "";
    return `${base}${p}`;
}

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const res = await fetch(buildUrl(path), {
        ...options,
        headers
    });

    const text = await res.text();
    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const message =
            (data && data.message) ||
            (typeof data === "string" && data) ||
            "API Error";

        const err = new Error(message);
        err.status = res.status;
        err.response = data;
        throw err;
    }

    return data;
}
