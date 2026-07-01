<script lang="ts">
	import { Download01Icon, HeartIcon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { sponsorshipUrl } from '$lib/release';
	import Button from '$lib/components/ui/Button.svelte';

	const props = $props<{
		buttonLabel: string;
		downloadUrl: string;
		platformLabel: string;
		releasesPageUrl: string;
	}>();
</script>

<section data-reveal-section class="relative overflow-hidden">
	<div
		class="mx-auto flex max-w-5xl flex-col items-start justify-center border-dashed border-frame-gray-100 p-6 text-center md:items-center md:border-x"
	>
		<h2 class="max-w-2xl text-left font-medium text-foreground md:text-center text-2xl">
			Ready to convert?
		</h2>

		<p
			class="mx-auto mt-2 max-w-xl text-left text-base leading-relaxed text-balance text-frame-gray-600 md:text-center"
		>
			Download the latest native build and run FFmpeg-powered conversion workflows directly on your
			machine.
		</p>

		<div data-reveal="actions" class="mt-6 flex items-center justify-center gap-3">
			<Button href={props.downloadUrl} target="_blank" rel="noreferrer">
				<HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
				{props.buttonLabel}
			</Button>

			<Button variant="secondary" href={sponsorshipUrl} target="_blank" rel="noreferrer">
				<HugeiconsIcon icon={HeartIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
				Sponsor Frame
			</Button>
		</div>

		<a
			data-reveal="card"
			class="mt-4 text-left text-xs leading-relaxed text-frame-gray-600 transition-colors duration-100 ease-out hover:text-foreground md:text-center"
			href={props.releasesPageUrl}
			target="_blank"
			rel="external"
		>
			{#if props.platformLabel}
				Detected {props.platformLabel}. Need another build? Browse all downloads on GitHub.
			{:else}
				Browse all download options on GitHub.
			{/if}
		</a>
	</div>
</section>
