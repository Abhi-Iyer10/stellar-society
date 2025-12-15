import { user } from '$lib/stores.js';
import { redirect } from '@sveltejs/kit';
import { log } from 'console';
export const load = async (event) => {

    const mockUser = {name:"admin" , role: "admin"};
    if (!mockUser) {
        throw redirect(302, '/login');
    }


    return {
        user:  mockUser
    };
};
