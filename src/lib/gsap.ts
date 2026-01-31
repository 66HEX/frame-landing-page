import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

export function registerGsap() {
	if (typeof window !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
		if (!CustomEase.get('custom-ease')) {
			CustomEase.create('custom-ease', '0.625, 0.05, 0, 1');
		}
	}
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
