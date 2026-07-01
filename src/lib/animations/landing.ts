import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const SECTION_SELECTOR = '[data-reveal-section]';
const BADGE_SELECTOR = '[data-reveal="badge"]';
const CARD_SELECTOR = '[data-reveal="card"]';
const FEATURE_CELL_SELECTOR = '[data-reveal="feature-cell"]';
const STORY_GROUP_SELECTOR = '[data-reveal="story-group"]';
const STORY_LEFT_SELECTOR = '[data-reveal="story-left"]';
const STORY_RIGHT_ITEM_SELECTOR = '[data-reveal="story-right-item"]';
const ACTIONS_SELECTOR = '[data-reveal="actions"]';
const ACTION_ITEM_SELECTOR = ':scope > *';
const TEXT_SELECTOR = 'h1, h2, h3, p, a, [data-reveal="text"]';

export const LANDING_ANIMATION_CONFIG = Object.freeze({
	easeName: 'landing-reveal-ease',
	easeCurve: '0.625, 0.05, 0, 1',
	y: 15,
	duration: 0.8,
	textWordStagger: 0.025,
	textBlur: 10,
	textElementStagger: 0.08,
	cardStagger: 0.12,
	scrollStart: 'top 78%',
	toggleActions: 'play none none reverse' as const
});

let pluginsRegistered = false;

function registerPlugins() {
	if (pluginsRegistered) return;
	gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
	if (!gsap.parseEase(LANDING_ANIMATION_CONFIG.easeName)) {
		CustomEase.create(LANDING_ANIMATION_CONFIG.easeName, LANDING_ANIMATION_CONFIG.easeCurve);
	}
	pluginsRegistered = true;
}

function uniqueElements(elements: HTMLElement[]) {
	return Array.from(new Set(elements));
}

function queryElements(section: HTMLElement, selector: string) {
	return Array.from(section.querySelectorAll<HTMLElement>(selector));
}

function isRenderableElement(element: HTMLElement) {
	const styles = window.getComputedStyle(element);
	if (styles.display === 'none' || styles.visibility === 'hidden') return false;
	return element.getClientRects().length > 0;
}

function isInsideCard(element: HTMLElement) {
	return Boolean(element.closest(CARD_SELECTOR));
}

function collectTargets(section: HTMLElement) {
	const badges = uniqueElements(queryElements(section, BADGE_SELECTOR));
	const featureCells = uniqueElements(
		queryElements(section, FEATURE_CELL_SELECTOR).filter(isRenderableElement)
	);
	const storyGroups = uniqueElements(
		queryElements(section, STORY_GROUP_SELECTOR).filter(isRenderableElement)
	);
	const cards = uniqueElements(
		queryElements(section, CARD_SELECTOR).filter(
			(element) => isRenderableElement(element) && !element.closest(FEATURE_CELL_SELECTOR)
		)
	);
	const actionGroups = uniqueElements(
		queryElements(section, ACTIONS_SELECTOR).filter((element) => !isInsideCard(element))
	);
	const actionItems = uniqueElements(
		actionGroups.flatMap((group) => queryElements(group, ACTION_ITEM_SELECTOR))
	);
	const texts = uniqueElements(
		queryElements(section, TEXT_SELECTOR).filter(
			(element) =>
				!isInsideCard(element) &&
				!element.closest(FEATURE_CELL_SELECTOR) &&
				!element.closest(STORY_GROUP_SELECTOR) &&
				!element.matches(BADGE_SELECTOR) &&
				!element.closest(BADGE_SELECTOR) &&
				!element.matches(ACTIONS_SELECTOR) &&
				!element.closest(ACTIONS_SELECTOR)
		)
	);

	const fallback = queryElements(section, ':scope > div').slice(0, 1);

	return {
		badges,
		featureCells,
		storyGroups,
		texts,
		actions: actionItems.length > 0 ? actionItems : actionGroups,
		cards,
		fallback
	};
}

function splitWords(element: HTMLElement, splitTextInstances: SplitText[]) {
	const splitText = SplitText.create(element, {
		type: 'words',
		wordsClass: 'split-word'
	});
	splitTextInstances.push(splitText);
	return splitText.words as HTMLElement[];
}

function collectTextElements(element: HTMLElement) {
	const textSelector = 'h1, h2, h3, p, [data-reveal="text"]';
	const descendants = queryElements(element, textSelector);
	return uniqueElements(element.matches(textSelector) ? [element, ...descendants] : descendants);
}

function createWordsTimeline(words: HTMLElement[], config = LANDING_ANIMATION_CONFIG) {
	const timeline = gsap.timeline({
		defaults: {
			ease: config.easeName,
			duration: config.duration
		}
	});

	if (words.length === 0) return timeline;

	gsap.set(words, { willChange: 'transform, filter, opacity' });
	timeline.fromTo(
		words,
		{
			autoAlpha: 0,
			y: config.y,
			filter: `blur(${config.textBlur}px)`
		},
		{
			autoAlpha: 1,
			y: 0,
			filter: 'blur(0px)',
			stagger: config.textWordStagger,
			clearProps: 'willChange'
		}
	);

	return timeline;
}

function createTextBlockTimeline(element: HTMLElement, splitTextInstances: SplitText[]) {
	const textElements = collectTextElements(element);
	const words = textElements.flatMap((textElement) => splitWords(textElement, splitTextInstances));
	return createWordsTimeline(words);
}

function addStoryGroupTimeline(
	timeline: gsap.core.Timeline,
	group: HTMLElement,
	splitTextInstances: SplitText[],
	position: string | number
) {
	const left = group.querySelector<HTMLElement>(STORY_LEFT_SELECTOR);
	const rightItems = queryElements(group, STORY_RIGHT_ITEM_SELECTOR);
	const blocks = left ? [left, ...rightItems] : rightItems;

	if (blocks.length === 0) return;

	if (!window.matchMedia('(min-width: 768px)').matches) {
		const mobileTimeline = gsap.timeline();

		for (const [index, block] of blocks.entries()) {
			const blockTimeline = createTextBlockTimeline(block, splitTextInstances);
			mobileTimeline.add(
				blockTimeline,
				index === 0
					? 0
					: `-=${Math.max(0, blockTimeline.duration() - LANDING_ANIMATION_CONFIG.cardStagger)}`
			);
		}

		timeline.add(mobileTimeline, position);
		return;
	}

	const desktopTimeline = gsap.timeline();

	if (left) {
		desktopTimeline.add(createTextBlockTimeline(left, splitTextInstances), 0);
	}

	const rightTimeline = gsap.timeline();

	for (const [index, item] of rightItems.entries()) {
		const itemTimeline = createTextBlockTimeline(item, splitTextInstances);
		rightTimeline.add(
			itemTimeline,
			index === 0
				? 0
				: `-=${Math.max(0, itemTimeline.duration() - LANDING_ANIMATION_CONFIG.cardStagger)}`
		);
	}

	desktopTimeline.add(rightTimeline, 0);
	timeline.add(desktopTimeline, position);
}

type SequencedTimeline = {
	duration(): number;
};

function overlapIfSequenced(timeline: SequencedTimeline, position: string) {
	return timeline.duration() > 0 ? position : 0;
}

export function createLandingScrollAnimations(root: HTMLElement) {
	if (typeof window === 'undefined') return () => {};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

	registerPlugins();

	const config = LANDING_ANIMATION_CONFIG;
	const splitTextInstances: SplitText[] = [];

	const context = gsap.context(() => {
		const sections = gsap.utils.toArray<HTMLElement>(SECTION_SELECTOR, root);

		for (const section of sections) {
			const { badges, featureCells, storyGroups, texts, actions, cards, fallback } =
				collectTargets(section);
			const hasTargets =
				badges.length > 0 ||
				featureCells.length > 0 ||
				storyGroups.length > 0 ||
				texts.length > 0 ||
				actions.length > 0 ||
				cards.length > 0;

			const timeline = gsap.timeline({
				defaults: {
					ease: config.easeName,
					duration: config.duration
				},
				scrollTrigger: {
					trigger: section,
					start: config.scrollStart,
					toggleActions: config.toggleActions
				}
			});

			if (badges.length > 0) {
				timeline.fromTo(badges, { autoAlpha: 0, y: config.y }, { autoAlpha: 1, y: 0 });
			}

			if (featureCells.length > 0) {
				const featurePosition = overlapIfSequenced(timeline, '-=0.35');

				for (const [index, cell] of featureCells.entries()) {
					const icon = cell.querySelector<HTMLElement>('[data-reveal="feature-icon"]');
					const textElements = queryElements(cell, 'h1, h2, h3, p, [data-reveal="text"]');
					const words = textElements.flatMap((element) => splitWords(element, splitTextInstances));
					const cellTimeline = gsap.timeline({
						defaults: {
							ease: config.easeName,
							duration: config.duration
						}
					});

					if (icon) {
						cellTimeline.fromTo(icon, { autoAlpha: 0, y: config.y }, { autoAlpha: 1, y: 0 }, 0);
					}

					if (words.length > 0) {
						gsap.set(words, { willChange: 'transform, filter, opacity' });
						cellTimeline.fromTo(
							words,
							{
								autoAlpha: 0,
								y: config.y,
								filter: `blur(${config.textBlur}px)`
							},
							{
								autoAlpha: 1,
								y: 0,
								filter: 'blur(0px)',
								stagger: config.textWordStagger,
								clearProps: 'willChange'
							},
							0
						);
					}

					timeline.add(
						cellTimeline,
						index === 0 ? featurePosition : `-=${cellTimeline.duration() - config.cardStagger}`
					);
				}
			}

			if (storyGroups.length > 0) {
				for (const [index, group] of storyGroups.entries()) {
					addStoryGroupTimeline(
						timeline,
						group,
						splitTextInstances,
						index === 0 ? overlapIfSequenced(timeline, '-=0.35') : '+=0'
					);
				}
			}

			if (texts.length > 0) {
				const words = texts.flatMap((element) => {
					return splitWords(element, splitTextInstances);
				});

				if (words.length > 0) {
					gsap.set(words, { willChange: 'transform, filter, opacity' });
					timeline.fromTo(
						words,
						{
							autoAlpha: 0,
							y: config.y,
							filter: `blur(${config.textBlur}px)`
						},
						{
							autoAlpha: 1,
							y: 0,
							filter: 'blur(0px)',
							stagger: config.textWordStagger,
							clearProps: 'willChange'
						},
						badges.length > 0 ? '-=0.45' : 0
					);
				}
			}

			if (actions.length > 0) {
				timeline.fromTo(
					actions,
					{
						autoAlpha: 0,
						y: config.y
					},
					{
						autoAlpha: 1,
						y: 0,
						stagger: config.textElementStagger
					},
					overlapIfSequenced(timeline, '-=0.45')
				);
			}

			if (cards.length > 0) {
				timeline.fromTo(
					cards,
					{
						autoAlpha: 0,
						y: config.y
					},
					{
						autoAlpha: 1,
						y: 0,
						stagger: config.cardStagger
					},
					overlapIfSequenced(timeline, '-=0.35')
				);
			}

			if (!hasTargets && fallback.length > 0) {
				timeline.fromTo(fallback, { autoAlpha: 0, y: config.y }, { autoAlpha: 1, y: 0 });
			}
		}
		ScrollTrigger.refresh();
	}, root);

	return () => {
		for (const splitText of splitTextInstances.reverse()) {
			splitText.revert();
		}
		context.revert();
	};
}
