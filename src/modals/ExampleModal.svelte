<script lang="ts">
	import {useNavigation} from '$lib';
	import SafeAreaView from '$lib/SafeAreaView.svelte';
	import Navigation from '../Navigation.svelte';

	const {goBack} = useNavigation();
</script>

<SafeAreaView>
	<div style="padding: 2rem;">
		<Navigation />
		<button on:click={() => goBack()}>Close</button>
		<br />
		<br />
		This is an example modal

		<p>This is a not a ScrollView, therefore you cannot see the at the bottom of the page.</p>
		<div style="height: 120vh" />
		<p>(you can't see me!)</p>
	</div></SafeAreaView
>
