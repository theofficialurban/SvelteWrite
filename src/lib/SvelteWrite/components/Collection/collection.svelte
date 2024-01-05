<script lang="ts">
	import SvelteWrite, { Collection } from '$lib/SvelteWrite/SvelteWrite.svelte.js';

	import type { Models } from 'appwrite';
	type T = $$Generic<Models.Document>;
	interface $$props {
		sveltewrite: SvelteWrite;
		dbId: string;
		colId: string;
		queries?: string[];
	}
	let { sveltewrite, dbId, colId, queries = [] } = $props<$$props>();

	const collection: Collection<T> = new Collection<T>(sveltewrite, dbId, colId, queries);
</script>

{#if collection.total > 0}
	<slot {collection} />
{:else}
	<slot name="loading">
		<span class="loading loading-spinner w-[200px]" />
	</slot>
{/if}
