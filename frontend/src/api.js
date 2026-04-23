export const API_BASE_URL = "https://social-graph-nexus.onrender.com";

export async function fetchFromApi(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error);
    return null;
  }
}
