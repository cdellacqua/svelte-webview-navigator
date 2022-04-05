import {getContext} from 'svelte';
import {routerContextKey} from './_stack-router.js';
import type {NavigationUtils, StackNavigatorContext} from './_types.js';

export function onPause(callback: () => unknown | Promise<unknown>): void {
	const {mountingItemLifecycleCallbacks, dispatchError} =
		getContext<StackNavigatorContext>(routerContextKey);
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

export function onResume<T>(callback: (returnValue?: T) => unknown | Promise<unknown>): void {
	const {mountingItemLifecycleCallbacks, dispatchError} =
		getContext<StackNavigatorContext>(routerContextKey);
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

export function useNavigation(): NavigationUtils {
	const {navigate, goBack, canGoBack, navigating, swiping, openModal} =
		getContext<StackNavigatorContext>(routerContextKey);
	return {navigate, goBack, canGoBack, navigating, swiping, openModal};
}
