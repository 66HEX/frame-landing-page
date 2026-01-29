export let gsap: GSAP;
export let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
export let SplitText: typeof import('gsap/SplitText').SplitText;
export let CustomEase: typeof import('gsap/CustomEase').CustomEase;

let initPromise: Promise<void> | null = null;

export async function registerGsap() {
	if (typeof window === 'undefined') return;

	if (initPromise) {
		await initPromise;
		return;
	}

	initPromise = (async () => {
		const gsapModule = await import('gsap/dist/gsap');
		const scrollTriggerModule = await import('gsap/dist/ScrollTrigger');
		const splitTextModule = await import('gsap/dist/SplitText');
		const customEaseModule = await import('gsap/dist/CustomEase');

		gsap = gsapModule.gsap;
		ScrollTrigger = scrollTriggerModule.ScrollTrigger;
		SplitText = splitTextModule.SplitText;
		CustomEase = customEaseModule.CustomEase;

		gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
		if (!CustomEase.get('custom-ease')) {
			CustomEase.create('custom-ease', '0.625, 0.05, 0, 1');
		}
	})();

	await initPromise;
}

export async function getGsap() {
	await registerGsap();
	return { gsap, ScrollTrigger, SplitText, CustomEase };
}
