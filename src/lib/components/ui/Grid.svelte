<script lang="ts">
	import { onMount } from 'svelte';

	const GRID_BLOCK_SIZE = 55;
	const GRID_HIGHLIGHT_DURATION = 300;

	type GridBlock = {
		x: number;
		y: number;
		gridX: number;
		gridY: number;
		posX: number;
		posY: number;
		highlighted: boolean;
		highlightEndTime: number;
	};

	type GridMouse = {
		x: number | undefined;
		y: number | undefined;
		radius: number;
	};

	let container = $state<HTMLDivElement | null>(null);
	let gridBlocks = $state<GridBlock[]>([]);
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let gridMouse = $state<GridMouse>({
		x: undefined,
		y: undefined,
		radius: GRID_BLOCK_SIZE * 2
	});

	function calculateGrid() {
		if (!container) return;

		const rect = container.getBoundingClientRect();
		containerWidth = rect.width;
		containerHeight = rect.height;

		gridBlocks = [];

		const gridColumnCount = Math.ceil(containerWidth / GRID_BLOCK_SIZE);
		const gridRowCount = Math.ceil(containerHeight / GRID_BLOCK_SIZE);

		const gridOffsetX = (containerWidth - gridColumnCount * GRID_BLOCK_SIZE) / 2;
		const gridOffsetY = (containerHeight - gridRowCount * GRID_BLOCK_SIZE) / 2;

		for (let rowIndex = 0; rowIndex < gridRowCount; rowIndex++) {
			for (let colIndex = 0; colIndex < gridColumnCount; colIndex++) {
				const blockPosX = colIndex * GRID_BLOCK_SIZE + gridOffsetX;
				const blockPosY = rowIndex * GRID_BLOCK_SIZE + gridOffsetY;

				gridBlocks.push({
					x: blockPosX + GRID_BLOCK_SIZE / 2,
					y: blockPosY + GRID_BLOCK_SIZE / 2,
					gridX: colIndex,
					gridY: rowIndex,
					posX: blockPosX,
					posY: blockPosY,
					highlighted: false,
					highlightEndTime: 0
				});
			}
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (!container) return;

		const rect = container.getBoundingClientRect();
		gridMouse.x = e.clientX - rect.left;
		gridMouse.y = e.clientY - rect.top;
		addGridHighlights();
	}

	function handleMouseLeave() {
		gridMouse.x = undefined;
		gridMouse.y = undefined;
	}

	function addGridHighlights() {
		if (gridMouse.x === undefined || gridMouse.y === undefined) return;

		let closestGridBlock: GridBlock | null = null;
		let closestGridDistance = Infinity;

		for (const block of gridBlocks) {
			const distanceX = gridMouse.x - block.x;
			const distanceY = gridMouse.y - block.y;
			const blockDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

			if (blockDistance < closestGridDistance) {
				closestGridDistance = blockDistance;
				closestGridBlock = block;
			}
		}

		if (!closestGridBlock || closestGridDistance > gridMouse.radius) return;

		const currentGridTime = Date.now();

		closestGridBlock.highlighted = true;
		closestGridBlock.highlightEndTime = currentGridTime + GRID_HIGHLIGHT_DURATION;

		const gridClusterSize = Math.floor(Math.random() * 1) + 1;
		let currentGridBlock: GridBlock = closestGridBlock;
		const highlightedGridBlocks: GridBlock[] = [closestGridBlock];

		for (let i = 0; i < gridClusterSize; i++) {
			const gridNeighbors = gridBlocks.filter((neighborBlock) => {
				if (highlightedGridBlocks.includes(neighborBlock)) return false;

				const neighborDistanceX = Math.abs(neighborBlock.gridX - currentGridBlock.gridX);
				const neighborDistanceY = Math.abs(neighborBlock.gridY - currentGridBlock.gridY);

				return neighborDistanceX <= 1 && neighborDistanceY <= 1;
			});

			if (gridNeighbors.length === 0) break;

			const randomGridNeighbor = gridNeighbors[Math.floor(Math.random() * gridNeighbors.length)]!;

			randomGridNeighbor.highlighted = true;
			randomGridNeighbor.highlightEndTime = currentGridTime + GRID_HIGHLIGHT_DURATION + i * 10;

			highlightedGridBlocks.push(randomGridNeighbor);
			currentGridBlock = randomGridNeighbor;
		}
	}

	function updateGridHighlights() {
		const currentGridTime = Date.now();

		gridBlocks.forEach((gridBlock) => {
			if (gridBlock.highlightEndTime > 0 && currentGridTime > gridBlock.highlightEndTime) {
				gridBlock.highlighted = false;
				gridBlock.highlightEndTime = 0;
			}
		});

		requestAnimationFrame(updateGridHighlights);
	}

	onMount(() => {
		calculateGrid();

		const resizeObserver = new ResizeObserver(() => {
			calculateGrid();
		});

		if (container) {
			resizeObserver.observe(container);
		}

		requestAnimationFrame(updateGridHighlights);

		return () => {
			resizeObserver.disconnect();
		};
	});
</script>

<div
	bind:this={container}
	class="interactive-grid"
	role="presentation"
	aria-hidden="true"
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
>
	{#each gridBlocks as block (block.gridX + '-' + block.gridY)}
		<div
			class="block"
			class:highlight={block.highlighted}
			style="
				width: {GRID_BLOCK_SIZE}px;
				height: {GRID_BLOCK_SIZE}px;
				left: {block.posX}px;
				top: {block.posY}px;
			"
		></div>
	{/each}
</div>

<style>
	.interactive-grid {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.block {
		position: absolute;
		border: 0.5px solid var(--ds-gray-alpha-50);
		background: transparent;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
		pointer-events: none;
	}

	.block.highlight {
		background: color-mix(in srgb, var(--ds-blue-700) 20%, transparent);
		border-color: var(--ds-blue-700);
	}
</style>
