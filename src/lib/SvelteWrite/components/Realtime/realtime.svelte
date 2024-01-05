<script lang="ts">
	import { browser } from '$app/environment';
	import SvelteWrite, { AppwriteChannels } from '$lib/SvelteWrite/SvelteWrite.svelte.js';
	import type { AppwriteChannel, RealtimeCallback } from '$lib/SvelteWrite/types.js';
	import type { RealtimeResponseEvent } from 'appwrite';
	import { writable } from 'svelte/store';
	interface $$props {
		sveltewrite: SvelteWrite;
		channels: string[] | string;
		callback: RealtimeCallback;
	}

	let { sveltewrite, channels, callback } = $props<$$props>();
	const history = writable<RealtimeResponseEvent<Record<string, unknown>>[]>([]);

	if (browser) {
		sveltewrite.client.subscribe<Record<string, unknown>>(channels, (e) => {
			history.update((h) => [...h, e]);
			callback(e);
		});
	}
</script>

<slot history={$history} />
