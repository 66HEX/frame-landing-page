export type InstallerOS = 'mac' | 'windows' | 'linux';
export type InstallerArch = 'arm64' | 'x64';
export type InstallerFormat = 'dmg' | 'exe' | 'deb' | 'appimage';

export interface InstallerAsset {
	name: string;
	url: string;
	size: number;
	os: InstallerOS;
	arch: InstallerArch;
	format: InstallerFormat;
}

export interface FrameRelease {
	name: string;
	tagName: string;
	version: string;
	htmlUrl: string;
	publishedAt: string;
	assets: InstallerAsset[];
}

type GithubReleaseResponse = {
	tag_name: string;
	name?: string | null;
	html_url: string;
	published_at: string;
	assets: Array<{
		name: string;
		browser_download_url: string;
		size: number;
	}>;
};

export type UserPlatform =
	| {
			os: InstallerOS;
			arch: InstallerArch;
	  }
	| {
			os: 'unknown';
			arch: null;
	  };

const GITHUB_RELEASES_ENDPOINT = 'https://api.github.com/repos/66HEX/frame/releases/latest';
export const fallbackReleaseUrl = 'https://github.com/66HEX/frame/releases/latest';
export const repositoryUrl = 'https://github.com/66HEX/frame';
export const sponsorshipUrl = 'https://github.com/sponsors/66HEX';

const extensionToFormat: Record<string, InstallerFormat> = {
	'.dmg': 'dmg',
	'.exe': 'exe',
	'.appimage': 'appimage',
	'.deb': 'deb'
};

function getInstallerFormat(name: string): InstallerFormat | null {
	const lowerName = name.toLowerCase();
	for (const extension of Object.keys(extensionToFormat)) {
		if (lowerName.endsWith(extension)) {
			return extensionToFormat[extension];
		}
	}
	return null;
}

function getInstallerOS(format: InstallerFormat): InstallerOS {
	if (format === 'exe') {
		return 'windows';
	}
	if (format === 'dmg') {
		return 'mac';
	}
	return 'linux';
}

function getInstallerArch(name: string): InstallerArch {
	const lowerName = name.toLowerCase();

	if (lowerName.includes('aarch64') || lowerName.includes('arm64')) {
		return 'arm64';
	}

	return 'x64';
}

export function parseRelease(data: GithubReleaseResponse): FrameRelease {
	const version = data.tag_name?.startsWith('v') ? data.tag_name.slice(1) : data.tag_name;

	const assets = data.assets
		.map((asset) => {
			const format = getInstallerFormat(asset.name);
			if (!format) return null;

			return {
				name: asset.name,
				url: asset.browser_download_url,
				size: asset.size,
				format,
				os: getInstallerOS(format),
				arch: getInstallerArch(asset.name)
			} satisfies InstallerAsset;
		})
		.filter(Boolean) as InstallerAsset[];

	return {
		name: data.name ?? data.tag_name,
		tagName: data.tag_name,
		version,
		htmlUrl: data.html_url,
		publishedAt: data.published_at,
		assets
	};
}

export async function fetchLatestRelease(fetchImpl: typeof fetch): Promise<FrameRelease | null> {
	try {
		const response = await fetchImpl(GITHUB_RELEASES_ENDPOINT, {
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'frame-landing-page'
			}
		});

		if (!response.ok) {
			console.error('Failed to fetch release:', response.statusText);
			return null;
		}

		const data = (await response.json()) as GithubReleaseResponse;
		return parseRelease(data);
	} catch (error) {
		console.error('Failed to fetch release:', error);
		return null;
	}
}

type NavigatorWithUAData = Navigator & {
	userAgentData?: {
		architecture?: string;
		platform?: string;
	};
};

function normalizeString(value: string | undefined): string {
	return value?.toLowerCase() ?? '';
}

export function detectUserPlatform(): UserPlatform {
	if (typeof navigator === 'undefined') {
		return { os: 'unknown', arch: null };
	}

	const enhancedNavigator = navigator as NavigatorWithUAData;
	const ua = normalizeString(enhancedNavigator.userAgent);
	const platform = normalizeString(enhancedNavigator.userAgentData?.platform ?? enhancedNavigator.platform);
	const architectureHint = normalizeString(enhancedNavigator.userAgentData?.architecture);

	let os: UserPlatform['os'] = 'unknown';

	if (platform.includes('mac') || ua.includes('mac')) {
		os = 'mac';
	} else if (platform.includes('win') || ua.includes('win')) {
		os = 'windows';
	} else if (
		platform.includes('linux') ||
		(ua.includes('linux') && !ua.includes('android'))
	) {
		os = 'linux';
	}

	const archSources = [architectureHint, platform, ua];
	let arch: InstallerArch | null = null;

	for (const source of archSources) {
		if (!source) continue;

		if (source.includes('arm') || source.includes('aarch64')) {
			arch = 'arm64';
			break;
		}

		if (
			source.includes('x86_64') ||
			source.includes('x64') ||
			source.includes('amd64') ||
			source.includes('win64') ||
			source.includes('wow64')
		) {
			arch = 'x64';
			break;
		}
	}

	if (!arch) {
		if (os === 'mac') {
			arch = 'arm64';
		} else if (os === 'windows' || os === 'linux') {
			arch = 'x64';
		}
	}

	if (os === 'unknown') {
		return { os: 'unknown', arch: null };
	}

	return { os, arch: arch ?? 'x64' };
}

const linuxFormatPreference: InstallerFormat[] = ['appimage', 'deb'];

export function resolveInstallerForPlatform(release: FrameRelease, platform: UserPlatform) {
	if (platform.os === 'unknown') return null;

	const matchingOS = release.assets.filter((asset) => asset.os === platform.os);
	if (matchingOS.length === 0) return null;

	const archMatches = matchingOS.filter((asset) => asset.arch === platform.arch);
	const prioritizedGroup = archMatches.length > 0 ? archMatches : matchingOS;

	if (platform.os === 'linux') {
		for (const format of linuxFormatPreference) {
			const candidate = prioritizedGroup.find((asset) => asset.format === format);
			if (candidate) return candidate;
		}
	}

	return prioritizedGroup[0] ?? null;
}

export function formatPlatformLabel(platform: UserPlatform): string {
	if (platform.os === 'unknown') {
		return 'your platform';
	}

	const osLabel =
		platform.os === 'mac' ? 'macOS' : platform.os === 'windows' ? 'Windows' : 'Linux';
	const archLabel = platform.arch === 'arm64' ? 'Apple Silicon / ARM64' : 'x64';

	if (platform.os === 'mac') {
		return `${osLabel} (${platform.arch === 'arm64' ? 'Apple Silicon' : 'Intel'})`;
	}

	return `${osLabel} (${archLabel})`;
}
