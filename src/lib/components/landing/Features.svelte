<script lang="ts">
	import {
		FileAudioIcon,
		FileVideoIcon,
		Gif01Icon,
		Queue01Icon,
		Settings02Icon,
		SubtitleIcon
	} from '@hugeicons/core-free-icons';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	type Feature = {
		title: string;
		description: string;
		icon: IconSvgElement;
	};

	const featureRows: { left: Feature; right: Feature }[] = [
		{
			left: {
				title: 'Batch conversion queue',
				description:
					'Add multiple files, choose which items should convert, then pause, resume, retry, or remove jobs while Frame tracks progress per file.',
				icon: Queue01Icon
			},
			right: {
				title: 'Audio formats and levels',
				description:
					'Convert to MP3, M4A, WAV, or FLAC with codec-aware bitrate or quality controls, channel selection, volume, and normalization.',
				icon: FileAudioIcon
			}
		},
		{
			left: {
				title: 'Video encode or stream copy',
				description:
					'Re-encode with full codec and filter controls, or use Cut / Stream Copy for fast trim and remux workflows when the source allows it.',
				icon: FileVideoIcon
			},
			right: {
				title: 'GIF and image export',
				description:
					'Create GIFs with palette, dithering, loop, FPS, and scaling controls, or export still images as PNG, JPG, WebP, BMP, and TIFF.',
				icon: Gif01Icon
			}
		},
		{
			left: {
				title: 'Built-in output presets',
				description:
					'Start from real presets for Balanced MP4, Archive H.265, Web Share, GIF, audio-only, YouTube, TikTok/Reels, X, and Discord.',
				icon: Settings02Icon
			},
			right: {
				title: 'Subtitles and metadata',
				description:
					'Select subtitle tracks or burn captions with font, size, color, outline, and position controls, then preserve, clean, or replace metadata.',
				icon: SubtitleIcon
			}
		}
	];
</script>

<section id="features" data-reveal-section class="relative overflow-hidden">
	<div
		class="mx-auto grid max-w-5xl divide-y divide-dashed divide-frame-gray-100 border-dashed border-frame-gray-100 md:border-x"
	>
		{#each featureRows as row (row.left.title)}
			<div
				class="grid grid-cols-1 divide-y divide-dashed divide-frame-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0"
			>
				{#each [row.left, row.right] as feature (feature.title)}
					<div data-reveal="feature-cell" class="flex h-full items-start gap-4 p-6">
						<span
							data-reveal="feature-icon"
							class="card-highlight relative flex size-10 shrink-0 items-center justify-center rounded-sm bg-frame-gray-100 text-foreground shadow-sm"
						>
							<HugeiconsIcon icon={feature.icon} size={20} strokeWidth={1.5} aria-hidden="true" />
						</span>

						<div class="space-y-1">
							<h2 class="text-lg font-medium text-foreground">{feature.title}</h2>
							<p class="text-balance text-base leading-relaxed text-frame-gray-600">
								{feature.description}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>
