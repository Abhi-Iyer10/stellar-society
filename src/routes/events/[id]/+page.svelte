<script lang="ts">
    export let data;
    import type { event as EventType } from '$lib/types';
    const { event } = data; 
</script>

{#if event}
    <a href="/events">&larr; Back to all events</a>

    <h1>{event.name}</h1>
    <p><strong>Date:</strong> {event.date}</p>
    <p><strong>Location:</strong> {event.location}</p>
    {console.log("hello",event.image)}
    <img src={event.image} alt="{event.name} banner, url:{event.image}" />
    <!-- <p>{event.image}</p> -->
    <p>{event.about}</p>

    {:else}
    <h1>Event not found</h1>
    <p>We couldn't find an event with this ID.</p>
    <a href="/events">Go back to all events</a>
{/if}

<style>
    img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
    }
</style>