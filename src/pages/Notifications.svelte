<script lang="ts">
	import SafeAreaScrollView from '$lib/SafeAreaScrollView.svelte';

	import Navigation from '../Navigation.svelte';

	export let notifications: {title: string; message: string}[];
	export let optionalProp = 'not set';
</script>

<SafeAreaScrollView>
	<div style="padding: 2rem;">
		<Navigation />

		Notifications component, received props:
		<br />
		<br />
		<div>optionalProp: {optionalProp}</div>
		<div>notifications:</div>
		<ul>
			{#each notifications as { title, message }}
				<li>
					<strong>{title}</strong><br />
					{message}
				</li>
			{/each}
		</ul>
	</div>
</SafeAreaScrollView>
