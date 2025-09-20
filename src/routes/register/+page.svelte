<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:wght@700&display=swap" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
</svelte:head>

<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { getContext } from 'svelte';

  /** @type {import('./$types').ActionData} */
  export let form;

  let username = '';
  let email = '';
  let password = '';

  let warn_name = '';
  let warn_email = '';
  let warn_password = '';
  let warn_select = '';

  const loading: Function = getContext('loading');
  const displayPopUp: Function = getContext('displayPopUp');

  function validate(form_vals: FormData) {
    const u = (form_vals.get('username') as string) || '';
    const e = (form_vals.get('email')    as string) || '';
    const pw= (form_vals.get('password') as string) || '';
    let valid = false;

    warn_name = warn_email = warn_password = warn_select = '';

    if (u.length > 25) {
      warn_name = 'Must be less than 25 characters';
    } else if (!u.length) {
      warn_name = 'required';
    } else if (!e.length) {
      warn_email = 'required';
    } else if (pw.length < 8) {
      warn_password = 'Must be at least 8 characters';
    } else {
        valid = true;
    }

    return valid;
  }

  function resetWarns() {
    warn_name = warn_email = warn_password = warn_select = '';
  }

  $: registerResult = (onsubmit: { formData: FormData; cancel: () => void }) => {
    loading(true);
    if (!validate(onsubmit.formData)) {
      onsubmit.cancel();
      loading(false);
      return;
    }
    return async ({ result }) => {
      loading(false);
      if (result.type === 'success' && result.data) {
        if (result.data.success) {
          goto('/register/verify?email=' + email);
        } else {
          displayPopUp('Alert', result.data.err, 4000, () => {});
        }
      } else {
        displayPopUp(
          'Alert',
          result.data?.err ?? 'Invalid Credentials',
          4000,
          () => goto('/register')
        );
      }
    };
  };

  function handleLogin(e: Event) {
    e.preventDefault();
    goto('/login');
  }
</script>

<style>
  /* gradient background */
.page-bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center; 
  overflow-y: auto; 
	  background: radial-gradient(
		  80% 20% at 50% 100%,
	  #C0F8FC 0%,
	  #8BECF8 1%,
	  #53B1C0 7.5%,
	  #3790A4 15%,
	  #288193 30%,
	  #04202C 62.5%,
	  #021114 75%,
	  #000708 100%
	  );  padding-top: 10rem; 
  box-sizing: border-box;
}

  .page-heading {
    /* position: absolute; */
    /* top: 7rem;
    left: 3rem; */
    font-family: 'Inria Sans', sans-serif;
    font-size: 2.1rem;
    /* margin-bottom: 1rem; */
    /*text-align: center;*/
    color: white;
    font-weight: 700;
    /* z-index: 2; */
  }

  /* container */
  .form-box {
    width: 36rem;
    max-width: 90vw;
    padding: 2.5rem;
    background: transparent;
    border: 1px solid #b5ebfa;
    border-radius: 1rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    font-family: 'Inter', sans-serif;
    color: #fff;
    animation: fadeIn 0.5s ease-out;
    margin-bottom: 2rem;
    animation: flicker 2s infinite ease-in-out;

  }

  	@keyframes flicker {
	  0%, 100% {
		box-shadow: 0 0 15px rgba(0, 191, 255, 0.3),
					0 0 30px rgba(0, 191, 255, 0.2),
					0 0 45px rgba(0, 191, 255, 0.1);
	  }
	  50% {
		box-shadow: 0 0 10px rgba(0, 191, 255, 0.1),
					0 0 20px rgba(0, 191, 255, 0.05),
					0 0 30px rgba(0, 191, 255, 0.03);
	  }
	}
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .input-group {
    margin-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
  }
  label {
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  input, select {
    padding: 1rem;
    background: transparent;
    border: 1px solid #ffffff;
    border-radius: 1rem;
    color: #fff;
    font-size: 1rem;
  }
  input::placeholder { color: #9ca3af; }

  #institype {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 2rem;                 
    background-image: url('../../lib/assets/down_tri.png');
    background-repeat: no-repeat;
    background-position: right 1.5rem center;
    background-size: 1.3rem 1.3rem; 
  }

  .warn {
    color: #f88;
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2.5rem;
  }
  .btn-primary {
    align-self: center;
	  width: 100%;
    flex: 1;
    padding: 1rem;
    margin-top: 2rem;
    background: transparent;
    border: solid 1px #fff;
    border-radius: 2rem;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-primary:hover {
	  background: linear-gradient(to right, #8becf8, #53b1c0);
    color: #000;
	}
	
	.btn-primary:active {
	  width: 98%;
	  font-size: 0.9rem;
	}
  
  .btn-link {
    align-self: center;
    color: white;
    text-decoration: none;
    font-weight: 500;
  }

  /*
  .btn-link:hover {
    text-decoration: underline;
  }
  */

  .signin-text {
	  margin-top: 1rem;
	  text-align: center;
	  font-size: 0.875rem;
	  color: #d1d5db;
	}

  .text-blue-400:hover {
    text-decoration: underline;
  }


  @media (max-width: 768px) {
    .form-box { width: 90%; padding: 1.5rem; }
  }
</style>

<div class="page-bg">

  <div class="form-box">
    <h1 class="page-heading">Let's get started!</h1>
    <form
      action="?/register"
      method="POST"
      use:enhance={registerResult}
      on:change={resetWarns}
    >
      <!-- name -->
      <div class="input-group">
        <label for="username">Name</label>
        <input
          type="text" name="username" id="username"
          placeholder="John Doe" maxlength="25"
          required bind:value={username}
        />
        {#if warn_name}
          <div class="warn">{warn_name}</div>
        {/if}
      </div>
      
      <!-- email -->
      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email" name="email" id="email"
          placeholder="name@company.com" required bind:value={email}
        />
        {#if warn_email}
          <div class="warn">{warn_email}</div>
        {/if}
      </div>

      <!-- pwd -->
      <div class="input-group">
        <label for="password">Password</label>
        <input
          type="password" name="password" id="password"
          placeholder="••••••••" required bind:value={password}
        />
        {#if warn_password}
          <div class="warn">{warn_password}</div>
        {/if}
      </div>

      <!-- submit -->
      <div class="buttons">
        <button class="btn-primary" type="submit">REGISTER</button>
        <!-- <p> Already have an account? </p>
        <a href="/login" class="btn-link" on:click={handleLogin}>
           <span class="text-blue-400">Sign In</span>
        </a> -->
        <p class="signin-text">Already have an account? 
          <a href="/login" class="btn-link" on:click={handleLogin}>
            <span class="text-blue-400">Sign In</span>
          </a>
        </p>
      </div>
    </form>
  </div>
</div>
