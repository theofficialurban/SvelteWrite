<script lang="ts">
	import type SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte';
	import { Collection } from '$lib/SvelteWrite/SvelteWrite.svelte';
	import type { Models } from 'appwrite';
	type T = $$Generic<Models.Document>;
	interface $$props {
		sveltewrite: SvelteWrite;
		dbId: string;
		colId: string;
		queries?: string[];
	}
	let { sveltewrite, dbId, colId, queries = [] } = $props<$$props>();

	const collection = new Collection<T>(sveltewrite, dbId, colId, queries);
</script>

{#if collection.total > 0}
	<slot {collection} />
{:else}
	<slot name="loading">
		<span class="loading loading-spinner w-[200px]" />
	</slot>
{/if}
