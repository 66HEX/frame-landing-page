<script lang="ts">
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';

	let section1: HTMLElement;
	let section2: HTMLElement;
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

		splits.forEach((split) => split.revert());
		splits = [];

		const currentLocale = $locale;
		const useSplitText = !isCJKLocale(currentLocale);

		if (section1) {
			const paragraphs1 = Array.from(section1.querySelectorAll('p'));

			if (useSplitText) {
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
			} else {
				// CJK languages use fade-in animation
				gsap.fromTo(
					paragraphs1,
					{ opacity: 0, y: 30 },
					{
						scrollTrigger: {
							trigger: section1,
							start: 'top 85%'
						},
						opacity: 1,
						y: 0,
						stagger: 0.2,
						duration: 1,
						ease: 'custom-ease'
					}
				);
			}
		}

		if (section2) {
			const paragraphs2 = Array.from(section2.querySelectorAll('p'));

			if (useSplitText) {
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
			} else {
				// CJK 语言使用整段淡入动画
				paragraphs2.forEach((paragraph, index) => {
					gsap.fromTo(
						paragraph,
						{ opacity: 0, y: 30 },
						{
							scrollTrigger: {
								trigger: paragraph,
								start: 'top 85%'
							},
							opacity: 1,
							y: 0,
							duration: 1,
							ease: 'custom-ease',
							delay: index * 0.2
						}
					);
				});
			}
		}
	}

	onMount(() => {
		initAnimation();

		return () => {
			splits.forEach((split) => split.revert());
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
	id="story"
	class="lg:grid-cols-2 lg:divide-x divide-gray-alpha-100 lg:divide-y-0 grid w-full grid-cols-1 divide-y"
>
	<div bind:this={section1} class="px-4 md:px-8 py-8 gap-4 divide-gray-alpha-100 flex flex-col">
		<p class="text-gray-alpha-600 text-lg leading-relaxed md:text-xl">
			<span class="text-foreground font-medium tracking-tight">
				{$_('story.section1.highlight')}
			</span>
			{$_('story.section1.text')}
		</p>
		<p class="text-gray-alpha-600 text-lg leading-relaxed md:text-xl">
			{$_('story.section2.text')}
		</p>
	</div>

	<div bind:this={section2} class="divide-gray-alpha-100 flex flex-col divide-y">
		<p class="px-4 md:px-8 py-8 text-gray-alpha-600 text-lg leading-relaxed md:text-xl">
			<span class="text-foreground font-medium tracking-tight">
				{$_('story.section3.highlight')}
			</span>
			{$_('story.section3.text')}
		</p>

		<p class="px-4 md:px-8 py-8 text-gray-alpha-600 text-lg leading-relaxed md:text-xl">
			<span class="text-foreground font-medium tracking-tight">
				{$_('story.section4.highlight')}
			</span>
			{$_('story.section4.text')}
		</p>
	</div>
</section>
