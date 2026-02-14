<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import logo from '$lib/assets/icons/frame.svg';
	import { fallbackReleaseUrl, repositoryUrl, type FrameRelease } from '$lib/release';
	import ExternalLinkIcon from '$lib/components/icons/ExternalLinkIcon.svelte';
	import DownloadIcon from '$lib/components/icons/DownloadIcon.svelte';

	const props = $props<{ release: FrameRelease | null }>();
	const release = $derived(props.release);
	const downloadUrl = $derived(release?.htmlUrl ?? fallbackReleaseUrl);
</script>

<div class="inset-x-0 top-2 md:top-6 px-2 md:px-8 fixed z-40 flex justify-center">
	<nav
		class="max-w-3xl border-gray-alpha-200 bg-background/60 p-2 backdrop-blur-md rounded-xl flex w-full items-center justify-between border"
	>
		<div class="gap-2 ml-2 flex items-center">
			<img src={logo} alt="Frame logo" class="size-4" />
			<span class="text-foreground text-sm font-medium tracking-tight">Frame</span>
		</div>
		<div class="gap-2 flex items-center">
			<Button
				class="h-7 text-xs"
				variant="ghost"
				href={repositoryUrl}
				target="_blank"
				rel="noreferrer"
			>
				Github
				<ExternalLinkIcon class="size-3" />
			</Button>
			<Button class="h-7 text-xs" href={downloadUrl} target="_blank" rel="noreferrer">
				<DownloadIcon class="size-3" />
				Download
			</Button>
		</div>
	</nav>
</div>
