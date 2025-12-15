import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// --- Type Imports ---
import type { User as AuthUser } from './types';
import type { event } from '$lib/types';

export type LeaderboardUser = {
  email: string;
  username: string;
  points: number;
};

export const user = writable<AuthUser>({
  "user_data": {
    "email": "", "username": "", "admin": true
  },
  "user_events": []
});


/**
 * Updates the user's admin status.
 * @param isAdmin - A boolean indicating the new admin status.
 */
export function setAdminStatus(isAdmin: boolean) {
  user.update(currentUser => {
    return {
      ...currentUser,
      user_data: {
        ...currentUser.user_data,
        admin: isAdmin
      }
    };
  });
}

/**
 * Logs out the user by resetting all state related to authentication.
 */
export function logoutUser() {
  user.set({
    "user_data": { "email": "", "username": "", "admin": false },
    "user_events": []
  });
  loggedIn.set(false);
  access_token.set(null);
  // Optionally, remove tokens from localStorage/cookies here
}
export const invalidate = writable<boolean>(false);
export const loggedIn = writable<boolean>(false);
export const access_token = writable<string | null>(null);

const EVENTS_STORAGE_KEY = 'my-club-events';

const storedEventsValue = browser ? window.localStorage.getItem(EVENTS_STORAGE_KEY) : null;
const initialEvents: Event[] = storedEventsValue ? JSON.parse(storedEventsValue) : [];

const events: Writable<Event[]> = writable(initialEvents);

if (browser) {
  events.subscribe((currentEvents) => {
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(currentEvents));
  });
}

export default events;

const USERS_STORAGE_KEY = 'astro-club-leaderboard';

const storedUsers = browser ? window.localStorage.getItem(USERS_STORAGE_KEY) : null;
const initialUsers: LeaderboardUser[] = storedUsers ? JSON.parse(storedUsers) : [];

export const users: Writable<LeaderboardUser[]> = writable(initialUsers);

if (browser) {
  users.subscribe((currentUsers) => {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(currentUsers));
  });
}

// --- Leaderboard Functions ---

/**
 * Adds a new user to the leaderboard, checking for duplicates.
 * @param newUser - The user object to add (must have email, username, points)
 */
// FIX: Using the new 'LeaderboardUser' type
export function addUser(newUser: LeaderboardUser) {
  users.update((existing) => {
    const alreadyExists = existing.some(u => u.email === newUser.email);
    if (alreadyExists) {
      console.warn(`User ${newUser.email} already exists in the leaderboard.`);
      return existing; // Don't add if email already exists
    }
    return [...existing, newUser];
  });
}

/**
 * Updates the points for a user identified by their email.
 * @param email - The email of the user to update
 * @param pointsToAdd - The number of points to add (can be negative)
 */
export function updatePoints(email: string, pointsToAdd: number) {
  users.update((existing) => {
    return existing.map((u) =>
      u.email === email ? { ...u, points: u.points + pointsToAdd } : u
    );
  });
}

export function resetLeaderboard() {
  users.set([]);
  if (browser) window.localStorage.removeItem(USERS_STORAGE_KEY);
}