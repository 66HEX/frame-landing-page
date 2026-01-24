import type { PageLoad } from './$types';
import { fetchLatestRelease } from '$lib/release';

export const load: PageLoad = async ({ fetch }) => {
	const release = await fetchLatestRelease(fetch);

	return {
		release
	};
};
