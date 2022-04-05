<script lang="ts">
	import SafeAreaScrollView from '$lib/SafeAreaScrollView.svelte';

	import Navigation from '../Navigation.svelte';

	export let exampleProp = 10;
</script>

<SafeAreaScrollView>
	<div style="padding: 2rem;">
		<Navigation />

		Home component, received prop: {exampleProp}

		<p>
			This is a scroll view that takes into account the safe area of the display... (scroll to the
			bottom)
		</p>
		<div style="height: 120vh" />
		<p>...as you can see by this text</p>
	</div>
</SafeAreaScrollView>
