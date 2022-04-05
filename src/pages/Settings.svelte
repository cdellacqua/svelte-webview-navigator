<script lang="ts">
	import SafeAreaView from '$lib/SafeAreaView.svelte';

	import Navigation from '../Navigation.svelte';
</script>

<SafeAreaView>
	<div style="padding: 2rem;">
		<Navigation />

		Settings component

		<div>
			The following input element will preserve its value if you navigate to another page and come
			back later.
		</div>
		<input type="text" />
	</div>
</SafeAreaView>
