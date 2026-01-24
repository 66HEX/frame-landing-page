<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, SplitText } from '$lib/gsap';

	let section1: HTMLElement;
	let section2: HTMLElement;

	onMount(() => {
		let splits: SplitText[] = [];
		let mounted = true;

		const init = async () => {
			await document.fonts.ready;
			if (!mounted) return;

			if (section1) {
				const paragraphs1 = Array.from(section1.querySelectorAll('p'));
				const lines1: Element[] = [];

				paragraphs1.forEach((p) => {
					const split = new SplitText(p, { type: 'lines', mask: 'lines' });
					splits.push(split);
					if (split.lines) lines1.push(...split.lines);
				});

				if (lines1.length > 0) {
					gsap.fromTo(
						lines1,
						{ yPercent: 100 },
						{
							scrollTrigger: {
								trigger: section1,
								start: 'top 85%'
							},
							yPercent: 0,
							stagger: 0.1,
							duration: 1.2,
							ease: 'custom-ease',
							delay: 0
						}
					);
				}
			}

			if (section2) {
				const paragraphs2 = Array.from(section2.querySelectorAll('p'));

				paragraphs2.forEach((paragraph, index) => {
					const split = new SplitText(paragraph, {
						type: 'lines',
						mask: 'lines'
					});
					splits.push(split);

					gsap.fromTo(
						split.lines,
						{ yPercent: 100 },
						{
							scrollTrigger: {
								trigger: paragraph,
								start: 'top 85%'
							},
							yPercent: 0,
							stagger: 0.1,
							duration: 1.2,
							ease: 'custom-ease',
							delay: (index + 1) * 0.5
						}
					);
				});
			}
		};

		init();

		return () => {
			mounted = false;
			splits.forEach((split) => split.revert());
		};
	});
</script>

<section
	id="story"
	class="lg:grid-cols-2 lg:divide-x divide-gray-alpha-100 lg:divide-y-0 grid w-full grid-cols-1 divide-y"
>
	<div bind:this={section1} class="px-4 md:px-8 py-8 gap-4 divide-gray-alpha-100 flex flex-col">
		<p class="text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			<span class="text-foreground font-medium tracking-tight">
				Frame was born from a frustration with existing tools.
			</span>
			Media conversion shouldn't require a degree in video engineering or a command-line interface. We
			built Frame to be the tool we wanted to use: invisible when you don't need it, and incredibly powerful
			when you do. By leveraging Tauri and Rust, we've achieved a level of performance that feels native
			because it is native.
		</p>
		<p class="text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			This efficiency allows us to provide a seamless experience where the complexity of FFmpeg is
			tucked away behind a responsive, fluid interface. It means no more waiting for a bloated
			application to launch or struggling with non-standard UI patterns. Everything is optimized to
			get you from raw file to final output with as few clicks as possible, without sacrificing the
			precision that high-end transcoding requires.
		</p>
	</div>

	<div bind:this={section2} class="divide-gray-alpha-100 flex flex-col divide-y">
		<p class="px-4 md:px-8 py-8 text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			<span class="text-foreground font-medium tracking-tight">
				In an era where every utility seems to require an account, Frame stands apart.
			</span>
			It is strictly local-first software. Your media files never leave your device. There is no server-side
			processing, no telemetry that spies on your content, and no upload bars to watch. This architectural
			decision ensures not only absolute privacy but also maximum speed.
		</p>

		<p class="px-4 md:px-8 py-8 text-gray-alpha-600 text-lg leading-relaxed md:text-xl text-pretty">
			<span class="text-foreground font-medium tracking-tight">
				Under the minimalist exterior lies the industry-standard FFmpeg engine.
			</span>
			Whether you're transcoding terabytes of raw footage for an archive or just compressing a quick screen
			recording, Frame adapts. It exposes the granular controls professionals need—bitrate, codecs, containers—without
			overwhelming casual users.
		</p>
	</div>
</section>
