import type { Models, RealtimeResponseEvent } from 'appwrite';

/**
 * Returned by `let:collection` in the `SW.Collection` component
 */
export interface ReactiveCollection<T extends Models.Document = Models.Document> {
	total: number;
	documents: T[];
}
/**
 * Return Type for `let:document` in `SW.Document`
 */
export interface ReactiveDocument<T extends Models.Document = Models.Document> {
	item: T | null;
}
/**
 * Type of return in `SW.Bucket` with `let:bucket`
 */
export interface ReactiveBucket {
	files: Models.File[];
	total: number;
}
export interface FileReturn {
	file: Blob | null;
	url: URL | null;
}
/**
 * @type Replaceable
 * Replacable Slot for ID
 */
export type Replaceable =
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
 * @type RealtimeCallback
 * A callback to be passed to the realtime listener
 * @example `client.listen([channels], callback)`
 */
export type RealtimeCallback<T extends Record<string, unknown> = Record<string, unknown>> = (
	e: RealtimeResponseEvent<T>
) => void | Promise<void>;
/**
 * @enum AppwriteChannel
 * Appwrite Channels, acts as keys for "AppwriteChannels"
 */
export interface AppwriteChannel {
	account: () => string;
	collectionDocuments: (dbId: string, colId: string) => string;
	documents: () => string;
	document: (dbId: string, colId: string, itemId: string) => string;
	files: () => string;
	file: (bucketId: string, itemId: string) => string;
	bucket: (bucketId: string) => string;
	teams: () => string;
	team: (teamId: string) => string;
	memberships: () => string;
	membership: (memId: string) => string;
	executions: () => string;
	execution: (exeId: string) => string;
	function: (fnId: string) => string;
}

/**
 * @enum AppwriteEvent
 * CRUD Event Enum
 */
export interface AppwriteEvent {
	DOCUMENT_DELETE: string;
	DOCUMENT_CREATE: string;
	DOCUMENT_UPDATE: string;
	BUCKET_CREATE: string;
	BUCKET_DELETE: string;
	BUCKET_UPDATE: string;
}
