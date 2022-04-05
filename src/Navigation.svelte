<script lang="ts">
	import {useNavigation} from '$lib';
	import ExampleModal from './modals/ExampleModal.svelte';
	import ExampleModalWithScroll from './modals/ExampleModalWithScroll.svelte';
	import Notifications from './pages/Notifications.svelte';
	import Settings from './pages/Settings.svelte';

	const {navigate, goBack, canGoBack, navigating, swiping, openModal} = useNavigation();
</script>

<div>
	<button on:click={() => openModal(ExampleModal)}>Open Modal</button>
	<button on:click={() => openModal(ExampleModalWithScroll)}>Open Modal with scroll</button>
	<button on:click={() => navigate(Settings)}>Go to Settings</button>
	<button
		on:click={() =>
			navigate(Notifications, {
				notifications: [
					{
						title: 'test',
						message: 'example'
					}
				]
			})}>Go to Notifications</button
	>
	<button disabled={!$canGoBack} on:click={() => goBack()}>Go back</button>
	<button disabled={!$canGoBack} on:click={() => goBack(new Date())}
		>Go back returning a value</button
	>
</div>

<div style="padding: 2rem 0">
	Current status:<br />
	<span style="font-weight: bold;"
		>{$swiping ? 'swiping' : 'not swiping'} and
		{$navigating ? 'navigating' : 'not navigating'}</span
	>
</div>

<style>
	button {
		margin-right: 0.6rem;
		margin-bottom: 1rem;
	}
</style>
