<script lang="ts">
	import SvelteWrite from '$lib/index.js';
</script>

<SvelteWrite.Provider projectId="657df22a1439a12f822a" let:sveltewrite>
	<SvelteWrite.Login {sveltewrite}></SvelteWrite.Login><br />
	<SvelteWrite.AccountProvider {sveltewrite}>
		<svelte:fragment slot="loggedOut">Logged Out</svelte:fragment>
		<svelte:fragment slot="loggedIn">
			<!-- <SvelteWrite.Collection {sveltewrite} dbId="main" colId="test" let:collection>
				{#each collection.documents as item}
					<span>{item.$id} {item.test}</span><br />
				{/each}
			</SvelteWrite.Collection> -->
			<SvelteWrite.Document
				{sveltewrite}
				dbId="main"
				colId="test"
				docId="658756e3d9c8a3759624"
				let:document
			>
				{document.item?.$id}
			</SvelteWrite.Document>
		</svelte:fragment>
	</SvelteWrite.AccountProvider><br />
</SvelteWrite.Provider>
