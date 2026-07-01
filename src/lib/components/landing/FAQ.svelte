<script lang="ts">
	import { ChevronDownIcon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	type FaqItem = {
		question: string;
		answer: string;
	};

	const faq: FaqItem[] = [
		{
			question: 'What is Frame?',
			answer:
				'Frame is a native Rust desktop utility with a GPUI-CE interface for FFmpeg video, audio, image, subtitle, and metadata workflows.'
		},
		{
			question: 'Does Frame upload my files?',
			answer:
				'No. Frame processes media locally on your device, so source files do not leave your machine.'
		},
		{
			question: 'Which formats does Frame support?',
			answer:
				'Frame exports MP4, MKV, WebM, MOV, GIF, PNG, JPG, WebP, BMP, TIFF, MP3, M4A, WAV, and FLAC, with codec-aware settings.'
		},
		{
			question: 'Does Frame use hardware acceleration?',
			answer:
				'Yes. Frame detects available FFmpeg encoders such as VideoToolbox and NVIDIA NVENC, then exposes compatible hardware paths.'
		},
		{
			question: 'Can I batch convert files?',
			answer: 'Yes. Frame supports queues with independent settings and reusable presets.'
		}
	];

	let openFaq = $state('What is Frame?');

	function toggleFaq(question: string) {
		openFaq = openFaq === question ? '' : question;
	}
</script>

<section id="faq" data-reveal-section class="relative overflow-hidden">
	<div class="mx-auto max-w-5xl border-dashed border-frame-gray-100 p-6 text-center md:border-x">
		<h2 class="max-w-2xl text-left text-2xl font-medium text-foreground">
			Frequently Asked Questions
		</h2>

		<p class="mt-2 max-w-lg text-left text-base leading-relaxed text-balance text-frame-gray-600">
			Quick answers for the details that matter before installing the native desktop app.
		</p>

		<div class="mt-8 space-y-3 text-left">
			{#each faq as item, index (item.question)}
				<div
					data-reveal="card"
					class="card-highlight relative overflow-hidden rounded-md bg-frame-gray-100 shadow-sm"
				>
					<button
						id={`faq-trigger-${index}`}
						type="button"
						class="flex w-full cursor-pointer items-center justify-between gap-5 px-4 py-3 text-left text-base font-medium text-foreground transition-colors duration-100 ease-out"
						aria-expanded={openFaq === item.question}
						aria-controls={`faq-${index}`}
						onclick={() => toggleFaq(item.question)}
					>
						<span>{item.question}</span>
						<HugeiconsIcon
							icon={ChevronDownIcon}
							size={16}
							strokeWidth={1.5}
							class={`shrink-0 transition-transform duration-100 ease-out ${openFaq === item.question ? 'rotate-180' : ''}`}
							aria-hidden="true"
						/>
					</button>

					{#if openFaq === item.question}
						<div
							id={`faq-${index}`}
							role="region"
							aria-labelledby={`faq-trigger-${index}`}
							transition:slide={{ duration: 240, easing: cubicOut }}
							class="overflow-hidden"
						>
							<div class="border-t border-frame-gray-100 px-4 py-3">
								<p class="text-base leading-snug text-frame-gray-600">{item.answer}</p>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
