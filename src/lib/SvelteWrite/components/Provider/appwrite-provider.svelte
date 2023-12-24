<script lang="ts">
	import SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte';
	import type { Models } from 'appwrite';
	interface $$props {
		projectId: string;
		endpoint?: string;
	}
	let { projectId, endpoint = 'https://cloud.appwrite.io/v1' } = $props<$$props>();
	interface Test extends Models.Document {
		test: string;
	}
	const sveltewrite = new SvelteWrite(endpoint, projectId);
</script>

<slot {sveltewrite} />
