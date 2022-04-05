<script lang="ts">
	import {onResume} from '$lib';

	import SafeAreaScrollView from '$lib/SafeAreaScrollView.svelte';

	import Navigation from '../Navigation.svelte';

	export let exampleProp = 10;

	let date: Date | undefined;
	onResume((returnValue?: Date) => {
		date = returnValue;
	});
</script>

<SafeAreaScrollView>
	<div style="padding: 2rem;">
		<Navigation />

		Home component, received prop: {exampleProp}
		{#if date}
			<br /><br />
			Resumed with value: {date.toLocaleTimeString()}
		{/if}

		<p>
			This is a scroll view that takes into account the safe area of the display... (scroll to the
			bottom)
		</p>
		<div style="height: 120vh" />
		<p>...as you can see by this text</p>
	</div>
</SafeAreaScrollView>
