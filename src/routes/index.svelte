<script lang="ts" context="module">
	export const router = false;
</script>

<script lang="ts">
	import {premadeTransitions, StackNavigator} from '$lib';
	import Home from '../pages/Home.svelte';
</script>

<StackNavigator
	on:error={console.error}
	main={Home}
	transitions={premadeTransitions.slide}
	style="background-color: #dadada; --svelte-stack-nav-page-background: #fff; --svelte-stack-nav-modal-offset-top: 20px; --svelte-stack-nav-overlay-background: rgba(0, 0, 0, 0.2); --svelte-stack-nav-modal-border-radius: 20px"
/>
