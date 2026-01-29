<script lang="ts">
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { Download } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '../ui/Grid.svelte';
	import {
		type FrameRelease,
		detectUserPlatform,
		formatPlatformLabel,
		fallbackReleaseUrl,
		resolveInstallerForPlatform
	} from '$lib/release';

	let ctaSection: HTMLElement;
	const props = $props<{ release: FrameRelease | null }>();
	const release = $derived(props.release);

	const releasesPageUrl = $derived(release?.htmlUrl ?? fallbackReleaseUrl);
	const releaseVersion = $derived(release?.version ?? null);

	const withVersion = (label: string) => (releaseVersion ? `${label} · v${releaseVersion}` : label);

	let primaryDownloadUrl = $state(fallbackReleaseUrl);
	let buttonLabel = $state('');
	let platformLabel = $state('');
	let detectedOs = $state<'mac' | 'windows' | 'linux' | 'unknown'>('unknown');

	let ctaTitleSplit: SplitText | null = null;
	let ctaDescSplit: SplitText | null = null;
	let ctaTl: gsap.core.Timeline | null = null;
	let gsapInstance: GSAP | null = null;

	async function initAnimation() {
		await document.fonts.ready;

		const { getGsap } = await import('$lib/gsap');
		const { gsap, SplitText } = await getGsap();
		gsapInstance = gsap;

		if (ctaTitleSplit) ctaTitleSplit.revert();
		if (ctaDescSplit) ctaDescSplit.revert();
		if (ctaTl) ctaTl.kill();

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
	}

	onMount(() => {
		initAnimation();

		return () => {
			if (ctaTitleSplit) ctaTitleSplit.revert();
			if (ctaDescSplit) ctaDescSplit.revert();
			if (ctaTl) ctaTl.kill();
		};
	});

	$effect(() => {
		const platform = detectUserPlatform();

		if (platform.os !== 'unknown') {
			platformLabel = formatPlatformLabel(platform);
			detectedOs = platform.os;
		} else {
			platformLabel = '';
			detectedOs = 'unknown';
		}

		primaryDownloadUrl = releasesPageUrl;

		if (!release) return;

		const installer = resolveInstallerForPlatform(release, platform);
		if (!installer) return;

		primaryDownloadUrl = installer.url;
	});

	$effect(() => {
		const currentLocale = $locale;
		if (currentLocale && gsapInstance) {
			setTimeout(() => initAnimation(), 50);
		}
	});

	const computedButtonLabel = $derived(() => {
		if (detectedOs === 'mac') {
			return withVersion($_('cta.downloadForMac'));
		}
		if (detectedOs === 'windows') {
			return withVersion($_('cta.downloadForWindows'));
		}
		if (detectedOs === 'linux') {
			return withVersion($_('cta.downloadForLinux'));
		}
		return withVersion($_('cta.downloadButton'));
	});
</script>

<section id="cta" bind:this={ctaSection} class="px-4 md:px-8 py-8 relative flex w-full flex-col">
	<Grid></Grid>
	<div class="flex flex-col items-start justify-center">
		<h2 class="mb-4 text-2xl font-medium tracking-tight md:text-4xl text-left">
			{$_('cta.title')}
		</h2>
		<p
			class="text-gray-alpha-600 mb-8 max-w-xl text-lg leading-relaxed md:text-xl text-left text-pretty"
		>
			{$_('cta.description')}
		</p>
	</div>

	<Button href={primaryDownloadUrl} target="_blank" rel="noreferrer" class="w-fit">
		<Download />

		{computedButtonLabel()}
	</Button>

	<a
		href={releasesPageUrl}
		target="_blank"
		rel="external"
		class="text-gray-alpha-600 mt-4 text-xs hover:text-foreground w-fit transition-colors"
	>
		{#if platformLabel}
			{$_('cta.detectedPlatform', { values: { platform: platformLabel } })}
		{:else}
			{$_('cta.browseDownloads')}
		{/if}
	</a>
</section>
