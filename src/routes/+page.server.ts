import type { PageServerLoad } from './$types';
import { fetchLatestRelease } from '$lib/release';
import { fetchGitHubStars } from '$lib/server/github';

export const load: PageServerLoad = async ({ fetch }) => {
	const [release, githubStars] = await Promise.all([fetchLatestRelease(fetch), fetchGitHubStars()]);

	return {
		release,
		githubStars
	};
};
