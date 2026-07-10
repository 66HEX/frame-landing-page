<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import CTA from '$lib/components/landing/CTA.svelte';
	import FAQ from '$lib/components/landing/FAQ.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Story from '$lib/components/landing/Story.svelte';
	import {
		detectUserPlatform,
		fallbackReleaseUrl,
		formatPlatformLabel,
		resolveInstallerForPlatform,
		type UserPlatform
	} from '$lib/release';

	const props = $props<{ data: PageData }>();

	const release = $derived(props.data.release);
	const releaseVersion = $derived(release?.version ?? null);
	const releasesPageUrl = $derived(release?.htmlUrl ?? fallbackReleaseUrl);
	const heroDownloadLabel = $derived(
		releaseVersion ? `Download Frame v${releaseVersion}` : 'Download Frame'
	);

	let platform = $state<UserPlatform>({ os: 'unknown', arch: null });
	let mainContent = $state<HTMLElement | null>(null);
	let landingAnimationState = $state<'preparing' | 'ready'>('preparing');

	const withVersion = (label: string) => (releaseVersion ? `${label} · v${releaseVersion}` : label);
	const platformLabel = $derived(platform.os === 'unknown' ? '' : formatPlatformLabel(platform));
	const platformInstaller = $derived(
		release ? resolveInstallerForPlatform(release, platform) : null
	);
	const primaryDownloadUrl = $derived(platformInstaller?.url ?? releasesPageUrl);
	const buttonLabel = $derived.by(() => {
		if (platform.os === 'mac') return withVersion('Download for macOS');
		if (platform.os === 'windows') return withVersion('Download for Windows');
		if (platform.os === 'linux') return withVersion('Download for Linux');

		return withVersion('Download Frame');
	});

	onMount(() => {
		platform = detectUserPlatform();

		let destroyAnimations = () => {};
		let isActive = true;

		const setupAnimations = async () => {
			if (!mainContent) {
				landingAnimationState = 'ready';
				return;
			}

			try {
				const { createLandingScrollAnimations } = await import('$lib/animations/landing');
				if (!isActive || !mainContent) return;
				destroyAnimations = createLandingScrollAnimations(mainContent);
			} finally {
				if (isActive) {
					landingAnimationState = 'ready';
				}
			}
		};

		void setupAnimations();

		return () => {
			isActive = false;
			destroyAnimations();
		};
	});
</script>

<svelte:head>
	<title>Frame - Media conversion reimagined</title>
	<meta
		name="description"
		content="A native Rust media conversion utility for macOS, Windows, and Linux, built with GPUI-CE and powered by FFmpeg."
	/>
	<meta property="og:title" content="Frame - Media conversion reimagined" />
	<meta
		property="og:description"
		content="A native GPUI-CE desktop interface for FFmpeg operations, backed by a reusable Rust conversion core."
	/>
	<meta property="og:image" content="/og-image.jpg" />
</svelte:head>

<Navbar {releasesPageUrl} />

<main
	id="main-content"
	bind:this={mainContent}
	tabindex="-1"
	data-landing-anim-root
	data-landing-anim-state={landingAnimationState}
	class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col divide-y divide-frame-gray-100 overflow-hidden border-frame-gray-100 md:border-x"
>
	<Hero
		downloadLabel={heroDownloadLabel}
		downloadUrl={primaryDownloadUrl}
		githubStars={props.data.githubStars}
	/>
	<Features />
	<Story />
	<FAQ />
	<CTA {buttonLabel} downloadUrl={primaryDownloadUrl} {platformLabel} {releasesPageUrl} />
	<Footer />
</main>
