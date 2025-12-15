import { get } from 'svelte/store'; 
import { access_token } from '$lib/stores'; 

/**
 * Executes an authenticated API request.
 */
export async function authenticatedFetch(endpoint, options = {}) {
  const token = get(access_token);
  if (!token) throw new Error("Unauthorized: No token available.");
  
  const response = await fetch(`YOUR_BASE_URL${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  // CRITICAL STEP: Handle security errors from the backend
  if (response.status === 401 || response.status === 403) {
    console.error(`Access Denied to ${endpoint}. Status: ${response.status}`);
    // You could optionally redirect to login or show an error toast here.
    throw new Error("Permission Denied by Server."); // Stop the calling function
  }
  
  if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}