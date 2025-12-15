<script lang="ts">
    // 1. IMPORT THE CENTRALIZED USER STORE
    import { user } from '$lib/stores'; 
    import events from '$lib/stores';
</script>

<svelte:head>
    </svelte:head>

<div class="min-h-screen bg-gray-50 pb-10">

    <header class="bg-indigo-700 py-16 shadow-lg">
        <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl font-extrabold text-white sm:text-5xl text-center">
                📢 Announcements & Events
            </h1>
            <p class="mt-4 text-xl text-indigo-200 text-center max-w-3xl mx-auto">
                Stay updated with our latest events, workshops, and important announcements.
            </p>
        </div>
    </header>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <aside class="lg:col-span-1">
            <section class="sticky top-20 rounded-xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
                    Pinned Announcements
                </h3>
                <p class="text-gray-600">
                    *Placeholder for actual announcement content.* <br><br>
                    This is a great place for urgent notices, upcoming deadlines, or featured events.
                </p>
            </section>
        </aside>

        <main class="lg:col-span-2">
            
            {#if $user.user_data.admin} 
                <div class="flex justify-start mb-8">
                    <a 
                        href="/admin/events"
                        class="flex items-center space-x-2 px-6 py-2 bg-pink-600 text-white font-medium rounded-full shadow-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                        <span>Manage Events</span>
                    </a>
                </div>
            {/if}

            <div class="event-list space-y-6">
                {#if !$events || $events.length === 0}
                    <div class="text-center py-10 bg-white rounded-xl shadow-lg">
                        <p class="text-gray-500 text-lg">No events scheduled at the moment. Check back soon!</p>
                    </div>
                {/if}

                {#each $events as ev (ev.id)}
                    <a href="/events/{ev.id}" class="group block">
                        <div
                            class="rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-indigo-500"
                        >
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                                <h2 class="text-2xl font-extrabold text-indigo-800 transition-colors duration-300 group-hover:text-pink-600">
                                    {ev.name}
                                </h2>
                                <div class="mt-3 sm:mt-0">
                                    <p class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                                        📅 {ev.date}
                                    </p>
                                </div>
                            </div>

                            <hr class="my-4 border-gray-100" />
                            
                            <div class="flex flex-wrap gap-4 text-gray-600 text-sm">
                                <p class="flex items-center space-x-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                    </svg>
                                    <span>{ev.location}</span>
                                </p>
                                </div>
                            
                            <p class="mt-4 text-indigo-500 font-medium group-hover:text-pink-500 transition-colors duration-300">
                                View Details &rarr;
                            </p>

                        </div>
                    </a>
                {/each}
            </div>
        </main>
    </div>
</div>