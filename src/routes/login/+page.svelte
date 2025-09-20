<script lang="ts">
	// import './Login.css'
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { access_token, invalidate, loggedIn, user } from '$lib/stores';
	import { getContext, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	/** @type {import('./$types').ActionData} */
	// export let form;
	// console.log(form)
	export let data;
	let email: string;
	let password: string;

	const getData: Function = getContext('getData');
	onMount(async () => {
		loading(true)
		if (!$loggedIn) {
			await getData();
		}
		loading(false)
		if ($loggedIn && data.accessToken && data.nextpg == "map") {
			window.location.href = `https://map.petrichor.events/api/oauth?session_id=${data.accessToken}`
		}
		access_token.set(data.accessToken);
	});

	const displayPopUp: Function = getContext('displayPopUp');
	const loading: Function = getContext('loading');

	function afterMessage() {
		// console.log("her")
		goto(`/login${$page.url.search}`);
	}
	const whoami: Function = getContext('whoami');

	$: loginResult = () => {
		loading(true);

		// @ts-ignore
		return async ({ result }) => {
			// console.log(result)
			if (result.type == 'success' && result.data) {
				const rdata = result.data;
				// console.log(rdata)
				const whoami_res = (await whoami(rdata.token))
				// console.log(whoami_res)
				if (!whoami_res) {
					loading(false)
					displayPopUp('Alert', "Unable to log you in. Please retry after sometime", 4000, afterMessage);
					return
				}
				if (rdata.success) {
					// this will save all the data to session Storage
					loading(false);
					invalidate.set(false);
					loggedIn.set(true);
					// console.log($user)
					if (data.nextpg != null){
						if (data.nextpg == "map") {
							window.location.href = `https://map.petrichor.events/api/oauth?session_id=${rdata.token}`
							return;
						}
						goto(data.nextpg);
					} 
					else {
						goto('/profile');
					}
				} else {
					loading(false);
					displayPopUp('Alert', rdata.message, 4000, afterMessage);
				}
			} else {
				if(result.status == 511){
					loading(false)
					goto('/register/verify?email='+email);
					return;
				}
				setTimeout(() => {
					loading(false);
					displayPopUp(
						'Alert',
						result.data.err ? result.data.err : 'Invalid Credentials',
						4000,
						afterMessage
					);
				}, 100);
			}
		};
	};
</script>


<main>
  <div class="container">
    <div class="login">
      <h1>Log in to your account!</h1>
      <form method="POST" action="?/login" use:enhance={loginResult}>

		<label class="label" for="email"><p>Email</p>
			<input type="email" name="email" placeholder="name@company.com" bind:value={email} required autocomplete="username" />
		</label>

        <label class="label" for="password"><p>Password</p>
			<input type="password" name="password" placeholder="••••••••" bind:value={password} required autocomplete="current-password" />
		</label>
        <div class="options">
          <label class="remember">
            <input type="checkbox" class="w-20px h-20px mr-10px" />
            <span>Remember Me</span>
          </label>
          <a href="/forgotpassword" class="forgot">Forgot password?</a>
        </div>

        <div class="flex justify-center">
          <button id="login" type="submit" class="login-btn">LOGIN</button>
        </div>

        <p class="signup-text">Don't have an account yet?
          <a href="/register" class="signup-link">Sign up</a>
        </p>

      </form>
    </div>
  </div>
</main>

<style>
	main {
	  min-height: 100vh;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background: radial-gradient(
		80% 30% at 50% 100%,
		#C0F8FC 0%,
		#8BECF8 1%,
		#53B1C0 7.5%,
		#3790A4 15%,
		#288193 30%,
		#04202C 62.5%,
		#021114 75%,
		#000708 100%
	  );
	  background-repeat: no-repeat;
	  background-color: #000;
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
	
	.container {
	  width: 60%;
	  max-width: 720px;
	  min-height: 420px;
	  border-radius: 1rem;
	  background-color: transparent;
	  border: 1px solid #b5ebfa; /* border-cyan-600 */
	  padding: 2.5rem;
	  color: white;
	  animation: flicker 2s infinite ease-in-out;
	}
	
	@media (max-width: 600px) {
	  .options {
		flex-direction: column;
	  }
	}

	@media (max-width: 900px) {
	  .container {
		width: 80%;
		/* height: 400px; */
		padding: 1.5rem;
	  }
	}
	
	.login {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.login h1 {
		text-align: left;
    	font-family: 'Inria Sans', sans-serif;
		font-size: 2.1rem;
		font-weight: 700;
		padding-top: 1rem;
		padding-bottom: 2rem;
		color: white;	
	}

	@media (max-width: 900px) {
		.login h1 {
			margin-top: -1.5rem;
			font-size: 1.8rem;
		}
	}

	@media (max-width: 700px) {
		.login h1 {
			margin-top: -1.5rem;
			font-size: 1.6rem;
		}
	}


	.label {
		display: block;
    	font-weight: 600;
		margin-bottom: 0.25rem;
		color: white;
	}
	
	.label p {
	  margin-bottom: -0.5rem;
	}
	
	.login input {
	  width: 100%;
	  margin-bottom: 1rem;
	  padding: 1rem 1rem;
	  border-radius: 1rem;
	  border: 1px solid #ffffff;
	  background-color: transparent;
	  /* text-align: center; */
	  color: white;
	  /* placeholder-color: white; */
	  outline: none;
	}
	
	/* ::-webkit-input-placeholder { WebKit, Blink, Edge
    	color: white;
		text-align: center;
	}
	:-moz-placeholder { Mozilla Firefox 4 to 18
		color: white;
		opacity: 1;
		text-align: center;
	}
	::-moz-placeholder { Mozilla Firefox 19+
		color: white;
		opacity: 1;
		text-align: center;
	}
	:-ms-input-placeholder { Internet Explorer 10-11
		color: white;
		text-align: center;
	}
	::-ms-input-placeholder { Microsoft Edge
		color: white;
		text-align: center;
	}
	::placeholder { Most modern browsers support this now.
		color: white;
		text-align: center;
	} */
	.login input:focus {
	  box-shadow: 0 0 0 2px #3b82f6;
	}
	
	.options {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 1.5rem;
	  font-size: 0.875rem;
	}
	
	.remember {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: center;
	  gap: 0.5rem;
	  text-align: center;
	  color: #d1d5db;
	}
	input {
		margin-top: 1em;
		margin-bottom: 1em;
	}
	span {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	  	white-space: nowrap;
	}
	.check {
	  width: 20px;
	  height: 20px;
	  margin-right: 10px;
	}
	
	.forgot {
	  color: #ffffff;
	  text-decoration: none;
	}
	
	.forgot:hover {
	  text-decoration: underline;
	}
	
	.login-btn {
		width: 200px;
		padding: 0.5rem 0;
		color: white;
		border-radius: 0.5rem;
		margin: 0 auto;
		display: block;
    	font-weight: 600;
		background: transparent;
		border: 1px solid white;
		border-radius: 9999px;
		/* transition: background 0.3s ease; */
	}
	
	.login-btn:hover {
	  background: linear-gradient(to right, #8becf8, #53b1c0);
	  color: black;
	}
	
	.login-btn:active {
	  width: 195px;
	  font-size: 0.9rem;
	}
	
	.signup-text {
	  margin-top: 1rem;
	  text-align: center;
	  font-size: 0.875rem;
	  color: #d1d5db;
	}
	
	.signup-link {
	  color: #60a5fa;
	  text-decoration: none;
	}
	
	.signup-link:hover {
	  text-decoration: underline;
	}
</style>	