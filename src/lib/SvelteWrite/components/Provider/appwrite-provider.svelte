<script lang="ts">
	import SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte';
	import type { Client, Models } from 'appwrite';
	interface $$props {
		client: Client;
	}
	let { client } = $props<$$props>();

	const sveltewrite = new SvelteWrite(client);
</script>

<slot {sveltewrite} />
