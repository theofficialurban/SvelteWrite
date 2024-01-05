<script lang="ts">
	import type SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte';
	import { Bucket } from '$lib/SvelteWrite/SvelteWrite.svelte';
	interface $$props {
		sveltewrite: SvelteWrite;
		bucketId: string;
		queries?: string[];
	}
	let { sveltewrite, bucketId, queries } = $props<$$props>();

	const bucket: Bucket = new Bucket(sveltewrite, bucketId, queries);
</script>

{#if bucket.total > 0}
	<slot {bucket} />
{:else}
	<slot name="loading">
		<span class="loading loading-spinner w-[200px]" />
	</slot>
{/if}
