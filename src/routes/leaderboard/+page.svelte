<script lang="ts">
    import { derived } from 'svelte/store';
    import { users, user as userStore } from '$lib/stores';
    
    const sortedUsers = derived(users, ($users) => $users.sort((a, b) => b.points - a.points));

    function getRankClasses(index: number) {
        if (index === 0) {
            return {
                card: 'border-yellow-400 bg-yellow-900/20 shadow-xl shadow-yellow-400/30',
                points: 'text-yellow-300',
                name: 'text-white',
            };
        }
        if (index === 1) {
            return {
                card: 'border-gray-400 bg-gray-700/30 shadow-lg shadow-gray-400/20',
                points: 'text-gray-300',
                name: 'text-gray-100',
            };
        }
        if (index === 2) {
            return {
                card: 'border-yellow-700/80 bg-yellow-800/10 shadow-md shadow-yellow-700/20',
                points: 'text-yellow-500',
                name: 'text-gray-200',
            };
        }
        return {
            card: 'border-indigo-800 bg-gray-800/20 hover:bg-gray-700/30',
            points: 'text-indigo-300',
            name: 'text-gray-300',
        };
    }
</script>

<div class="min-h-screen bg-gray-950 p-4 sm:p-8">
    <div
        class="mx-auto w-full max-w-4xl rounded-3xl bg-gray-900 border border-indigo-900/50 p-6 text-white shadow-2xl shadow-indigo-900/20 md:p-8 lg:p-10"
    >
        <header class="mb-8 border-b border-indigo-900 pb-4">
            <h2 class="text-center text-4xl font-extrabold text-teal-400 tracking-wider">
                ✨ Star Observation Leaderboard
            </h2>
            <p class="text-center text-indigo-300 mt-2 italic font-light">
                The Top Navigators in our Celestial Fleet!
            </p>
        </header>

        {#if $userStore.user_data.admin}
            <div class="text-center mb-8">
                <a 
                    href="/admin/leaderboard" 
                    class="inline-flex items-center space-x-2 rounded-full bg-pink-600 px-6 py-3 font-bold text-white transition-colors hover:bg-pink-700 shadow-lg shadow-pink-600/30 transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 15h3.586l.707-.707A1.99 1.99 0 0110 13a1.99 1.99 0 011.707.879l.707.707H16a1 1 0 00.707-1.707L14 11.586V8a6 6 0 00-6-6z" />
                    </svg>
                    <span>Admin Management Panel</span>
                </a>
            </div>
        {/if}

        <div class="space-y-4">
            
            {#if $sortedUsers.length === 0}
                <div class="py-12 text-center text-gray-500 bg-gray-800/50 rounded-xl border border-gray-700">
                    <p class="text-xl">The cosmic ledger is empty. No members have earned points yet!</p>
                </div>
            {:else}
                <ol class="space-y-4">
                    {#each $sortedUsers as user, i}
                        {@const rankEmoji = ['🥇', '🥈', '🥉'][i] || `<span class="text-gray-400 font-normal">${i + 1}</span>`}
                        {@const { card, points, name } = getRankClasses(i)}

                        <li class={`flex items-center justify-between rounded-xl border-2 p-5 transition-all duration-300 transform hover:scale-[1.01] ${card}`}>
                            <div class="flex items-center">
                                <span class="w-12 text-center text-3xl font-extrabold text-teal-300 mr-4">
                                    {@html rankEmoji}
                                </span>
                                
                                <div class="flex flex-col">
                                    <span class={`text-xl font-semibold ${name}`}>{user.username}</span>
                                </div>
                            </div>
                            <div class="flex items-end space-x-1">
                                <span class={`text-3xl font-extrabold tracking-wider ${points}`}>
                                    {user.points}
                                </span>
                                <span class={`text-lg font-medium ${points} opacity-75`}>pts</span>
                            </div>
                        </li>
                    {/each}
                </ol>
            {/if}
        </div>
        
        <footer class="mt-10 pt-4 border-t border-indigo-900/50 text-center text-sm text-gray-500">
            <p>Points are earned by participating in observations, workshops, and submitting data.</p>
        </footer>
    </div>
</div>