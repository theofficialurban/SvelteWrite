import { Client } from 'appwrite';
import type { LayoutLoad } from './$types.js';
import SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte.js';

export const load = (async () => {
	const client = new Client()
		.setProject('657df22a1439a12f822a')
		.setEndpoint('https://cloud.appwrite.io/v1');
	const sveltewrite = new SvelteWrite(client);
	return {
		sveltewrite
	};
}) satisfies LayoutLoad;
