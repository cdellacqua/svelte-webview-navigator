<script lang="ts">
	import {useNavigation} from '$lib';
	import SafeAreaScrollView from '$lib/SafeAreaScrollView.svelte';
	import Navigation from '../Navigation.svelte';

	const {goBack} = useNavigation();
</script>

<SafeAreaScrollView>
	<div style="padding: 2rem;">
		<Navigation />
		<button on:click={() => goBack()}>Close</button>
		<br />
		<br />
		This is an example modal

		<p>
			This is a a ScrollView, therefore you can see the at the bottom of the page (just scroll
			down).
		</p>
		<div style="height: 120vh" />
		<p>(you can see me!)</p>
	</div>
</SafeAreaScrollView>
