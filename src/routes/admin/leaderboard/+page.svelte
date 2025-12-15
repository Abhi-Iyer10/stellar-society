<script lang="ts">
    import { derived } from 'svelte/store';
    import { users, addUser, updatePoints, resetLeaderboard, user as userStore } from '$lib/stores'; 
    import type { LeaderboardUser } from '$lib/stores';
    import { authenticatedFetch } from '$lib/api';

 
    let isAdmin = $userStore.user_data.admin;

    $: isAdmin = $userStore.user_data.admin;


    const sortedUsers = derived(users, ($users) => $users.sort((a, b) => b.points - a.points));

    // --- State Variables (Admin-Only) ---
    let newUsername: string = '';
    let newUserEmail: string = '';
    let updateUserEmail: string = '';
    let pointsToAdd: number = 10;
    let showResetConfirm = false;
    let addUserError: string | null = null;
    let updatePointsError: string | null = null;
    let serverMessage: string | null = null; // For API response feedback
    let isAddingUser = false;
    let isUpdatingPoints = false;


    // --- Admin Logic Functions ---


    async function handleAddUser() {
        if (isAddingUser) return;
        isAddingUser = true;
        addUserError = null;
        serverMessage = null;

        if (!newUsername || !newUserEmail) {
            addUserError = 'Please enter a username and email.';
            setTimeout(() => { addUserError = null; }, 3000);
            isAddingUser = false;
            return;
        }

        const newUser: LeaderboardUser = {
            email: newUserEmail,
            username: newUsername,
            points: 0,
            // Assuming an ID is generated on the server or in the store implementation
            id: crypto.randomUUID(), 
        };

        try {
            // Replace local store update with API call later:
            // const apiResponse = await authenticatedFetch('/admin/leaderboard/user', { method: 'POST', body: JSON.stringify(newUser) });
            addUser(newUser); // Keeping local store for front-end dev for now
            serverMessage = `User ${newUsername} added successfully!`;
            newUsername = '';
            newUserEmail = '';
        } catch (error) {
            serverMessage = `Failed to add user: ${(error as Error).message}`;
        } finally {
            isAddingUser = false;
            setTimeout(() => { serverMessage = null; }, 5000);
        }
    }

    async function handleUpdatePoints() {
        if (isUpdatingPoints) return;
        isUpdatingPoints = true;
        updatePointsError = null;
        serverMessage = null;
        
        if (!updateUserEmail) {
            updatePointsError = 'Please enter an email to update.';
            setTimeout(() => { updatePointsError = null; }, 3000);
            isUpdatingPoints = false;
            return;
        }

        try {
            // Replace local store update with API call later:
            // const apiResponse = await authenticatedFetch('/admin/leaderboard/points', { method: 'PATCH', body: JSON.stringify({ email: updateUserEmail, points: pointsToAdd }) });
            updatePoints(updateUserEmail, Number(pointsToAdd)); // Keeping local store for front-end dev for now
            serverMessage = `Points updated for ${updateUserEmail}. (+${pointsToAdd} pts)`;
            updateUserEmail = '';
            pointsToAdd = 10;
        } catch (error) {
            serverMessage = `Failed to update points: ${(error as Error).message}`;
        } finally {
            isUpdatingPoints = false;
            setTimeout(() => { serverMessage = null; }, 5000);
        }
    }

    async function handleReset() {
        showResetConfirm = false;
        serverMessage = null;

        try {
            // Replace local store update with API call later:
            // await authenticatedFetch('/admin/leaderboard/reset', { method: 'DELETE' });
            resetLeaderboard(); // Keeping local store for front-end dev for now
            serverMessage = 'Leaderboard successfully reset.';
        } catch (error) {
            serverMessage = `Failed to reset leaderboard: ${(error as Error).message}`;
        } finally {
            setTimeout(() => { serverMessage = null; }, 5000);
        }
    }
</script>

<div class="min-h-screen bg-gray-950 p-4 sm:p-8">
    <div
        class="mx-auto w-full max-w-4xl rounded-3xl bg-gray-900 border border-indigo-900/50 p-6 text-white shadow-2xl shadow-indigo-900/20 md:p-8 lg:p-10"
    >
        <header class="mb-8 border-b border-gray-800 pb-4">
            <h2 class="text-center text-4xl font-extrabold text-teal-400 tracking-wider">
                🏆 Admin Leaderboard Portal
            </h2>
            <p class="text-center text-gray-400 mt-2">Manage user data and points leaderboard for the club.</p>
        </header>
        
        {#if serverMessage}
            <div class="mb-6 rounded-lg bg-green-900/70 p-4 text-center text-base font-medium text-green-300 shadow-inner">
                {serverMessage}
            </div>
        {/if}

        <div class="space-y-4">
            <h3 class="text-2xl font-semibold text-gray-300 mb-4">Current Rankings ({$sortedUsers.length} Users)</h3>

            {#if $sortedUsers.length === 0}
                <div class="py-12 text-center text-gray-500 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="text-xl">No celestial navigators on the board yet. Time to add one!</p>
                </div>
            {:else}
                <ol class="space-y-3">
                    {#each $sortedUsers as user, i}
                        {@const rankEmoji = ['🥇', '🥈', '🥉'][i] || `<span class="text-gray-400">${i + 1}</span>`}
                        {@const rankClass =
                            i === 0 ? 'border-yellow-400 bg-gray-800/80 shadow-yellow-400/30' : 
                            i === 1 ? 'border-gray-400 bg-gray-800/60 shadow-gray-400/30' : 
                            i === 2 ? 'border-yellow-700/80 bg-gray-800/40 shadow-yellow-700/30' : 
                            'border-gray-700/50 bg-gray-800/20'}

                        <li class={`flex items-center justify-between rounded-xl border-2 p-4 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/30 ${rankClass}`}>
                            <div class="flex items-center">
                                <span class="w-12 text-center text-3xl font-extrabold text-teal-300 mr-4">
                                    {@html rankEmoji}
                                </span>
                                
                                <div class="flex flex-col">
                                    <span class="text-xl font-semibold text-gray-50">{user.username}</span>
                                    <span class="text-xs italic text-gray-500 mt-0.5">{user.email}</span>
                                </div>
                            </div>
                            <span class="text-3xl font-extrabold text-pink-400 tracking-wider">
                                {user.points} <span class="text-lg font-normal text-pink-300">pts</span>
                            </span>
                        </li>
                    {/each}
                </ol>
            {/if}
        </div>

        <div class="mt-12 border-t border-gray-800 pt-8">
            <h3 class="mb-6 text-2xl font-extrabold text-indigo-400">🚀 Management Controls</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <form on:submit|preventDefault={handleAddUser} class="rounded-xl bg-gray-800 p-6 border border-gray-700 shadow-inner">
                    <h4 class="mb-4 text-xl font-bold text-gray-200">New Navigator Registration</h4>
                    
                    <div class="space-y-3">
                        <input
                            type="text"
                            bind:value={newUsername}
                            placeholder="Username (e.g., Stargazer_Tom)"
                            class="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            bind:value={newUserEmail}
                            placeholder="Email (required for internal lookup)"
                            class="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {#if addUserError}
                        <p class="mt-3 text-sm text-red-400 font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            {addUserError}
                        </p>
                    {/if}

                    <button
                        type="submit"
                        disabled={isAddingUser}
                        class="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAddingUser ? 'Adding User...' : 'Add User to Leaderboard'}
                    </button>
                </form>

                <form on:submit|preventDefault={handleUpdatePoints} class="rounded-xl bg-gray-800 p-6 border border-gray-700 shadow-inner">
                    <h4 class="mb-4 text-xl font-bold text-gray-200">Award Observation Points</h4>
                    
                    <div class="space-y-3">
                        <input
                            type="email"
                            bind:value={updateUserEmail}
                            placeholder="User Email to Update"
                            class="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        <div class="flex items-center space-x-3">
                            <label for="points-input" class="text-gray-400 font-medium">Points:</label>
                            <input
                                id="points-input"
                                type="number"
                                bind:value={pointsToAdd}
                                class="flex-grow rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                min="-1000" max="1000"
                            />
                        </div>
                    </div>

                    {#if updatePointsError}
                        <p class="mt-3 text-sm text-red-400 font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            {updatePointsError}
                        </p>
                    {/if}

                    <button
                        type="submit"
                        disabled={isUpdatingPoints}
                        class="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUpdatingPoints ? 'Updating Points...' : `Award ${pointsToAdd} Points`}
                    </button>
                </form>
            </div>


            <div class="mt-10 border-t border-red-900/50 pt-6 text-center rounded-xl bg-red-900/10 p-4">
                <h4 class="text-xl font-bold text-red-400 mb-3">⚠️ Danger Zone</h4>
                <button
                    on:click={() => (showResetConfirm = true)}
                    class="w-full rounded-lg bg-red-700 px-8 py-3 font-bold text-white transition-colors hover:bg-red-800 sm:w-auto shadow-lg hover:shadow-red-500/50"
                >
                   Reset Leaderboard
                </button>
            </div>
        </div>
    </div>
</div>

{#if showResetConfirm}
    <div class="bg-gray-900/90 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-2xl border border-red-600/50">
            <h3 class="mb-4 text-2xl font-bold text-red-400 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span>Confirm Mass Deletion</span>
            </h3>
            <p class="mb-6 text-gray-300 leading-relaxed">
                You are about to **PERMANENTLY** erase all user entries and points from the leaderboard. This action cannot be reversed.
            </p>
            <div class="flex justify-end space-x-3">
                <button
                    on:click={() => (showResetConfirm = false)}
                    class="rounded-lg bg-gray-600 px-5 py-2 font-medium text-white transition-colors hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    on:click={handleReset}
                    class="rounded-lg bg-red-600 px-5 py-2 font-bold text-white transition-colors hover:bg-red-700"
                >
                    Yes, Destroy Data
                </button>
            </div>
        </div>
    </div>
{/if}