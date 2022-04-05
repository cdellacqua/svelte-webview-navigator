<script lang="ts">
	export let ref: HTMLDivElement | undefined = undefined;
	export let style: string | undefined = undefined;
	export let className: string | undefined = undefined;

	let touchId: TouchEvent['changedTouches'][number]['identifier'] | null = null;
	let previousY: number | null = null;
	let currentY: number | null = null;
	let propagate = false;
	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1 || e.changedTouches.length === 0) {
			return;
		}
		touchId = e.changedTouches[0].identifier;
		previousY = e.changedTouches[0].pageY;
		propagate = false;
	}
	function handleTouchMove(e: TouchEvent) {
		if (!ref) {
			return;
		}
		if (touchId === null) {
			return;
		}
		if (e.touches.length !== 1 || e.changedTouches.length === 0) {
			return;
		}
		if (e.changedTouches[0].identifier !== touchId) {
			return;
		}
		if (previousY === null) {
			return;
		}
		if (!ref.parentElement || !ref.parentElement.classList.contains('modal')) {
			return;
		}
		currentY = e.changedTouches[0].pageY;
		if (propagate || (previousY < currentY && ref.scrollTop < 1)) {
			e.preventDefault();
			ref.scrollTop = 0;
			propagate = true;
		}
		if (!propagate) {
			e.stopPropagation();
		}

		previousY = currentY;
	}
	function handleTouchEnd(e: TouchEvent) {
		if (!ref) {
			return;
		}
		if (touchId === null) {
			return;
		}
		if (e.touches.length !== 0 || e.changedTouches.length === 0) {
			return;
		}
		touchId = null;
	}
	function handleTouchCancel(e: TouchEvent) {
		if (!ref) {
			return;
		}
		if (touchId === null) {
			return;
		}
		let foundTouch = null;
		for (let i = 0; i < e.changedTouches.length; i++) {
			if (e.changedTouches[i].identifier === touchId) {
				foundTouch = e.changedTouches[i];
				break;
			}
		}
		if (foundTouch) {
			touchId = null;
		}
	}
</script>

<div
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	on:touchcancel={handleTouchCancel}
	bind:this={ref}
	class="scroll-view {className ?? ''}"
	{style}
>
	<slot />
</div>

<style>
	.scroll-view {
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
</style>
