import { browser } from '$app/environment';
import { Account, Client, Storage } from 'appwrite';
import { type Models, Databases } from 'appwrite';
import { remove } from 'lodash-es';
/**
 * @enum AppwriteChannel
 * Appwrite Channels
 */
export enum AppwriteChannel {
	account,
	collectionDocuments,
	documents,
	document,
	files,
	file,
	bucket,
	teams,
	team,
	memberships,
	membership,
	executions,
	execution,
	function
}
/**
 * @enum AppwriteEvent
 * CRUD Event Enum
 */
export enum AppwriteEvent {
	DOCUMENT_DELETE,
	DOCUMENT_CREATE,
	DOCUMENT_UPDATE,
	BUCKET_CREATE,
	BUCKET_DELETE,
	BUCKET_UPDATE
}
/**
 * Mapping of Events to the Event Strings
 */
export const AppwriteEvents: Record<AppwriteEvent, string> = {
	[AppwriteEvent.DOCUMENT_DELETE]: 'databases.*.collections.*.documents.*.delete',
	[AppwriteEvent.DOCUMENT_CREATE]: 'databases.*.collections.*.documents.*.create',
	[AppwriteEvent.DOCUMENT_UPDATE]: 'databases.*.collections.*.documents.*.update',
	[AppwriteEvent.BUCKET_CREATE]: 'buckets.*.files.*.create',
	[AppwriteEvent.BUCKET_DELETE]: 'buckets.*.files.*.delete',
	[AppwriteEvent.BUCKET_UPDATE]: 'buckets.*.files.*.update'
};
/**
 * getEvent()
 * @param type 'FILES' or 'DOCUMENTS'
 * @param eventsArray eventsArray Payload
 * @returns AppwriteEvent
 */
function getEvent(type: 'FILES' | 'DOCUMENTS', eventsArray: string[]) {
	if (type == 'DOCUMENTS') {
		const deleteCheck =
			eventsArray.find((e) => e == AppwriteEvents[AppwriteEvent.DOCUMENT_DELETE]) ?? null;
		if (deleteCheck) return AppwriteEvent.DOCUMENT_DELETE;
		const createCheck =
			eventsArray.find((e) => e == AppwriteEvents[AppwriteEvent.DOCUMENT_CREATE]) ?? null;
		if (createCheck) return AppwriteEvent.DOCUMENT_CREATE;
		const updateCheck =
			eventsArray.find((e) => e == AppwriteEvents[AppwriteEvent.DOCUMENT_UPDATE]) ?? null;
		if (updateCheck) return AppwriteEvent.DOCUMENT_UPDATE;
		return null;
	} else if (type == 'FILES') {
		const deleteCheck =
			eventsArray.find((e) => e == AppwriteEvents[AppwriteEvent.BUCKET_DELETE]) ?? null;
		if (deleteCheck) return AppwriteEvent.BUCKET_DELETE;
		const createCheck =
			eventsArray.find((e) => e == AppwriteEvents[AppwriteEvent.BUCKET_CREATE]) ?? null;
		if (createCheck) return AppwriteEvent.BUCKET_CREATE;
		const updateCheck =
			eventsArray.find((e) => e == AppwriteEvents[AppwriteEvent.BUCKET_UPDATE]) ?? null;
		if (updateCheck) return AppwriteEvent.BUCKET_UPDATE;
	}
	return null;
}
/**
 * Mapping of Channels
 */
export const AppwriteChannels: Record<AppwriteChannel, string> = {
	[AppwriteChannel.account]: 'account',
	[AppwriteChannel.collectionDocuments]: 'databases.[dbId].collections.[collId].documents',
	[AppwriteChannel.documents]: 'documents',
	[AppwriteChannel.document]: 'databases.[dbId].collections.[collId].documents.[itemId]',
	[AppwriteChannel.files]: 'files',
	[AppwriteChannel.file]: 'buckets.[bucketId].files.[itemId]',
	[AppwriteChannel.bucket]: 'buckets.[bucketId].files',
	[AppwriteChannel.teams]: 'teams',
	[AppwriteChannel.team]: 'teams.[teamId]',
	[AppwriteChannel.memberships]: 'memberships',
	[AppwriteChannel.membership]: 'memberships.[membershipId]',
	[AppwriteChannel.executions]: 'executions',
	[AppwriteChannel.execution]: 'executions.[executionId]',
	[AppwriteChannel.function]: 'functions.[fnId]'
};
/**
 * @type Replaceable
 * Replacable Slot for ID
 */
type Replaceable =
	| '[ID]'
	| '[dbId]'
	| '[itemId]'
	| '[bucketId]'
	| '[fileId]'
	| '[collId]'
	| '[fnId]'
	| '[executionId]'
	| '[membershipId]'
	| '[teamId]';
/**
 * fillChannelString()
 * @param channel AppwriteChannel
 * @param r replaceables ['[ID]', "123"] = [ID] => 123
 * @returns Filled string
 */
function fillChannelString(channel: AppwriteChannel, ...r: [Replaceable, string][]) {
	let s = AppwriteChannels[channel];
	r.forEach((rep) => {
		const [key, val] = rep;
		s = s.replaceAll(key, val);
	});
	return s;
}

export class Document<T extends Models.Document = Models.Document> {
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
		const channel = fillChannelString(
			AppwriteChannel.document,
			['[dbId]', this.dbId],
			['[collId]', this.colId],
			['[itemId]', this.docId]
		);
		console.log(channel);
		this.sveltewrite.client.subscribe<T>(channel, (p) => {
			this.#item = p.payload;
		});
	};
	get item() {
		return this.#item;
	}
}

/**
 * @class Bucket
 * Represents a Appwrite Storage Bucket
 * @see {Storage}
 */
export class Bucket {
	#files: Models.File[] = $state<Models.File[]>([]);
	#total: number = $state<number>(0);
	constructor(
		private SvelteWrite: SvelteWrite,
		private bucketId: string,
		queries: string[] = []
	) {
		this.initialLoad(queries).then(() => {
			if (browser) {
				const channel = fillChannelString(AppwriteChannel.bucket, ['[bucketId]', this.bucketId]);
				this.SvelteWrite.client.subscribe<Models.File>(channel, (payload) => {
					console.log(payload);
					const eventType = getEvent('FILES', payload.events);
					if (eventType == AppwriteEvent.BUCKET_CREATE) {
						this.addFile(payload.payload);
					} else if (eventType == AppwriteEvent.BUCKET_DELETE) {
						this.removeFile(payload.payload.$id);
					} else if (eventType == AppwriteEvent.BUCKET_UPDATE) {
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
			console.log(files);
		} catch (error) {
			throw new Error(`Error on intial file load ${error}`);
		}
	};
}

export class Collection<T extends Models.Document = Models.Document> {
	#total: number = $state<number>(0);
	#documents: T[] = $state<T[]>([]);
	constructor(
		private SvelteWrite: SvelteWrite,
		private dbId: string,
		private collectionId: string,
		queries: string[] = []
	) {
		const channel = fillChannelString(
			AppwriteChannel.documents,
			['[dbId]', this.dbId],
			['[collId]', this.collectionId]
		);
		this.initialLoad(queries).then(() => {
			if (browser) {
				this.SvelteWrite.client.subscribe<T>(channel, (payload) => {
					console.log(payload);
					const eventType = getEvent('DOCUMENTS', payload.events);
					if (eventType == AppwriteEvent.DOCUMENT_DELETE) {
						this.removeDocument(payload.payload.$id);
					} else if (eventType == AppwriteEvent.DOCUMENT_CREATE) {
						this.addDocument(payload.payload);
					} else if (eventType == AppwriteEvent.DOCUMENT_UPDATE) {
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
			console.log(this.#documents);
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
export default class SvelteWrite {
	client: Client;
	database: Databases;
	storage: Storage;
	account: Account;
	constructor(
		private _endpoint: string,
		private _projectId: string
	) {
		this.client = new Client();
		this.client.setEndpoint(this._endpoint).setProject(this._projectId);
		this.database = new Databases(this.client);
		this.storage = new Storage(this.client);
		this.account = new Account(this.client);

		return this;
	}
	subscribe = () => {
		return this.client.subscribe;
	};
}
