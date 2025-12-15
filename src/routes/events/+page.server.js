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


export const actions = {

  addEvent: async ({ request }) => {

    const formData = await request.formData();
    const eventTitle = formData.get('title');

    console.log(`Server-side: Adding event titled "${eventTitle}" to the database...`);
    // await db.collection('events').insertOne({ title: eventTitle, date: new Date() });
    return { success: true, message: 'Event added successfully!' };
  }
};