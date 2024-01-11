const apiKey = import.meta.env.VITE_API_KEY ?? "";
const baseHeaders = {
  "Content-Type": "application/json",
  "x-api-key": apiKey,
};

export async function createUrl(url: string) {
  const response = await fetch("/app/create", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function getUrl(shortcode: string) {
  const response = await fetch("/app/get", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ shortcode }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function redirect(shortcode: string): Promise<string | null> {
  const response = await fetch("/app/redirect", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ shortcode }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.headers.get("Location");
}
