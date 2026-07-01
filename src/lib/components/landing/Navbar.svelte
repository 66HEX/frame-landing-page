<script lang="ts">
	import { Download01Icon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { resolve } from '$app/paths';
	import { repositoryUrl } from '$lib/release';
	import Button from '$lib/components/ui/Button.svelte';

	const props = $props<{ releasesPageUrl: string }>();
</script>

<header class="fixed left-0 right-0 top-0 z-100 border-b border-frame-gray-100 bg-background">
	<nav
		class="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-6 border-x border-frame-gray-100"
		aria-label="Main navigation"
	>
		<a href={resolve('/')} class="inline-flex items-center text-sm font-medium">
			<img src="/favicon.svg" alt="" class="size-6" />
		</a>

		<ul class="hidden flex-row items-center gap-2 text-sm max-sm:hidden md:flex">
			<li>
				<a
					class="inline-flex items-center gap-1 rounded-sm px-2.5 h-8 font-medium text-frame-gray-600 transition-[color,background-color] duration-100 ease-out hover:bg-frame-gray-100 hover:text-foreground"
					href={resolve('/#features')}>Features</a
				>
			</li>
			<li>
				<a
					class="inline-flex h-8 items-center gap-1 rounded-sm px-2.5 font-medium text-frame-gray-600 transition-[color,background-color] duration-100 ease-out hover:bg-frame-gray-100 hover:text-foreground"
					href={resolve('/#story')}>Story</a
				>
			</li>
			<li>
				<a
					class="inline-flex items-center gap-1 rounded-sm px-2.5 h-8 font-medium text-frame-gray-600 transition-[color,background-color] duration-100 ease-out hover:bg-frame-gray-100 hover:text-foreground"
					href={resolve('/#faq')}>FAQ</a
				>
			</li>
			<li>
				<Button variant="ghost" size="sm" href={repositoryUrl} target="_blank" rel="noreferrer">
					Github
				</Button>
			</li>
		</ul>

		<div class="ml-auto">
			<Button href={props.releasesPageUrl} target="_blank" rel="noreferrer" size="sm">
				<HugeiconsIcon icon={Download01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
				Download
			</Button>
		</div>
	</nav>
</header>
