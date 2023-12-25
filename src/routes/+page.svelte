<script lang="ts">
	import * as SW from '$lib/index.js';

	import { page } from '$app/stores';
	const sveltewrite = $page.data.sveltewrite;
</script>

<SW.Login {sveltewrite}></SW.Login><br />
<SW.AccountProvider {sveltewrite}>
	<svelte:fragment slot="loggedOut">Logged Out</svelte:fragment>
	<svelte:fragment slot="loggedIn">
		<!-- <SW.Collection {sveltewrite} dbId="main" colId="test" let:collection>
				{#each collection.documents as item}
					<span>{item.$id} {item.test}</span><br />
				{/each}
			</SW.Collection> -->
		<SW.Document {sveltewrite} dbId="main" colId="test" docId="658756e3d9c8a3759624" let:document>
			{document.item?.$id}
		</SW.Document>
	</svelte:fragment>
</SW.AccountProvider><br />
