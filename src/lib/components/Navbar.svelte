<script>
  import { page } from '$app/stores';
</script>

<nav class="navbar">
  <a href="/" class={String($page.url.pathname) === '/' ? 'active' : ''}>Home</a>
  <a href="/events" class={String($page.url.pathname) === '/events' ? 'active' : ''}>Events</a>
  <a href="/login" class={String($page.url.pathname) === '/login' ? 'active' : ''}>Login</a>
  <a href="/register" class={String($page.url.pathname) === '/register' ? 'active' : ''}>Register</a>
  <a href="/leaderboard" class={String($page.url.pathname) === '/leaderboard' ? 'active' : ''}>Leaderboard</a>
</nav>

<style>
  .navbar {
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
    background-color: #f4f4f4;
  }

  a {
    text-decoration: none;
    color: #333;
    font-weight: 600;
  }

  .active {
    color: #0070f3;
    border-bottom: 2px solid #0070f3;
  }
</style>
