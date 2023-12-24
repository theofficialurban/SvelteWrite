// Reexport your entry components here
import { default as SW } from './SvelteWrite/SvelteWrite.svelte.js';
import AccountProvider from './SvelteWrite/components/Account/account-provider.svelte';
import AppwriteProvider from './SvelteWrite/components/Provider/appwrite-provider.svelte';
import StorageBucket from './SvelteWrite/components/Bucket/storage-bucket.svelte';
import Collection from './SvelteWrite/components/Collection/collection.svelte';
import AccountLogin from './SvelteWrite/components/Account/account-login.svelte';
import AppwriteDocument from './SvelteWrite/components/Document/appwrite-document.svelte';
const SvelteWrite = {
	Provider: AppwriteProvider,
	AccountProvider,
	Bucket: StorageBucket,
	Collection,
	Login: AccountLogin,
	SvelteWrite: SW,
	Document: AppwriteDocument
};

export default SvelteWrite;
