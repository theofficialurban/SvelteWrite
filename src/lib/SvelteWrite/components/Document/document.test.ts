import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { Client } from 'appwrite';
import { Document as AppwriteDocument } from '../../../../../dist/index.js';
import { SvelteWrite } from '../../../../../dist/index.js';
const client = new Client()
	.setProject('657df22a1439a12f822a')
	.setEndpoint('https://cloud.appwrite.io/v1');
const sveltewrite = new SvelteWrite(client);

it('Component Mounts to DOM', () => {
	const doc = render(AppwriteDocument, {
		props: {
			sveltewrite,
			dbId: 'main',
			colId: 'posts',
			docId: '65908abe506dfa411615'
		}
	});
	expect(doc).toBeDefined();
});
it('No Document To be Returned with bad information', async () => {
	render(AppwriteDocument, {
		props: {
			sveltewrite,
			dbId: 'some',
			colId: 'some',
			docId: 'ffff'
		}
	});
	// Expect to see div with testid loading not loaded
	expect(screen.queryByTestId('loaded')).toBeNull();
	expect(screen.queryByTestId('loading')).toBeDefined();
});

it('Gets the correct post', async () => {
	render(AppwriteDocument, {
		props: {
			sveltewrite,
			dbId: 'main',
			colId: 'posts',
			docId: '65908abe506dfa411615'
		}
	});
	expect(screen.queryByTestId('loaded')).toBeDefined();
});
