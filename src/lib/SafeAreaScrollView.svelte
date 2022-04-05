<script lang="ts">
	import ScrollView from './ScrollView.svelte';

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

<ScrollView {style} {className} bind:ref>
	<div class="safe-area">
		<slot />
	</div>
</ScrollView>

<style>
	.safe-area {
		padding: var(--safe-area-inset-top, 0px) var(--safe-area-inset-right, 0px)
			var(--safe-area-inset-bottom, 0px) var(--safe-area-inset-left, 0px);
	}
</style>
