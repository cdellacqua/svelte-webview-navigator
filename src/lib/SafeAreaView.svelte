<script lang="ts">
	/**
	 * Reference to the root element of this component.
	 */
	export let ref: HTMLDivElement | undefined = undefined;
	/**
	 * Additional classes for the root element of this component.
	 */
	export let className: string | undefined = undefined;
	/**
	 * Additional styles for the root element of this component.
	 */
	export let style: string | undefined = undefined;
</script>

<div bind:this={ref} {style} class="safe-area {className ?? ''}">
	<div class="safe-area-slot">
		<slot />
	</div>
</div>

<style>
	.safe-area {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		padding: var(--safe-area-inset-top, 0px) var(--safe-area-inset-right, 0px)
			var(--safe-area-inset-bottom, 0px) var(--safe-area-inset-left, 0px);
	}
	.safe-area-slot {
		overflow: hidden;
		position: absolute;
		top: var(--safe-area-inset-top, 0px);
		right: var(--safe-area-inset-right, 0px);
		bottom: var(--safe-area-inset-bottom, 0px);
		left: var(--safe-area-inset-left, 0px);
	}
</style>
