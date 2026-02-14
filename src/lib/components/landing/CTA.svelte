<script lang="ts">
	import { onMount } from 'svelte';
	import { Download, Heart } from 'lucide-svelte';
	import { gsap, SplitText } from '$lib/gsap';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '../ui/Grid.svelte';
	import {
		type FrameRelease,
		detectUserPlatform,
		formatPlatformLabel,
		fallbackReleaseUrl,
		resolveInstallerForPlatform,
		sponsorshipUrl
	} from '$lib/release';

	let ctaSection: HTMLElement;
	const props = $props<{ release: FrameRelease | null }>();
	const release = $derived(props.release);

	const releasesPageUrl = $derived(release?.htmlUrl ?? fallbackReleaseUrl);
	const releaseVersion = $derived(release?.version ?? null);

	const withVersion = (label: string) => (releaseVersion ? `${label} · v${releaseVersion}` : label);
	const fallbackButtonLabel = $derived(withVersion('Download Frame'));

	let primaryDownloadUrl = $state(fallbackReleaseUrl);
	let buttonLabel = $state('Download Frame');
	let platformLabel = $state('');

	$effect(() => {
		primaryDownloadUrl = releasesPageUrl;
		buttonLabel = fallbackButtonLabel;
	});

	onMount(() => {
		let ctaTitleSplit: SplitText;
		let ctaDescSplit: SplitText;
		let ctaTl: gsap.core.Timeline;
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			ctaTitleSplit = new SplitText(ctaSection.querySelector('h2'), {
				type: 'lines',
				mask: 'lines'
			});
			ctaDescSplit = new SplitText(ctaSection.querySelector('p'), {
				type: 'lines',
				mask: 'lines'
			});

			ctaTl = gsap.timeline({
				scrollTrigger: {
					trigger: ctaSection,
					start: 'top 85%'
				}
			});

			ctaTl
				.fromTo(
					ctaTitleSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 1.2, ease: 'custom-ease' }
				)
				.fromTo(
					ctaDescSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, stagger: 0.1, duration: 1.2, ease: 'custom-ease' },
					'-=0.8'
				)
				.fromTo(
					ctaSection.querySelectorAll('a'),
					{ opacity: 0, y: 10 },
					{ opacity: 1, y: 0, stagger: 0.1, duration: 1.0, ease: 'custom-ease' },
					'-=0.8'
				);
		};

		init();

		return () => {
			mounted = false;
			if (ctaTitleSplit) ctaTitleSplit.revert();
			if (ctaDescSplit) ctaDescSplit.revert();
			if (ctaTl) ctaTl.kill();
		};
	});

	$effect(() => {
		const platform = detectUserPlatform();

		if (platform.os !== 'unknown') {
			platformLabel = formatPlatformLabel(platform);
		} else {
			platformLabel = '';
		}

		if (!release) return;

		const installer = resolveInstallerForPlatform(release, platform);
		if (!installer) return;

		primaryDownloadUrl = installer.url;

		if (platform.os === 'mac') {
			buttonLabel = withVersion('Download for macOS');
			return;
		}

		if (platform.os === 'windows') {
			buttonLabel = withVersion('Download for Windows');
			return;
		}

		buttonLabel = withVersion('Download for Linux');
	});
</script>

<section id="cta" bind:this={ctaSection} class="px-4 md:px-8 py-8 relative flex w-full flex-col">
	<Grid></Grid>
	<div class="flex flex-col items-start justify-center">
		<h2 class="mb-4 text-2xl font-medium tracking-tight md:text-4xl text-left">
			Ready to convert?
		</h2>
		<p
			class="text-gray-alpha-600 mb-8 max-w-xl text-lg leading-relaxed md:text-xl text-left text-pretty"
		>
			Join hundreds of users who have switched to a faster, more private way to handle their media.
			Experience the new standard of media processing.
		</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<Button href={primaryDownloadUrl} target="_blank" rel="noreferrer" class="w-fit">
			<Download />

			{buttonLabel}
		</Button>
		<Button variant="secondary" href={sponsorshipUrl} target="_blank" rel="noreferrer" class="w-fit">
			<Heart />
			Sponsor Frame
		</Button>
	</div>

	<a
		href={releasesPageUrl}
		target="_blank"
		rel="external"
		class="text-gray-alpha-600 mt-4 text-xs hover:text-foreground w-fit transition-colors"
	>
		{#if platformLabel}
			Detected {platformLabel}. Need another build? Browse all downloads on GitHub.
		{:else}
			Browse all download options on GitHub.
		{/if}
	</a>
</section>
