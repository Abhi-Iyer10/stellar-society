<script lang="ts">
    // --- Store and Type Imports ---
    import { user } from '$lib/stores'; 
    import events from '$lib/stores'; 
    import type { event as EventType } from '$lib/types'; 
    import { authenticatedFetch } from '$lib/api'; // The secure API wrapper

    type MyEvent = EventType;
    
   
    let showModal = false;
    let imageSrc = ''; 
    let imageName = '';
    let fileInput: HTMLInputElement;
    let date = ''; 
    let time = ''; 
    let formattedDateTime = ''; 
    let isSubmitting = false; 

 
    const openModal = () => (showModal = true);
    const closeModal = () => {
        showModal = false;

        imageSrc = '';
        imageName = '';
        if (fileInput) fileInput.value = '';
        date = '';
        time = '';
    };

    // --- Utility Functions ---

    // Convert 24-hour time to 12-hour (AM/PM)
    function convertTo12Hour(time24: string) {
        if (!time24) return '';
        let [hours, minutes] = time24.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; 
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    // Reactively update the formatted date/time preview
    $: if (date && time) {
        const dateTimeString = `${date}T${time}`;
        const eventDate = new Date(dateTimeString);

        if (!isNaN(eventDate.getTime())) {
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
            formattedDateTime = `${formattedDate}, ${convertTo12Hour(time)}`;
        } else {
            formattedDateTime = '';
        }
    } else {
        formattedDateTime = '';
    }

    // --- Image Handling ---

    function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { imageSrc = e.target?.result as string; };
            reader.readAsDataURL(file);
            imageName = file.name;
        }
    }
    
    function deleteImage() {
        imageSrc = '';
        imageName = '';
        if (fileInput) fileInput.value = '';
    }
    
    // --- Core Admin Logic (Replaced Local Store Update with API Calls) ---

    async function handleAddEvent(submitEvent: SubmitEvent) {
        if (isSubmitting) return;
        isSubmitting = true;

        const formEl = submitEvent.target as HTMLFormElement;
        const formData = new FormData(formEl);

        const rawDate = formData.get('date') as string;
        const rawTime = formData.get('time') as string;
        const dateTimeString = `${rawDate}T${rawTime}`;
        const eventDate = new Date(dateTimeString);

        if (isNaN(eventDate.getTime())) {
            alert('Please select a valid date and time.');
            isSubmitting = false;
            return;
        }

        const newEventData = {
            name: formData.get('title') as string,
            about: formData.get('description') as string,
            image: imageSrc || '', 
            date: formattedDateTime, 
            location: formData.get('location') as string,
            time: rawTime,
        };

        try {
            const savedEvent = await authenticatedFetch('/admin/events', {
                method: 'POST',
                body: JSON.stringify(newEventData)
            });

            events.update((currentEvents) => [...currentEvents, savedEvent as MyEvent]);
            
            closeModal();
            formEl.reset();
            
        } catch (error) {
            console.error('Failed to create event:', error);
            alert(`Error creating event. Check permissions. (${(error as Error).message})`);
        } finally {
            isSubmitting = false;
        }
    }

    async function handleRemoveEvent(eventId: string) {
        if (!confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) return;
        
        try {
            await authenticatedFetch(`/admin/events/${eventId}`, {
                method: 'DELETE',
            });

            events.update((currentEvents) => currentEvents.filter((ev) => ev.id !== eventId));

        } catch (error) {
            console.error('Failed to remove event:', error);
            alert(`Error deleting event. Check permissions. (${(error as Error).message})`);
        }
    }

</script>

<svelte:head>
    </svelte:head>

<div class="min-h-screen bg-gray-50 pb-12">

    <header class="bg-white shadow-md border-b border-gray-200 py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900 text-center sm:text-left">
                🛠️ Event Management Panel
            </h1>
            <p class="mt-1 text-lg text-gray-500 text-center sm:text-left">
                Control center for creating, updating, and removing community events.
            </p>
        </div>
    </header>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <aside class="lg:col-span-1">
            <section class="sticky top-20 rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-700 border-b pb-3 mb-4">
                    Admin Dashboard Info
                </h3>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li>**Total Events:** {$events.length}</li>
                    <li>**Active User:** {$user.user_data?.email || 'N/A'}</li>
                </ul>
            </section>
        </aside>

        <main class="lg:col-span-3">
            
            <div class="flex justify-end mb-6">
                <button
                    on:click={openModal}
                    class="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    <span>Add New Event</span>
                </button>
            </div>

            <div class="event-list space-y-4">
                {#if $events.length === 0}
                    <div class="text-center py-10 bg-white rounded-xl shadow-lg">
                        <p class="text-gray-500 text-lg">No events found. Click "Add New Event" to begin.</p>
                    </div>
                {/if}

                {#each $events as ev (ev.id)}
                    <div
                        class="group bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
                    >
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                            <h2 class="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                                {ev.name}
                            </h2>
                            <p class="mt-2 sm:mt-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                                {ev.date}
                            </p>
                        </div>
                        
                        <div class="mt-2 text-sm text-gray-500 flex justify-between items-center">
                            <span>Location: **{ev.location}**</span>
                            
                            <div class="flex gap-3">
                                <button
                                    on:click|stopPropagation={() => alert('Edit functionality to be implemented for event: ' + ev.name)}
                                    class="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                
                                <button
                                    on:click|stopPropagation={() => handleRemoveEvent(ev.id)}
                                    class="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
                                    </svg>
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </main>
    </div>
</div>


{#if showModal}
    <div 
        class="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 transition-opacity"
        on:click={closeModal}
    >
        <div 
            class="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all"
            on:click|stopPropagation
        >
            <h2 class="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">Add a New Event</h2>

            <form
                class="flex flex-col gap-y-4"
                on:submit|preventDefault={handleAddEvent}
            >
                <input 
                    class="w-full rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800" 
                    name="title" 
                    type="text" 
                    placeholder="Event Title (e.g., Annual Star Party)" 
                    required 
                />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label class="block text-sm font-medium text-gray-700">
                        Event Date:
                        <input 
                            name="date" 
                            type="date" 
                            bind:value={date} 
                            class="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500" 
                            required
                        />
                    </label>
                    <label class="block text-sm font-medium text-gray-700">
                        Event Time:
                        <input 
                            name="time" 
                            type="time" 
                            bind:value={time} 
                            class="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500" 
                            required
                        />
                    </label>
                </div>
                
                {#if formattedDateTime}
                    <div class="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 font-medium">
                        <p class="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                            </svg>
                            <span>**Scheduled:** {formattedDateTime}</span>
                        </p>
                    </div>
                {/if}

                <textarea 
                    class="w-full h-28 rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 resize-y" 
                    placeholder="Detailed Description of the event..." 
                    name="description"
                    required
                ></textarea>

                <input 
                    class="w-full rounded-lg border border-gray-300 p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800" 
                    type="text" 
                    name="location" 
                    placeholder="Event Location (e.g., Main Observatory, Zoom link)" 
                    required 
                />

                <div class="border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50">
                    <div class="flex items-center justify-between">
                        
                        <label for="fileInput" class="flex-grow flex items-center cursor-pointer">
                            <input
                                bind:this={fileInput}
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                on:change={handleImageUpload}
                                class="hidden"
                            />
                            
                            {#if imageSrc}
                                <img src={imageSrc} alt="Event Preview" class="h-12 w-12 rounded-lg object-cover shadow-sm mr-3" />
                                <span class="text-sm font-medium text-gray-700 truncate">{imageName}</span>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-2-2l-1.586-1.586a2 2 0 00-2.828 0L7 18m2-2h2.086a1 1 0 00.707-.293l3.586-3.586a1 1 0 000-1.414L10.414 7.293A1 1 0 009.707 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3.586a1 1 0 00-.707.293L11.707 11.586A1 1 0 0111 12.293V14z" />
                                </svg>
                                <span class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                    Upload Event Banner Image
                                </span>
                            {/if}
                        </label>

                        {#if imageSrc}
                            <button
                                type="button"
                                on:click={deleteImage}
                                class="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-100 transition-colors"
                                title="Delete Image"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        {/if}
                    </div>
                </div>

                <div class="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        on:click={closeModal}
                        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >Cancel</button
                    >
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {#if isSubmitting}
                            Saving Event...
                        {:else}
                            Save Event
                        {/if}
                    </button>
                </div>
            </form>

        </div>
    </div>
{/if}

<style lang="css">

</style>