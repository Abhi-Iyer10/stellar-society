import type { PageLoad } from './$types';
import events from '$lib/stores'; // Your store
import { get } from 'svelte/store'; // Helper to read from a store

export const load: PageLoad = ({ params }) => {
    // 'params.id' comes from the folder name [id]
    const eventId = params.id;

    // Get the current list of events from your store
    const allEvents = get(events);

    // Find the specific event
    const event = allEvents.find(e => e.id === eventId);

    // Pass the found event as a prop to the page
    return {
        event: event
    };
    // SvelteKit will automatically make this available
    // to +page.svelte through the 'data' prop
};