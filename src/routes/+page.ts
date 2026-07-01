import type { PageLoad } from './$types';
import { fetchLatestRelease } from '$lib/release';

export const load: PageLoad = async ({ fetch }) => {
	return {
		release: await fetchLatestRelease(fetch)
	};
};
