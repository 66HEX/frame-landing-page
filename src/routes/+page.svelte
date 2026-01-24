<script lang="ts">
	import '../app.css';
	import type { FrameRelease } from '$lib/release';

	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Story from '$lib/components/landing/Story.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import CTA from '$lib/components/landing/CTA.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	const props = $props<{ data: { release: FrameRelease | null } }>();
	const release = $derived(props.data.release);
</script>

<Navbar {release} />

<div class="px-4 md:px-8 overflow-hidden">
	<div
		class="border-gray-alpha-100 divide-gray-alpha-100 flex min-h-screen flex-col items-center divide-y border-x"
	>
		<Hero {release} />
		<Features />
		<Story />
		<CTA {release} />
		<Footer />
	</div>
</div>
