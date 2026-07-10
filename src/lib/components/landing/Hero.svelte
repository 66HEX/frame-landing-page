<script lang="ts">
	import { Download01Icon, GithubIcon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { repositoryUrl } from '$lib/release';
	import Button from '$lib/components/ui/Button.svelte';
	import { GodRays } from '$lib/motion-core';

	const props = $props<{
		downloadLabel: string;
		downloadUrl: string;
		githubStars?: number | null;
	}>();

	const formattedGithubStars = $derived(
		typeof props.githubStars === 'number'
			? new Intl.NumberFormat('en-US', {
					notation: 'compact',
					maximumFractionDigits: 1
				}).format(props.githubStars)
			: '--'
	);
</script>

<section data-reveal-section class="relative overflow-hidden">
	<div
		class="relative z-10 mx-auto mt-16 flex max-w-5xl flex-col items-center gap-3 px-6 py-16 text-center"
	>
		<p
			data-reveal="badge"
			class="card-highlight rounded-sm bg-frame-gray-100 px-2.5 py-1.5 text-xs font-medium leading-none text-foreground"
		>
			Native Rust utility powered by FFmpeg.
		</p>

		<h1 class="text-balance text-2xl font-medium text-foreground md:text-4xl">
			Media conversion reimagined.
		</h1>

		<p class="max-w-2xl text-balance text-lg leading-relaxed text-frame-gray-600">
			A native Rust media conversion utility for macOS, Windows, and Linux. Built with GPUI-CE and
			powered by FFmpeg and FFprobe.
		</p>

		<div data-reveal="actions" class="flex w-full flex-row items-center justify-center gap-3">
			<Button href={props.downloadUrl} target="_blank" rel="noreferrer">
				<HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
				{props.downloadLabel}
			</Button>

			<Button variant="secondary" href={repositoryUrl} target="_blank" rel="noreferrer">
				<HugeiconsIcon icon={GithubIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
				Github
				<span aria-hidden="true" class="text-frame-gray-600/45">|</span>
				<span>{formattedGithubStars}</span>
			</Button>
		</div>

		<img
			data-reveal="card"
			src="/preview.png"
			alt="Frame app preview"
			class="w-full mt-10 object-cover"
			width="2624"
			height="1824"
		/>
	</div>
	<GodRays
		backgroundColor="#14161A"
		color="#EBEBFF"
		intensity={0.1}
		lightSpread={1}
		rayLength={1}
		class="absolute inset-x-0 top-14"
	/>
</section>
