import { browser } from '$app/environment';
import { init, register, locale } from 'svelte-i18n';
import { writable } from 'svelte/store';

const defaultLocale = 'en';

// Auto-load all locale files using Vite's glob import
const localeModules = import.meta.glob('./locales/*.json');

// Extract locale codes and register them
const localeEntries = Object.entries(localeModules);
const supportedLocales: string[] = [];

for (const [path, loader] of localeEntries) {
	const code = path.match(/\.\/locales\/(.+)\.json$/)?.[1];
	if (code) {
		supportedLocales.push(code);
		register(code, loader as () => Promise<Record<string, unknown>>);
	}
}

// Detect browser language
function detectBrowserLocale(): string {
	if (!browser) return defaultLocale;

	// Get browser language list
	const browserLanguages = navigator.languages || [navigator.language];

	for (const lang of browserLanguages) {
		// Extract base language code (e.g., zh-CN -> zh)
		const langCode = lang.split('-')[0].toLowerCase();

		// Check if this language is supported
		if (supportedLocales.includes(langCode)) {
			return langCode;
		}

		// Check full language code (e.g., zh-CN)
		const fullCode = lang.toLowerCase().replace('-', '_');
		if (supportedLocales.includes(fullCode)) {
			return fullCode;
		}
	}

	return defaultLocale;
}

// Get initial locale
function getInitialLocale(): string {
	if (!browser) return defaultLocale;

	// Prefer saved locale from localStorage
	const savedLocale = window.localStorage.getItem('locale');
	if (savedLocale && supportedLocales.includes(savedLocale)) {
		return savedLocale;
	}

	// Otherwise detect browser language
	return detectBrowserLocale();
}

// Available locales list
export interface LanguageInfo {
	code: string;
	name: string;
	flag: string;
}

export const availableLocales = writable<LanguageInfo[]>([]);

// Async load all locale metadata
async function loadLocalesMeta() {
	const languages: LanguageInfo[] = [];

	for (const [path, loader] of localeEntries) {
		const code = path.match(/\.\/locales\/(.+)\.json$/)?.[1];
		if (code) {
			const module = (await loader()) as Record<string, unknown>;
			const data = (module.default || module) as { _meta?: { name: string; flag: string } };
			if (data._meta) {
				languages.push({
					code,
					name: data._meta.name,
					flag: data._meta.flag
				});
			}
		}
	}

	availableLocales.set(languages);
}

// Load metadata on init
loadLocalesMeta();

init({
	fallbackLocale: defaultLocale,
	initialLocale: getInitialLocale()
});

export { locale };
