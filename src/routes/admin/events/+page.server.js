import { get } from 'svelte/store';
import { user } from '$lib/stores'; // Your centralized user store
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load() {
  // Check the admin status from the store
  const isAdmin = get(user).user_data.admin;
  
  // If not admin, redirect them immediately.
  if (!isAdmin) {
    throw redirect(302, '/events'); 
  }
  
  return {};
}