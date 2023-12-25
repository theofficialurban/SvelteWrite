import { SvelteWrite } from '$lib/index.js';
import { Client } from 'appwrite';
import type { PageLoad } from './$types.js';

export const load = (async () => {
	const client = new Client()
		.setProject('657df22a1439a12f822a')
		.setEndpoint('https://cloud.appwrite.io/v1');
	const sveltewrite = new SvelteWrite(client);
	return {
		sveltewrite
	};
}) satisfies PageLoad;
