<script lang="ts">
	import './layout.css';
	import '$lib/i18n';
	import { onMount } from 'svelte';
	import { _, isLoading } from 'svelte-i18n';
	import Lenis from 'lenis';

	let { children } = $props();

	onMount(() => {
		let lenis: Lenis;

		const init = async () => {
			const { getGsap } = await import('$lib/gsap');
			const { gsap, ScrollTrigger } = await getGsap();

			lenis = new Lenis();

			lenis.on('scroll', ScrollTrigger.update);

			gsap.ticker.add((time: number) => {
				lenis.raf(time * 1000);
			});

			gsap.ticker.lagSmoothing(0);
		};

		init();

		return () => {
			if (lenis) lenis.destroy();
		};
	});

	const url = 'https://getframe.vercel.app/';
	const image = 'https://getframe.vercel.app/preview.png';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>{$_('meta.title')}</title>
	<meta name="title" content={$_('meta.title')} />
	<meta name="description" content={$_('meta.description')} />
	<meta
		name="keywords"
		content="media converter, ffmpeg gui, video transcoder, audio converter, tauri, rust, svelte, privacy-focused, local-first, macos, windows, linux"
	/>
	<meta name="author" content="Frame" />
	<meta name="theme-color" content="#131315" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={$_('meta.title')} />
	<meta property="og:description" content={$_('meta.description')} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="Frame" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={$_('meta.title')} />
	<meta property="twitter:description" content={$_('meta.description')} />
	<meta property="twitter:image" content={image} />

	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="canonical" href={url} />
</svelte:head>

{#if $isLoading}
	<div class="flex h-screen w-full items-center justify-center">
		<div class="text-gray-alpha-600">Loading...</div>
	</div>
{:else}
	{@render children()}
{/if}
