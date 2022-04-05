<script lang="ts">
	/* eslint "import/extensions": off */

	import {navigatorContextKey} from './_stack-navigator';
	import type {StackItem, StackNavigatorContext, TransitionFunctions} from './_types';

	import {createEventDispatcher, onMount, setContext, tick} from 'svelte';
	import {linear, expoInOut} from 'svelte/easing';
	import {tweened} from 'svelte/motion';
	import {derived, get, writable} from 'svelte/store';
	import type {SvelteComponentConstructor} from './_types';
	import {isPortrait, modalTransitions, premadeTransitions} from './_premade-transitions';
	import {sleep} from './_utils';
	import {makeCommandQueue} from './_queue';

	/**
	 * Component that represents the bottom of the stack. It will
	 * be the first component that gets mounted once the navigator
	 * is ready.
	 */
	export let main: SvelteComponentConstructor;
	/**
	 * An object containing a transition for the page in front of the user and the page behind it.
	 */
	export let transitions: TransitionFunctions = premadeTransitions.slide;
	/**
	 * An easing function u = f(t) where both t and u are numbers from 0 to 1.
	 */
	export let transitionEasing: (t: number) => number = expoInOut;
	/**
	 * The duration of the transition in milliseconds.
	 */
	export let transitionDuration = 600;
	/**
	 * Reference to the root element of this component.
	 */
	export let ref: HTMLDivElement | undefined = undefined;
	/**
	 * Additional classes for the root element of this component.
	 */
	export let className: string | undefined = undefined;
	/**
	 * Additional styles for the root element of this component.
	 */
	export let style: string | undefined = undefined;
	/**
	 * Whether the swipe gestures are enabled or disabled.
	 */
	export let enableSwipeGestures = true;
	/**
	 * Portion of the left-most part of the screen that should be listening for swipe gestures.
	 */
	export let swipeGestureSensitiveAreaWidth = 0.05;
	/**
	 * Portion of the upper-most part of the screen that should be listening for swipe gestures.
	 */
	export let swipeGestureSensitiveAreaHeight = 1;
	/**
	 * Number of pixels per millisecond that should trigger a call to the goBack function.
	 */
	export let swipeGestureSpeedThresholdPixelsPerMillisecond = 0.1;
	/**
	 * When the user drags the current page crossing this threshold, goBack is called regardless of the speed of the gesture.
	 */
	export let swipeGestureThreshold = 0.4;
	/**
	 * Number of samples used to determine the speed of the swipe gesture.
	 */
	export let swipeGestureMaxSpeedSamples = 100;
	/**
	 * Minimum distance that the finger has to travel to activate the swipe gesture.
	 */
	export let swipeGestureMinDistance = 50;

	const navigationQueue = makeCommandQueue();

	// Set to vertical when showing the modal
	let swipeGestureDirection: 'vertical' | 'horizontal' = 'horizontal';

	// Stack of components
	const stack = writable<StackItem[]>([]);

	/** Store that indicates if the router is currently navigating. */
	let navigating = writable(false);

	/** Store that indicates if the user is currently swiping. */
	let swiping = writable(false);

	/** Store that indicates the state of the sliding transition. */
	const slideRatio = tweened(1, {
		duration: transitionDuration,
		easing: transitionEasing
	});

	// Store that summarizes the status of the router
	let navigationStores = derived([slideRatio, swiping, navigating], (x) => x);

	const dispatch = createEventDispatcher();

	let unsubscribeFromTransitions: () => unknown = () => undefined;

	// Once the stack stabilizes (i.e. after a navigate or goBack call),
	// attach the slideRatio and swiping store to the top
	// two elements of the stack.
	function attachAnimationStoresToMountPoints() {
		if ($stack.length === 0) {
			return;
		}
		const front = $stack[$stack.length - 1];
		const transitions = $stack[$stack.length - 1].transitions;
		// There may not be a second top element.
		const back = $stack[$stack.length - 2];
		unsubscribeFromTransitions = navigationStores.subscribe(([t, swiping, navigating]) => {
			// Transform using a custom function.
			front.mountPoint.style.cssText = transitions.front(t);
			// While swiping or animating the user shouldn't be able to
			// interact with elements inside the mount point.
			front.mountPoint.style.pointerEvents = t !== 1 || swiping || navigating ? 'none' : '';
			if (back) {
				// Transform using a custom function.
				back.mountPoint.style.cssText = transitions.back(t);
				back.overlay.style.opacity = String(t);
				// While swiping or animating the user shouldn't be able to
				// interact with elements inside the mount point.
				back.mountPoint.style.pointerEvents = t !== 0 || swiping || navigating ? 'none' : '';
			}
		});
	}
	function detachAnimationStoresFromMountPoints(): void {
		unsubscribeFromTransitions();
		unsubscribeFromTransitions = () => undefined as void;
	}

	/** Navigate to a target component optionally passing some props. */
	async function navigate<TProps extends Record<string, unknown>>(
		target: SvelteComponentConstructor<TProps>,
		props: TProps | Record<string, unknown> = {},
		animate = true,
		isModal = false
	): Promise<void> {
		await navigationQueue.run(async () => {
			if (!ref) {
				const err = new Error('not mounted');
				dispatch('error', err);
				throw err;
			}
			$navigating = true;

			// Pause the currently active stack item.
			const oldFront = $stack[$stack.length - 1];
			if (oldFront) {
				for (const cb of oldFront.onPauseCallbacks) {
					await cb();
				}
			}

			detachAnimationStoresFromMountPoints();

			// Prepare the mount point.
			const mountPoint = document.createElement('div');
			if (isModal) {
				mountPoint.className = 'modal';
			}
			mountPoint.classList.add('stack-router-mount-point');
			mountPoint.tabIndex = -1;
			// Prepare the wrapper
			const mountPointWrapper = document.createElement('div');
			mountPointWrapper.classList.add('stack-router-mount-point-wrapper');

			const dismissOverlay = document.createElement('div');
			dismissOverlay.classList.add('stack-router-mount-point-dismiss-overlay');
			dismissOverlay.addEventListener('click', () => {
				if (!$navigating) {
					goBack().catch(() => undefined);
				}
			});
			mountPointWrapper.appendChild(dismissOverlay);

			const focusInterceptorPre = document.createElement('div');
			focusInterceptorPre.classList.add('stack-router-focus-interceptor');
			const focusInterceptorPost = document.createElement('div');
			focusInterceptorPost.classList.add('stack-router-focus-interceptor');
			[focusInterceptorPre, focusInterceptorPost].forEach((focusInterceptor) => {
				focusInterceptor.tabIndex = 0;
				focusInterceptor.addEventListener('focus', () => mountPoint.focus({preventScroll: true}));
			});
			mountPointWrapper.appendChild(focusInterceptorPre);
			mountPointWrapper.appendChild(mountPoint);
			mountPointWrapper.appendChild(focusInterceptorPost);

			const overlay = document.createElement('div');
			overlay.classList.add('stack-router-mount-point-overlay');
			mountPointWrapper.appendChild(overlay);

			ref.appendChild(mountPointWrapper);

			// Prepare the arrays in case
			// the component will register some lifecycle callbacks.
			context.mountingItemLifecycleCallbacks = {
				onPauseCallbacks: [],
				onResumeCallbacks: []
			};

			mountPoint.focus({preventScroll: true});

			// Mount the component passing the context needed to
			// call the lifecycle hooks.
			const componentInstance = new (target as SvelteComponentConstructor)({
				target: mountPoint,
				props,
				context: new Map<string, StackNavigatorContext>([[navigatorContextKey, context]])
			});

			// Wait a tick so that Svelte has time to do its things.
			await tick();

			// Append the new StackItem with all the information collected
			// during this initialization process.
			stack.update((s) => [
				...s,
				{
					componentInstance,
					ref: mountPointWrapper,
					mountPoint,
					overlay,
					transitions: isModal ? modalTransitions : transitions,
					...(context.mountingItemLifecycleCallbacks || {
						onPauseCallbacks: [],
						onResumeCallbacks: []
					})
				}
			]);

			// Remove the lifecycle arrays reference.
			context.mountingItemLifecycleCallbacks = null;

			if (animate) {
				await Promise.race([slideRatio.set(0, {duration: 0}), sleep(0)]);
				attachAnimationStoresToMountPoints();
				await Promise.race([slideRatio.set(1), sleep(transitionDuration)]);
				await Promise.race([slideRatio.set(1, {duration: 0}), sleep(0)]);
			} else {
				await Promise.race([slideRatio.set(1, {duration: 0}), sleep(0)]);
				attachAnimationStoresToMountPoints();
			}

			$navigating = false;
		});
	}

	/** Return to the previous stack item by removing the currently active one, optionally passing a return value */
	async function goBack(returnValue?: unknown, animate = true, duration?: number): Promise<void> {
		await navigationQueue.run(async () => {
			if (!canGoBack()) {
				const err = new Error(`cannot go back, stack size is ${$stack.length}`);
				dispatch('error', err);
				throw err;
			}
			$navigating = true;

			const back = $stack[$stack.length - 2] as StackItem;
			back.mountPoint.focus({preventScroll: true});

			if (animate) {
				// The slide ratio may have been offset by a swipe gesture.
				const slideRatioStart = get(slideRatio);
				const slideDuration =
					(duration ?? transitionDuration) * (1 - slideRatioStart * swipeGestureThreshold);
				await Promise.race([
					slideRatio.set(
						0,
						slideRatioStart === 1
							? undefined
							: {
									// If the user navigated back using a gesture
									// a fast linear transition feels more natural.
									easing: linear,
									duration: slideDuration
							  }
					),
					sleep(slideDuration)
				]);
				await Promise.race([slideRatio.set(0, {duration: 0}), sleep(0)]);
			}

			// Resume the stack item that will soon be the new top.
			const resumedBack = $stack[$stack.length - 2];
			resumedBack.mountPoint.style.visibility = '';
			for (const cb of resumedBack.onResumeCallbacks) {
				await cb(returnValue);
			}

			// Retrieve the current active stack item.
			const front = $stack[$stack.length - 1] as StackItem;
			// Remove it from the stack
			stack.update((s) => s.slice(0, -1));
			// Desrefssociated Svelte component.ref
			front.componentInstance.$destroy();
			await tick();
			// Remove the mount point from the DOM
			front.ref.parentNode?.removeChild(front.ref);
			if (animate) {
				// Restore the slide ratio as it would be after a "navigate" call.
				detachAnimationStoresFromMountPoints();
				await Promise.race([slideRatio.set(1, {duration: 0}), sleep(0)]);
				attachAnimationStoresToMountPoints();
			}

			$navigating = false;
		});
	}

	async function openModal<TProps extends Record<string, unknown>>(
		component: SvelteComponentConstructor<TProps>,
		props: TProps | Record<string, unknown> = {}
	): Promise<void> {
		// No queue here, because it's already managed in navigate.
		await navigate(component as SvelteComponentConstructor, props, true, true);
	}

	export const context: StackNavigatorContext = {
		navigate,
		openModal,
		goBack,
		canGoBack: derived(stack, (s) => s.length > 1),
		mountingItemLifecycleCallbacks: null,
		stack,
		navigating,
		swiping,
		unsubscribeFromTransitions: () => undefined,
		navigationStores,
		dispatchError: (err: Error) => dispatch('error', err)
	};

	function canGoBack(): boolean {
		return get(context.canGoBack);
	}

	setContext(navigatorContextKey, context);

	onMount(() => {
		if (!ref) {
			const err = new Error('not mounted');
			dispatch('error', err);
			throw err;
		}
		navigate(main, {}, false);

		const unsubStack = stack.subscribe((s) => {
			if (s.length === 0) {
				return;
			}
			if (!s[s.length - 1].mountPoint.classList.contains('modal')) {
				swipeGestureDirection = 'horizontal';
			} else {
				swipeGestureDirection = 'vertical';
			}
		});
		const orientationListener = () => {
			detachAnimationStoresFromMountPoints();
			attachAnimationStoresToMountPoints();
		};
		isPortrait.addEventListener('change', orientationListener);
		const unsubOrientation = () => isPortrait.removeEventListener('change', orientationListener);
		return () => {
			unsubStack();
			unsubOrientation();
			unsubscribeFromTransitions();
		};
	});

	//#region GESTURE HANDLING
	let touchId: TouchEvent['changedTouches'][number]['identifier'] | null = null;
	let swipeStartX = 0;
	let swipeStartY = 0;
	let swipeCurrentX = 0;
	let swipeCurrentY = 0;
	let speedSamples = new Array(swipeGestureMaxSpeedSamples);
	let speedSamplesCount = 0;
	let lastSpeedSampleTime = 0;

	function handleTouchStart(e: TouchEvent) {
		if (!ref) {
			return;
		}
		if (e.touches.length !== 1 || e.changedTouches.length === 0) {
			return;
		}
		if (
			enableSwipeGestures &&
			((swipeGestureDirection === 'horizontal' &&
				e.changedTouches[0].clientX < swipeGestureSensitiveAreaWidth * ref.offsetWidth) ||
				(swipeGestureDirection === 'vertical' &&
					e.changedTouches[0].clientY < swipeGestureSensitiveAreaHeight * ref.offsetHeight)) &&
			canGoBack()
		) {
			touchId = e.changedTouches[0].identifier;
			swipeStartX = e.changedTouches[0].clientX;
			swipeStartY = e.changedTouches[0].clientY;
			swipeCurrentX = swipeStartX;
			swipeCurrentY = swipeStartY;
			speedSamples = new Array(swipeGestureMaxSpeedSamples);
			speedSamplesCount = 0;
			lastSpeedSampleTime = e.timeStamp;
		}
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
		if ($swiping) {
			$swiping = false;
			const delta =
				swipeGestureDirection === 'horizontal'
					? e.changedTouches[0].clientX - swipeStartX
					: e.changedTouches[0].clientY - swipeStartY;
			if (delta < swipeGestureMinDistance) {
				slideRatio.set(1, {easing: transitionEasing});
				return;
			}
			const pixelThreshold =
				swipeGestureDirection === 'horizontal'
					? swipeGestureThreshold * ref.offsetWidth
					: swipeGestureThreshold * ref.offsetHeight;
			const swipeSpeedPixelPerMillisecond =
				speedSamples
					.slice(0, Math.min(swipeGestureMaxSpeedSamples, speedSamplesCount))
					.reduce((sum, cur) => sum + cur, 0) /
				Math.min(swipeGestureMaxSpeedSamples, speedSamplesCount);
			if (
				// Make sure that there are enough items in the stack.
				canGoBack() &&
				// Swiped for more the threshold...
				(delta > pixelThreshold ||
					// Or swiped fast enough.
					swipeSpeedPixelPerMillisecond > swipeGestureSpeedThresholdPixelsPerMillisecond)
			) {
				goBack(
					undefined,
					undefined,
					Math.min(
						transitionDuration / 2,
						swipeGestureDirection === 'horizontal'
							? ref.offsetWidth / swipeSpeedPixelPerMillisecond
							: ref.offsetHeight / swipeSpeedPixelPerMillisecond
					)
				);
			} else {
				slideRatio.set(1, {easing: transitionEasing});
			}
		}
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
		e.preventDefault();
		if (!$swiping) {
			swipeCurrentX = e.changedTouches[0].clientX;
			swipeCurrentY = e.changedTouches[0].clientY;
			if (
				(swipeGestureDirection === 'horizontal' &&
					Math.abs(swipeCurrentX - swipeStartX) > 20 &&
					Math.abs(swipeCurrentY - swipeStartY) < 20) ||
				(swipeGestureDirection === 'vertical' &&
					Math.abs(swipeCurrentX - swipeStartX) < 20 &&
					Math.abs(swipeCurrentY - swipeStartY) > 20)
			) {
				swipeStartX = e.changedTouches[0].clientX;
				swipeStartY = e.changedTouches[0].clientY;
				$swiping = true;
			}
		} else {
			speedSamples[speedSamplesCount % swipeGestureMaxSpeedSamples] =
				(swipeGestureDirection === 'horizontal'
					? e.changedTouches[0].clientX - swipeCurrentX
					: e.changedTouches[0].clientY - swipeCurrentY) /
				(e.timeStamp - lastSpeedSampleTime);
			lastSpeedSampleTime = e.timeStamp;
			speedSamplesCount++;
			swipeCurrentX = e.changedTouches[0].clientX;
			swipeCurrentY = e.changedTouches[0].clientY;

			slideRatio.set(
				Math.max(
					0,
					1 -
						Math.max(
							0,
							swipeGestureDirection === 'horizontal'
								? swipeCurrentX - swipeStartX
								: swipeCurrentY - swipeStartY
						) /
							(swipeGestureDirection === 'horizontal' ? ref.offsetWidth : ref.offsetHeight)
				),
				{
					duration: 0
				}
			);
		}
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
			if ($swiping) {
				$swiping = false;
				slideRatio.set(1);
			}
		}
	}
	//#endregion
</script>

<div
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
	on:touchcancel={handleTouchCancel}
	class="stack-router {className ?? ''}"
	{style}
	bind:this={ref}
/>

<style>
	.stack-router {
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: relative;
		top: 0;
		left: 0;
		z-index: 1;
	}
	:global(.stack-router-mount-point-wrapper) {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		overflow: hidden;
		z-index: 1;
	}
	:global(.stack-router-mount-point) {
		display: block;
		position: relative;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		outline: none;
		background: var(--svelte-stack-nav-page-background, #fff);
		z-index: 1;
	}
	:global(.stack-router-mount-point.modal) {
		margin-top: var(--safe-area-inset-top, 0px);
		top: var(--svelte-stack-nav-modal-offset-top, 20px);
		height: calc(
			100% - var(--svelte-stack-nav-modal-offset-top, 30px) - var(--safe-area-inset-top, 0px)
		);
		border-top-left-radius: var(--svelte-stack-nav-modal-border-radius, 30px);
		border-top-right-radius: var(--svelte-stack-nav-modal-border-radius, 30px);
		overflow: hidden;
	}
	:global(.stack-router-mount-point.modal > *) {
		--safe-area-inset-top: 0px;
	}
	@media (orientation: landscape) {
		:global(.stack-router-mount-point.modal) {
			width: var(--svelte-stack-nav-modal-landscape-width, 68%);
			left: calc((100% - var(--svelte-stack-nav-modal-landscape-width, 68%)) / 2);
			right: calc((100% - var(--svelte-stack-nav-modal-landscape-width, 68%)) / 2);
		}
	}
	:global(.stack-router-mount-point-overlay) {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: var(--svelte-stack-nav-overlay-background, rgba(0, 0, 0, 0.2));
		opacity: 0;
		pointer-events: none;
		z-index: 1;
	}
	:global(.stack-router-mount-point-dismiss-overlay) {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 0;
	}
</style>
