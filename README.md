# SvelteWrite

A wrapper for Appwrite collections, buckets, and authentication with realtime updates.

## SvelteWrite

```ts
import * as SW from '@theofficialurban/sveltewrite';
```

**Classes**:

- `SW.SvelteWrite` - Top Class

**Components** (see below for more on each component)

- `SW.AccountProvider` - Component, Account Provider
- `SW.Collection` - Collection, Component
- `SW.Bucket` - Bucket, Component
- `SW.Login` - Login Component
- `SW.Document` - Doc Component

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

**Slots / Props**

- `default` - Main Slot
  - `collection` - Collection (`Models.DocumentList`)
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
  - `bucket` - The storage bucket
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
