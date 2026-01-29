<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import { availableLocales, type LanguageInfo } from '$lib/i18n';
	import { Globe } from 'lucide-svelte';

	let isOpen = $state(false);
	let languages = $state<LanguageInfo[]>([]);

	$effect(() => {
		const unsubscribe = availableLocales.subscribe((value) => {
			languages = value;
		});
		return unsubscribe;
	});

	function selectLanguage(code: string) {
		if (browser) {
			localStorage.setItem('locale', code);
			window.location.reload();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (browser && isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="language-switcher relative">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="text-gray-alpha-600 hover:text-foreground rounded-lg p-1.5 flex items-center justify-center transition-colors"
		aria-label="Select language"
	>
		<Globe class="size-4" />
	</button>

	{#if isOpen}
		<div
			class="border-gray-alpha-200 bg-background/95 right-0 mt-2 rounded-lg shadow-lg backdrop-blur-md absolute top-full z-50 overflow-hidden border"
			style="min-width: 140px;"
		>
			{#each languages as lang}
				<button
					onclick={() => selectLanguage(lang.code)}
					class="hover:bg-gray-alpha-100 gap-2 px-3 py-2 text-sm flex w-full items-center text-left transition-colors {$locale ===
					lang.code
						? 'bg-gray-alpha-100'
						: ''}"
				>
					<span class="text-base">{lang.flag}</span>
					<span class="text-foreground">{lang.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
