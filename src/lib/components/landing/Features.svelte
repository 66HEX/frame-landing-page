<script lang="ts">
	import { onMount } from 'svelte';
	import { Cpu, FileVideo, Layers } from 'lucide-svelte';
	import { gsap, SplitText } from '$lib/gsap';

	let container: HTMLElement;

	onMount(() => {
		let splits: SplitText[] = [];
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			const gridItems = container.querySelectorAll('.grid-feature');

			gridItems.forEach((item, i) => {
				const icon = item.querySelector('svg');
				const textSplit = new SplitText(item.querySelectorAll('h3, p'), {
					type: 'lines',
					mask: 'lines'
				});
				splits.push(textSplit);

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
			});
		};

		init();

		return () => {
			mounted = false;
			splits.forEach((s) => s.revert());
		};
	});
</script>

<section
	id="features"
	bind:this={container}
	class="lg:grid-cols-3 lg:divide-y-0 md:divide-x divide-gray-alpha-100 grid w-full grid-cols-1 divide-y"
>
	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-blue-700/10 hover:ring-blue-700 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<FileVideo class="size-6 md:size-8 text-blue-700" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				Universal Formats
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			Full support for MP4, MKV, WebM, and MOV containers. Encode efficiently with H.264, H.265,
			VP9, and Apple ProRes.
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-blue-700/10 hover:ring-blue-700 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<Cpu class="size-6 md:size-8 text-blue-700" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				Hardware Accelerated
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			Leverage native power with Apple Silicon and NVIDIA NVENC integration for lightning-fast,
			battery-efficient encoding.
		</p>
	</div>

	<div
		class="px-4 md:px-8 py-8 gap-4 grid-feature hover:bg-blue-700/10 hover:ring-blue-700 flex flex-col ring-0 ring-transparent transition-all hover:ring-1"
	>
		<div class="gap-2 flex items-center">
			<Layers class="size-6 md:size-8 text-blue-700" />
			<h3 class="text-foreground font-medium text-xl md:text-2xl tracking-tight leading-none">
				Batch Workflow
			</h3>
		</div>
		<p class="text-gray-alpha-600 leading-relaxed text-lg text-pretty">
			Queue unlimited files with independent settings. Save your favorite configurations as custom
			presets for one-click reuse.
		</p>
	</div>
</section>
