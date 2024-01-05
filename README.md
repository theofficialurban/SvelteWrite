A wrapper for Appwrite collections, buckets, and authentication with realtime updates.

## SvelteWrite

```ts
import * as SW from '@theofficialurban/sveltewrite';
```

**Classes**:

- `SvelteWrite` - Top Class
  - `new SvelteWrite(client: Client)` - Pass in your Appwrite client instance.

**Utilities**

- `AppwriteChannels` - Includes functions to fill and create channels
  - i.e `AppwriteChannels.file("bucketId", "fileId") => "buckets.bucketId.files.fileId"`
- `AppwriteEvents` - An object containing event strings based on CRUD events for buckets and documents

**Types**:

- `BucketReturn` - The slot prop type for `Bucket` component `let:bucket
- `CollectionReturn` - The slot prop type for `Collection` component `let:collection`
- `DocumentReturn` - Slot prop type for `Document` , `let:document`
- `RealtimeCallback` - Callback type for the `<Realtime>` component prop `callback`
- `AppwriteEvent` - See section on events and channels
- `AppwriteChannel` - See section on events and channels

**Components** (see below for more on each component)

- `AccountProvider` - Component, Account Provider
- `Collection` - Collection, Component
- `Bucket` - Bucket, Component
- `Login` - Login Component
- `Document` - Doc Component
- `Realtime` - Realtime Component
- `File` - Single bucket file

### Quick Start

**Example**

**First you should create an Appwrite client in `+layout.ts`**

```ts
// on +layout.ts
import { Client } from 'appwrite';
import { SvelteWrite } from '@theofficialurban/sveltewrite';
export const load = async () => {
	const client = new Client().setEndpoint('...').setProject('...');
	const sveltewrite = new SvelteWrite(client);
	return {
		sveltewrite
	};
};
```

### `SW.Collection`

The `SvelteWrite.Collection` component gives you access to a collection that will have a maintained state with realtime updates (live create / update / delete)

**Props**

- `sveltewrite` - SvelteWrite instance
- `dbId` - Database ID
- `colId` - Collection ID
- `queries?` - Queries array

**Slots / Props**

- `default` - Main Slot
  - `collection` - `type CollectionReturn`
- `loading` - Loading Slot

**Example**

```html
<script lang="ts">
	import * as SW from '@theofficialurban/sveltewrite';
	import { page } from '$app/stores';
	const sveltewrite = $page.data.sveltewrite;
</script>

<SW.Collection {sveltewrite} dbId="123" colId="321" let:collection>
	<svelte:fragment slot="loading">Loading.....</svelte:fragment>
	{#each collection.documents as doc}
	<span>{doc.$id}</span>
	{/each}
	<SW.Collection> </SW.Collection
></SW.Collection>
```

### `SW.Bucket`

Realtime Access to Storage Buckets

**Props**

- `sveltewrite` - SvelteWrite instance
- `bucketId` - Bucket ID
- `queries?` - Array of optional queries

**Slots / Props**

- `default` - Default Slot
  - `bucket` - `type BucketReturn`
- `loading` - Loading Slot

**Example**

```html
<script lang="ts">
	import * as SW from '@theofficialurban/sveltewrite';
	import { page } from '$app/stores';
	const sveltewrite = $page.data.sveltewrite;
</script>

<SW.Bucket {sveltewrite} bucketId="123" let:bucket>
	<svelte:fragment slot="loading">Loading.....</svelte:fragment>
	{#each bucket.files as file}
	<span>{file.$id}</span>
	{/each}
	<SW.Bucket> </SW.Bucket
></SW.Bucket>
```

### `SW.AccountProvider`

**Props**
`sveltewrite` - SvelteWrite instance

**Slots / Props**

_No Default Slot_

- `loggedIn` - Logged in User
  - `currentUser` - `Models.User<..>`
- `loggedOut` - Logged out User

**Example**

```html
<script lang="ts">
	import * as SW from '@theofficialurban/sveltewrite';
	import { page } from '$app/stores';
	const sveltewrite = $page.data.sveltewrite;
</script>

<!-- Can use the login component too -->

<SW.AccountProvider {sveltewrite}>
	<svelte:fragment slot="loggedIn" let:currentUser>
		Logged in as {currentUser.name}
	</svelte:fragment>

	<svelte:fragment slot="loggedOut">
		<SW.Login {sveltewrite} />
	</svelte:fragment>
	<SW.AccountProvider></SW.AccountProvider
></SW.AccountProvider>
```

### `SW.Document`

A document with realtime updates

**Props**

- `sveltewrite` - SvelteWrite instance
- `dbId` - Database ID
- `colId` - Collection ID
- `docId` - Document ID
- `queries?` - Array of optional queries

**Slots / Props**

- `default` - Document
  - `document` - `type DocumentReturn`
- `loading` - Loading State

**Example**

```html
<script lang="ts">
	import * as SW from '@theofficialurban/sveltewrite';
	import { page } from '$app/stores';
	const sveltewrite = $page.data.sveltewrite;
</script>

<SW.Document {sveltewrite} dbId="123" colId="123" docId="123" let:document>
	{document.item.$id}
	<SW.Document> </SW.Document
></SW.Document>
```

### `SW.Realtime`

#### Types & Enums

```ts
const AppwriteChannels: AppwriteChannel = {
	account: () => 'account',
	collectionDocuments: (dbId: string, colId: string) =>
		`databases.${dbId}.collections.${colId}.documents`,
	documents: () => 'documents',
	document: (dbId: string, colId: string, itemId: string) =>
		`databases.${dbId}.collections.${colId}.documents.${itemId}`,
	files: () => 'files',
	file: (bucketId: string, itemId: string) => `buckets.${bucketId}.files.${itemId}`,
	bucket: (bucketId: string) => `buckets.${bucketId}.files`,
	teams: () => 'teams',
	team: (teamId: string) => `teams.${teamId}`,
	memberships: () => 'memberships',
	membership: (memId: string) => `memberships.${memId}`,
	executions: () => 'executions',
	execution: (exeId: string) => `executions.${exeId}`,
	function: (fnId: string) => `functions.${fnId}`
};
/**
 * Mapping of Events to the Event Strings
 * AppwriteEvent => string
 */
export const AppwriteEvents: AppwriteEvent = {
	DOCUMENT_DELETE: 'databases.*.collections.*.documents.*.delete',
	DOCUMENT_CREATE: 'databases.*.collections.*.documents.*.create',
	DOCUMENT_UPDATE: 'databases.*.collections.*.documents.*.update',
	BUCKET_CREATE: 'buckets.*.files.*.create',
	BUCKET_DELETE: 'buckets.*.files.*.delete',
	BUCKET_UPDATE: 'buckets.*.files.*.update'
};
```

**Getting a Channel /w Information**

For instance, to listen to the channel for a file id 123 in storage bucket "exampleBucket"

```ts
AppwriteChannels.file('exampleBucket', '123');
// Returns: `buckets.exampleBucket.files.123`
// Listening for changes on file #123 in exampleBucket
```

**Props**

- `sveltewrite` - SvelteWrite instance
- `channels` - `AppwriteChannel[]`
- `callback` - `RealtimeCallback`

**Slots / Props**

- `default`
  - `history` - A store that stores the history of the current realtime stream.
    - `type RealtimeResponseEvent<Record<string, unknown>>[]`

**Example**

```html
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

<SW.Realtime {callback} {channels} {sveltewrite} let:history>
	    {@html JSON.stringify(history)}
</SW.Realtime>
```

### `SW.File`

Gets a single file from a storage bucket and returns that file as a `Blob`

**Props**

- `bucketId` - The ID of the bucket
- `fileId` - The ID of the file to get

**Slots/Props**

- No Slots
  - `let:file` - Gives you the `Blob` with the fetched file
  - `let:url` - Gives you the URL to download the file.

**Example**

```html
<SW.File {sveltewrite} bucketId="packages" fileId="658a453cd423c1621471" let:file let:url>
	    {url}
</SW.File>
```
