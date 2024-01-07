<script lang="ts">
	import { Document } from '$lib/SvelteWrite/SvelteWrite.svelte.js';
	import type SvelteWrite from '$lib/SvelteWrite/SvelteWrite.svelte.js';

	interface $$props {
		sveltewrite: SvelteWrite;
		dbId: string;
		colId: string;
		docId: string;
		queries?: string[];
	}
	let { sveltewrite, dbId, colId, docId, queries = [] } = $props<$$props>();
	const document: Document = new Document(sveltewrite, dbId, colId, docId, queries);
</script>

{#if document.item}
	<slot {document}>
		<div data-testid="loaded" />
	</slot>
{:else}
	<slot name="loading">
		<div data-testid="loading" />
	</slot>
{/if}
