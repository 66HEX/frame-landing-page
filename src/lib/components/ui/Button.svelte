<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	const buttonVariants = cva(
		'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm font-medium transition-[background-color,color,transform] duration-100 ease-out [&_svg]:size-4 [&_svg]:shrink-0',
		{
			variants: {
				variant: {
					primary:
						'bg-frame-gray-400 text-foreground card-highlight hover:bg-[rgb(235_235_255_/_0.18)]',
					secondary: 'bg-frame-gray-100 text-foreground card-highlight hover:bg-frame-gray-200',
					ghost: 'text-frame-gray-600 hover:bg-frame-gray-100 hover:text-foreground'
				},
				size: {
					sm: 'h-8 gap-1.5 px-2.5 text-sm'
				}
			},
			defaultVariants: {
				variant: 'primary',
				size: 'sm'
			}
		}
	);

	interface Props extends HTMLAnchorAttributes, VariantProps<typeof buttonVariants> {
		children?: Snippet;
		class?: string;
	}

	let { children, class: className, variant, size, ...props }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a class={cn(buttonVariants({ variant, size }), className)} {...props}>
	{@render children?.()}
</a>
