<script lang="ts">
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';
	import { Cpu, FilePlay, Layers, Languages } from 'lucide-svelte';

	let container: HTMLElement;
	let splits: SplitText[] = [];
	let gsapInstance: GSAP | null = null;

	function isCJKLocale(loc: string | null | undefined): boolean {
		if (!loc) return false;
		return ['zh', 'ja', 'ko'].includes(loc);
	}

	async function initAnimation() {
		await document.fonts.ready;

		const { getGsap } = await import('$lib/gsap');
		const { gsap, SplitText } = await getGsap();
		gsapInstance = gsap;

		splits.forEach((s) => s.revert());
		splits = [];

		const gridItems = container.querySelectorAll('.grid-feature');
		const currentLocale = $locale;
		const useSplitText = !isCJKLocale(currentLocale);

		gridItems.forEach((item, i) => {
			const icon = item.querySelector('svg');
			const textElements = item.querySelectorAll('h3, p');

			if (icon) {
				gsap.fromTo(
					icon,
					{
						scale: 0,
						rotate: -10
					},
					{
						scrollTrigger: {
							trigger: item,
							start: 'top 85%'
						},
						scale: 1,
						rotate: 0,
						duration: 0.8,
						ease: 'back.out(1.7)',
						delay: i * 0.5
					}
				);
			}

			if (useSplitText) {
				const textSplit = new SplitText(textElements, {
					type: 'lines',
					mask: 'lines'
				});
				splits.push(textSplit);

				gsap.fromTo(
					textSplit.lines,
					{ yPercent: 100 },
					{
						scrollTrigger: {
							trigger: item,
							start: 'top 85%'
						},
						yPercent: 0,
						stagger: 0.1,
						duration: 1.2,
						ease: 'custom-ease',
						delay: i * 0.5
					}
				);
			} else {
				// CJK languages use fade-in animation
				gsap.fromTo(
					textElements,
					{ opacity: 0, y: 20 },
					{
						scrollTrigger: {
							trigger: item,
							start: 'top 85%'
						},
						opacity: 1,
						y: 0,
						stagger: 0.1,
						duration: 0.8,
						ease: 'custom-ease',
						delay: i * 0.3
					}
				);
			}
		});
	}

	onMount(() => {
		initAnimation();

		return () => {
			splits.forEach((s) => s.revert());
		};
	});

	$effect(() => {
		const currentLocale = $locale;
		if (currentLocale && gsapInstance) {
			setTimeout(() => initAnimation(), 50);
		}
	});
</script>

<section
	id="features"
	bind:this={container}
	class="lg:grid-cols-4 lg:divide-y-0 md:divide-x divide-gray-alpha-100 grid w-full grid-cols-1 divide-y"
>
	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-ds-blue-600/10 hover:ring-ds-blue-600 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<FilePlay class="size-6 md:size-8 text-ds-blue-600 pb-1" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				{$_('features.universalFormats.title')}
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			{$_('features.universalFormats.description')}
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-ds-blue-600/10 hover:ring-ds-blue-600 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<Cpu class="size-6 md:size-8 text-ds-blue-600 pb-0.5" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				{$_('features.hardwareAccelerated.title')}
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			{$_('features.hardwareAccelerated.description')}
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-ds-blue-600/10 hover:ring-ds-blue-600 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<Layers class="size-6 md:size-8 text-ds-blue-600 pb-0.5" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				{$_('features.batchWorkflow.title')}
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			{$_('features.batchWorkflow.description')}
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-ds-blue-600/10 hover:ring-ds-blue-600 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<Languages class="size-6 md:size-8 text-ds-blue-600 pb-0.5" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				{$_('features.multiLanguage.title')}
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			{$_('features.multiLanguage.description')}
		</p>
	</div>
</section>
