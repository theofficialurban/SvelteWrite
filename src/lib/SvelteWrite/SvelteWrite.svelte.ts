import { browser } from '$app/environment';
import { Account, Client, Graphql, Storage } from 'appwrite';
import { type Models, Databases } from 'appwrite';
import { remove } from 'lodash-es';
import {
	type AppwriteEvent,
	type AppwriteChannel,
	type FileReturn,
	type ReactiveBucket,
	type ReactiveCollection,
	type ReactiveDocument
} from './types.js';

/**
 * Mapping of Events to the Event Strings
 * AppwriteEvent => string
 * @example `AppwriteEvents[AppwriteEvent.DOCUMENT_DELETE]` => `databases.*.collections.*.documents.*.delete`
 */
export const AppwriteEvents: AppwriteEvent = {
	DOCUMENT_DELETE: 'databases.*.collections.*.documents.*.delete',
	DOCUMENT_CREATE: 'databases.*.collections.*.documents.*.create',
	DOCUMENT_UPDATE: 'databases.*.collections.*.documents.*.update',
	BUCKET_CREATE: 'buckets.*.files.*.create',
	BUCKET_DELETE: 'buckets.*.files.*.delete',
	BUCKET_UPDATE: 'buckets.*.files.*.update'
};
/**
 * getEvent()
 * @param type 'FILES' or 'DOCUMENTS'
 * @param eventsArray eventsArray Payload
 * @returns AppwriteEvent
 */
function getEvent(type: 'FILES' | 'DOCUMENTS', eventsArray: string[]): keyof AppwriteEvent | null {
	if (type == 'DOCUMENTS') {
		const deleteCheck = eventsArray.find((e) => e == AppwriteEvents.DOCUMENT_DELETE) ?? null;
		if (deleteCheck) return 'DOCUMENT_DELETE';
		const createCheck = eventsArray.find((e) => e == AppwriteEvents.DOCUMENT_CREATE) ?? null;
		if (createCheck) return 'DOCUMENT_CREATE';
		const updateCheck = eventsArray.find((e) => e == AppwriteEvents.DOCUMENT_UPDATE) ?? null;
		if (updateCheck) return 'DOCUMENT_UPDATE';
		return null;
	} else if (type == 'FILES') {
		const deleteCheck = eventsArray.find((e) => e == AppwriteEvents.BUCKET_DELETE) ?? null;
		if (deleteCheck) return 'BUCKET_DELETE';
		const createCheck = eventsArray.find((e) => e == AppwriteEvents.BUCKET_CREATE) ?? null;
		if (createCheck) return 'BUCKET_CREATE';
		const updateCheck = eventsArray.find((e) => e == AppwriteEvents.BUCKET_UPDATE) ?? null;
		if (updateCheck) return 'BUCKET_UPDATE';
	}
	return null;
}

/**
 * AppwriteChannels
 * Provides methods to fill and create channels for listening
 * @example
 * AppwriteChannels.document("dbId", "colId", "itemId") => `databases.dbId.collections.colId.documents.itemId`
 */
export const AppwriteChannels: AppwriteChannel = {
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

export class Document<T extends Models.Document = Models.Document> implements ReactiveDocument<T> {
	#item = $state<T | null>(null);
	constructor(
		private sveltewrite: SvelteWrite,
		private dbId: string,
		private colId: string,
		private docId: string,
		queries: string[] = []
	) {
		this.sveltewrite.database
			.getDocument<T>(this.dbId, this.colId, this.docId, queries)
			.then((doc) => {
				this.#item = doc;
				this.#listen();
			})
			.catch((e) => console.error(e));
	}
	#listen = async () => {
		const channel = AppwriteChannels.document(this.dbId, this.colId, this.docId);

		this.sveltewrite.client.subscribe<T>(channel, (p) => {
			this.#item = p.payload;
		});
	};
	get item() {
		return this.#item;
	}
}
/**
 * @class BucketFile
 * @implements {FileReturn}
 * A single file from a storage bucket
 * @param SvelteWrite - SvelteWrite instance
 * @param bucketId - Bucket ID
 * @param fileId - File ID
 */
export class BucketFile implements FileReturn {
	#url = $state<URL | null>(null);
	#file = $state<Blob | null>(null);
	constructor(
		private SvelteWrite: SvelteWrite,
		private bucketId: string,
		private fileId: string
	) {
		this.initialLoad();
		return this;
	}
	private initialLoad = async () => {
		try {
			const file = await this.SvelteWrite.storage.getFileDownload(this.bucketId, this.fileId);
			this.#url = file;
			await this.downloadFile();
		} catch (error) {
			throw new Error(`Could not load file`);
		}
	};
	private downloadFile = async () => {
		try {
			if (this.#url) {
				const file = await fetch(this.#url);
				const blob = await file.blob();
				this.#file = blob;
			}
		} catch (error) {
			throw new Error('Could not get file Blob');
		}
	};
	get file() {
		return this.#file;
	}
	get url() {
		return this.#url;
	}
}

/**
 * @class Bucket
 * Represents a Appwrite Storage Bucket
 * @see {Storage}
 */
export class Bucket implements ReactiveBucket {
	#files: Models.File[] = $state<Models.File[]>([]);
	#total: number = $state<number>(0);
	constructor(
		private SvelteWrite: SvelteWrite,
		private bucketId: string,
		queries: string[] = []
	) {
		this.initialLoad(queries).then(() => {
			if (browser) {
				const channel = AppwriteChannels['bucket'](this.bucketId);
				//const channel = fillChannelString(AppwriteChannel.bucket, ['[bucketId]', this.bucketId]);
				this.SvelteWrite.client.subscribe<Models.File>(channel, (payload) => {
					const eventType: keyof AppwriteEvent | null = getEvent('FILES', payload.events);
					if (eventType == 'BUCKET_CREATE') {
						this.addFile(payload.payload);
					} else if (eventType == 'BUCKET_DELETE') {
						this.removeFile(payload.payload.$id);
					} else if (eventType == 'BUCKET_UPDATE') {
						this.removeFile(payload.payload.$id);
						this.addFile(payload.payload);
					}
				});
			}
		});
	}
	get files() {
		return this.#files;
	}
	get total() {
		return this.#total;
	}
	removeFile = (fileId: string) => {
		remove(this.#files, (f) => f.$id == fileId);
		this.#total -= 1;
	};
	addFile = (file: Models.File) => {
		this.#files.push(file);
		this.#total += 1;
	};
	private initialLoad = async (queries: string[] = []) => {
		try {
			const files = await this.SvelteWrite.storage.listFiles(this.bucketId, queries);
			this.#files = files.files;
			this.#total = files.total;
		} catch (error) {
			throw new Error(`Error on intial file load ${error}`);
		}
	};
}

/**
 * @class Collection
 * Realtime / Store Handler for Appwrite Collections
 * @implements {ReactiveCollection<T>}
 */
export class Collection<T extends Models.Document = Models.Document>
	implements ReactiveCollection<T>
{
	#total: number = $state<number>(0);
	#documents: T[] = $state<T[]>([]);
	constructor(
		private SvelteWrite: SvelteWrite,
		private dbId: string,
		private collectionId: string,
		queries: string[] = []
	) {
		const channel = AppwriteChannels.collectionDocuments(this.dbId, this.collectionId);

		this.initialLoad(queries).then(() => {
			if (browser) {
				this.SvelteWrite.client.subscribe<T>(channel, (payload) => {
					const eventType: keyof AppwriteEvent | null = getEvent('DOCUMENTS', payload.events);
					if (eventType == 'DOCUMENT_DELETE') {
						this.removeDocument(payload.payload.$id);
					} else if (eventType == 'DOCUMENT_CREATE') {
						this.addDocument(payload.payload);
					} else if (eventType == 'DOCUMENT_UPDATE') {
						this.removeDocument(payload.payload.$id);
						this.addDocument(payload.payload);
					}
				});
			}
		});
	}
	private addDocument = (document: T) => {
		this.#documents = [...this.#documents, document];
		this.#total += 1;
	};
	private removeDocument = (id: string) => {
		remove(this.#documents, (d) => d.$id == id);
		this.#total -= 1;
	};
	private initialLoad = async (queries: string[] = []) => {
		try {
			const docs = await this.SvelteWrite.database.listDocuments<T>(
				this.dbId,
				this.collectionId,
				queries
			);
			this.#documents = docs.documents;
			this.#total = docs.total;
		} catch (error) {
			throw new Error(`Error on Initial Collection Load ${error}`);
		}
	};
	get total() {
		return this.#total;
	}
	get documents() {
		return this.#documents;
	}
}
/**
 * @class SvelteWrite
 * Primary class to be passed into components
 * @prop {Databases} - Appwrite Databases Class
 * @prop {Storage} - Appwrite Storage Class
 * @prop {Account} - Appwrite Account Class
 */
export default class SvelteWrite {
	database: Databases;
	storage: Storage;
	account: Account;
	graphql: Graphql;
	constructor(public client: Client) {
		this.database = new Databases(this.client);
		this.storage = new Storage(this.client);
		this.account = new Account(this.client);
		this.graphql = new Graphql(this.client);

		return this;
	}
}
