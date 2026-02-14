<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Grid from '../ui/Grid.svelte';
	import { fallbackReleaseUrl, type FrameRelease } from '$lib/release';

	let heroTitle: HTMLElement;
	let heroDesc: HTMLElement;
	let heroButtons: HTMLElement;
	let previewImg: HTMLElement;
	const props = $props<{ release: FrameRelease | null }>();
	const release = $derived(props.release);

	const releaseVersion = $derived(release?.version ?? null);
	const downloadUrl = $derived(release?.htmlUrl ?? fallbackReleaseUrl);
	const downloadLabel = $derived(
		releaseVersion ? `Download Frame v${releaseVersion}` : 'Download Frame'
	);

	onMount(() => {
		let tl: gsap.core.Timeline;
		let titleSplit: SplitText;
		let descSplit: SplitText;
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			tl = gsap.timeline();
			titleSplit = new SplitText(heroTitle, { type: 'lines', mask: 'lines' });
			descSplit = new SplitText(heroDesc, { type: 'lines', mask: 'lines' });

			tl.fromTo(
				titleSplit.lines,
				{ yPercent: 100 },
				{ yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' }
			)
				.fromTo(
					descSplit.lines,
					{ yPercent: 100 },
					{ yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'custom-ease' },
					'-=1.0'
				)
				.fromTo(
					heroButtons.children,
					{ opacity: 0, y: 10 },
					{ opacity: 1, y: 0, duration: 1.2, ease: 'custom-ease' },
					'-=1.0'
				)
				.fromTo(
					previewImg,
					{
						opacity: 0,
						scale: 0.95,
						y: 40,
						filter: 'blur(10px)'
					},
					{
						opacity: 1,
						scale: 1,
						y: 0,
						filter: 'blur(0px)',
						duration: 1.6,
						ease: 'custom-ease'
					},
					'-=0.6'
				);

			gsap.set([heroTitle, heroDesc, heroButtons], { opacity: 1 });
		};

		init();

		return () => {
			mounted = false;
			if (titleSplit) titleSplit.revert();
			if (descSplit) descSplit.revert();
			if (tl) tl.kill();
		};
	});
</script>

<section
	class="px-4 md:px-8 pt-48 md:pt-48 pb-24 md:pb-24 relative z-10 flex w-full flex-col items-center justify-center text-center"
>
	<Grid />

	<h1
		bind:this={heroTitle}
		class="text-foreground mb-4 text-4xl font-medium tracking-tight md:text-5xl opacity-0"
	>
		Media conversion <span class="text-blue-700">reimagined.</span>
	</h1>

	<p
		bind:this={heroDesc}
		class="text-gray-alpha-600 mb-8 max-w-xl text-lg leading-relaxed md:text-xl text-pretty opacity-0"
	>
		A lightning-fast, aesthetically pleasing media converter for macOS, Windows, and Linux. Built
		with Tauri, Svelte 5, and Rust.
	</p>

	<div bind:this={heroButtons} class="gap-4 sm:flex-row flex flex-col items-center opacity-0">
		<Button class="group" size="lg" href={downloadUrl} target="_blank" rel="noreferrer">
			<DownloadIcon />

			{downloadLabel}
		</Button>
	</div>
</section>

<section class="px-4 md:px-8 py-8 relative w-full overflow-hidden">
	<div class="relative z-10">
		<img
			bind:this={previewImg}
			src="/preview.png"
			alt="Frame Application Preview"
			class="h-auto w-full opacity-0"
		/>
	</div>
	<div
		class="h-25 -bottom-12.5 -left-12.5 md:h-100 md:-bottom-50 md:-left-50 lg:h-200 bg-blue-700/80 lg:-bottom-100 lg:-left-100 absolute z-0 aspect-square rounded-full blur-[100px]"
	></div>
	<div
		class="h-25 -top-12.5 -right-12.5 md:h-100 md:-top-50 md:-right-50 lg:h-200 bg-blue-700/80 lg:-top-100 lg:-right-100 absolute z-0 aspect-square rounded-full blur-[100px]"
	></div>
</section>
