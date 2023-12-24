# SvelteWrite

A wrapper for Appwrite collections, buckets, and authentication with realtime updates.

## SvelteWrite

```ts
import SvelteWrite from '@theofficialurban/SvelteWrite';
```

### `SvelteWrite.Provider`

The `SvelteWrite.Provider` is the top level provider component that would wrap your top-level layout.

**Props**

- `projectId` - Appwrite Project ID
- `endpoint` - Defaults to `https://cloud.appwrite.io/v1`

**Slots / Props**

- `default`
  - `sveltewrite` - The SvelteWrite instance that is needed for the other components

**Example**

```html
<script lang="ts">
	import SvelteWrite from '@theofficialurban/SvelteWrite';
</script>

<SvelteWrite.Provider projectId="1234" let:sveltewrite>
	// You will need `let:sveltewrite` to use other components .....
</SvelteWrite.Provider>
```

### `SvelteWrite.Collection`

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
	import SvelteWrite from '@theofficialurban/SvelteWrite';
</script>

<SvelteWrite.Provider projectId="1234" let:sveltewrite>
	<SvelteWrite.Collection {sveltewrite} dbId="123" colId="321" let:collection>
		<svelte:fragment slot="loading">Loading.....</svelte:fragment>
		{#each collection.documents as doc}
		<span>{doc.$id}</span>
		{/each}
	</SvelteWrite.Collection>
</SvelteWrite.Provider>
```

### `SvelteWrite.Bucket`

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
	import SvelteWrite from '@theofficialurban/SvelteWrite';
</script>

<SvelteWrite.Provider projectId="1234" let:sveltewrite>
	<SvelteWrite.Bucket {sveltewrite} bucketId="123" let:bucket>
		<svelte:fragment slot="loading">Loading.....</svelte:fragment>
		{#each bucket.files as file}
		<span>{file.$id}</span>
		{/each}
	</SvelteWrite.Bucket>
</SvelteWrite.Provider>
```

### `SvelteWrite.AccountProvider`

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
	import SvelteWrite from '@theofficialurban/SvelteWrite';
</script>

<SvelteWrite.Provider projectId="1234" let:sveltewrite>
	<!-- Can use the login component too -->

	<SvelteWrite.AccountProvider {sveltewrite}>
		<svelte:fragment slot="loggedIn" let:currentUser>
			Logged in as {currentUser.name}
		</svelte:fragment>

		<svelte:fragment slot="loggedOut">
			<SvelteWrite.Login {sveltewrite} />
		</svelte:fragment>
	</SvelteWrite.AccountProvider>
</SvelteWrite.Provider>
```

### `SvelteWrite.Document`

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
	import SvelteWrite from '@theofficialurban/SvelteWrite';
</script>

<SvelteWrite.Provider projectId="1234" let:sveltewrite>
	<SvelteWrite.Document {sveltewrite} dbId="123" colId="123" docId="123" let:document>
		{document.item.$id}
	</SvelteWrite.Document>
</SvelteWrite.Provider>
```
