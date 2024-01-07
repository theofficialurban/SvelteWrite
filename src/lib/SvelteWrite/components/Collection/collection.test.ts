import { expect, expectTypeOf, it, describe } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import * as matchers from 'vitest-dom/matchers.js';
import '@testing-library/jest-dom';
import { Client, type Models } from 'appwrite';
//import { Collection } from '../../../../../dist/index.js';
import Collection from './collection.svelte';
import { SvelteWrite } from '../../../../../dist/index.js';
expect.extend(matchers);

const client = new Client()
	.setProject('657df22a1439a12f822a')
	.setEndpoint('https://cloud.appwrite.io/v1');
const sveltewrite = new SvelteWrite(client);
const col = render(Collection, {
	props: {
		sveltewrite,
		dbId: 'main',
		colId: 'posts'
	}
});
const wait = (seconds: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, seconds * 1000);
	});
};
describe('Component Mounts & Collection is Defined', async () => {
	const coll = col.component.collection;
	it('Mounts the component', async () => {
		expect(col).toBeDefined();
	});
	it('Collection Defined', async () => {
		expect(coll).toBeDefined();
	});

	await wait(2);
	it('Collection has Documents', async () => {
		expect(coll.total).toBeGreaterThan(0);
	});
});
