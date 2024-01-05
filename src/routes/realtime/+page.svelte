<script lang="ts">
	import type { PageData } from './$types.js';
	import * as SW from '../../../dist/index.js';
	import type { RealtimeCallback } from '../../../dist/index.js';
	let { data } = $props<{ data: PageData }>();

	const sveltewrite = data.sveltewrite;
	const AppwriteChannels = SW.AppwriteChannels;
	const channels = [
		// Listening for changes on this document
		AppwriteChannels.document('main', 'posts', '6595c652e8c81dbcf4f9')
	];
	const callback: RealtimeCallback = (e) => {
		console.log(e);
	};
</script>

<SW.File {sveltewrite} bucketId="packages" fileId="658a453cd423c1621471" let:file let:url>
	{url}
</SW.File>
