<script lang="ts">
	import type SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte.js';
	import { BucketFile } from '$lib/SvelteWrite/SvelteWrite.svelte.js';
	interface $$props {
		sveltewrite: SvelteWrite;
		bucketId: string;
		fileId: string;
	}
	let { sveltewrite, bucketId, fileId } = $props<$$props>();
	const storage = new BucketFile(sveltewrite, bucketId, fileId);
</script>

<slot url={storage.url} file={storage.file} />
