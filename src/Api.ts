interface ShortUrl {
  url: string;
  short: string;
  clicks: number;
  created_at: string;
}

const API_URI = import.meta.env.DEV ? "/app" : import.meta.env.VITE_API_URI;
const API_KEY = import.meta.env.VITE_API_KEY ?? "";
const HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function createUrl(url: string): Promise<ShortUrl> {
  if (!url) {
    throw new Error("URL cannot be blank");
  }

  const response = await fetch(`${API_URI}/create`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function getUrl(shortcode: string): Promise<ShortUrl> {
  const response = await fetch(`${API_URI}/get`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ shortcode }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function redirect(shortcode: string): Promise<string | null> {
  const response = await fetch(`${API_URI}/redirect`, {
    method: "GET",
    headers: HEADERS,
    body: JSON.stringify({ shortcode }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.headers.get("Location");
}
