import {getContext} from 'svelte';
import {navigatorContextKey} from './_stack-router.js';
import type {NavigationUtils, StackNavigatorContext} from './_types.js';

/**
 * Attach a callback to the pause event in the component lifecycle, i.e. when
 * the component is moved behind another one in the stack.
 * @param callback a callback that will be invoked when a forward navigation event occurs from the currently visible
 * component to another one. If the callback returns a Promise, the navigation will wait for it to resolve before
 * starting the transition.
 * @returns
 */
export function onPause(callback: () => unknown | Promise<unknown>): void {
	const {mountingItemLifecycleCallbacks, dispatchError} =
		getContext<StackNavigatorContext>(navigatorContextKey);
	if (!mountingItemLifecycleCallbacks) {
		dispatchError(
			new Error(
				'Lifecycle function ignored, they can only be attached during component initialization'
			)
		);
		return;
	}
	mountingItemLifecycleCallbacks.onPauseCallbacks.push(callback);
}

/**
 * Attach a callback to the resume event in the component lifecycle, i.e. when
 * the component that was paused becomes the first (top) element of the stack.
 * @param callback a callback that will be invoked when a backward navigation event occurs causing
 * this previously paused component to be resumed.
 * If the callback returns a Promise, the navigation will wait for it to resolve before
 * starting the transition.
 * @returns
 */
export function onResume<T>(callback: (returnValue?: T) => unknown | Promise<unknown>): void {
	const {mountingItemLifecycleCallbacks, dispatchError} =
		getContext<StackNavigatorContext>(navigatorContextKey);
	if (!mountingItemLifecycleCallbacks) {
		dispatchError(
			new Error(
				'Lifecycle function ignored, they can only be attached during component initialization'
			)
		);
		return;
	}
	mountingItemLifecycleCallbacks.onResumeCallbacks.push(callback as () => unknown);
}

/**
 * Return an object containing stores and functions that can be used to
 * interact with the navigator.
 * @returns
 */
export function useNavigation(): NavigationUtils {
	const {navigate, goBack, canGoBack, navigating, swiping, openModal} =
		getContext<StackNavigatorContext>(navigatorContextKey);
	return {navigate, goBack, canGoBack, navigating, swiping, openModal};
}
