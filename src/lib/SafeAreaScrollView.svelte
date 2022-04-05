<script lang="ts">
	import ScrollView from './ScrollView.svelte';

	export let style: string | undefined = undefined;
	export let className: string | undefined = undefined;
</script>

<ScrollView {style} {className}>
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
