<script lang="ts">
	import { browser } from '$app/environment';
	import type SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte';
	import type { Models } from 'appwrite';

	interface $$props {
		sveltewrite: SvelteWrite;
	}
	let { sveltewrite } = $props<$$props>();
	let currentUser = $state<Models.User<Models.Preferences> | null>(null);
	const account = sveltewrite.account;

	const getUser = async () => {
		try {
			return await account.get();
		} catch (error) {
			return null;
		}
	};
	if (browser) {
		sveltewrite.client.subscribe('account', async () => {
			try {
				const usr = await getUser();
				currentUser = usr;
			} catch (error) {
				console.error(error);
				currentUser = null;
			}
		});
	}
	$effect(() => {
		getUser().then((u) => {
			currentUser = u;
		});
	});
</script>

{#if currentUser}
	<slot name="loggedIn" {currentUser}>Currently Logged In As {currentUser.name}</slot>
{:else}
	<slot name="loggedOut">Currently Logged Out</slot>
{/if}
