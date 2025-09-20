import { writable, type Writable } from 'svelte/store';
import type { User } from './types';

export const user = writable<User>({
    "user_data":{
        "email":"", username:"", admin:false
    },
    "user_events":[
    ]
})
export const invalidate = writable<boolean>(false);
export const loggedIn = writable<boolean>(false);
export const access_token = writable<string|null>(null);
