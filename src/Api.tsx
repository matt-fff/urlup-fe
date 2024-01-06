const apiKey = process.env.REACT_APP_API_KEY ?? "";
const baseHeaders = {
  "Content-Type": "application/json",
  "x-api-key": apiKey,
};

export async function createUrl(url: string) {
  const response = await fetch("/shorten", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function getUrl(url: string) {
  const response = await fetch("/redirect", {
    method: "POST",
    headers: baseHeaders,
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}
