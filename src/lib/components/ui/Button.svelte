<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cva, type VariantProps } from 'class-variance-authority';
	import { cn } from '$lib/utils';

	const linkVariants = cva(
		'rounded-lg   font-medium [&_svg:not([class*="size-"])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-colors [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 ',
		{
			variants: {
				variant: {
					primary: 'bg-blue-700 hover:bg-blue-700/90 text-foreground button-highlight',
					secondary: 'bg-[#222122] text-foreground border-gray-alpha-200 hover:bg-[#2E2D2E] border',
					ghost: 'text-gray-alpha-600 hover:text-foreground'
				},
				size: {
					default:
						'h-8 gap-1.5 px-2.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
					xs: 'h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*="size-"])]:size-3',
					sm: 'h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*="size-"])]:size-3.5',
					lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
					icon: 'size-8',
					'icon-xs':
						'size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*="size-"])]:size-3',
					'icon-sm':
						'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
					'icon-lg': 'size-9'
				}
			},
			defaultVariants: {
				variant: 'primary',
				size: 'default'
			}
		}
	);

	interface Props extends HTMLAnchorAttributes, VariantProps<typeof linkVariants> {
		class?: string;
		children?: Snippet;
	}

	let { class: className, variant, size, href, children, ...props }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class={cn(linkVariants({ variant, size }), className)} {...props}>
	{@render children?.()}
</a>
