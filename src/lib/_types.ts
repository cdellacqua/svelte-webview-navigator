import type {SvelteComponent, SvelteComponentTyped} from 'svelte';
import type {Readable, Writable} from 'svelte/store';

export type SvelteComponentConstructor<
	TProps extends Record<string, unknown> = Record<string, unknown>
> = new (params: {
	target: HTMLElement;
	context: Map<string, unknown>;
	props: TProps;
}) => SvelteComponentTyped<TProps>;

export type LifecycleCallbacks = {
	onPauseCallbacks: (() => unknown | Promise<unknown>)[];
	onResumeCallbacks: ((returnValue?: unknown) => unknown | Promise<unknown>)[];
};

export type StackItem = {
	ref: HTMLDivElement;
	mountPoint: HTMLDivElement;
	overlay: HTMLDivElement;
	componentInstance: SvelteComponent;
	transitions: TransitionFunctions;
} & LifecycleCallbacks;

export type TransitionFunction = (t: number) => string;
export type TransitionFunctions = {
	/** t from 0 to 1 */
	front: (t: number) => string;
	/** t from 0 to 1 */
	back: (t: number) => string;
};

export type NavigationUtils = {
	/**
	 * Opens a new page, pushing it to the top of the stack and pausing the current one.
	 * @param target a Svelte component that will become the new active page.
	 * @param props props for the target.
	 */
	navigate<TProps extends Record<string, unknown>>(
		target: SvelteComponentConstructor<TProps>,
		props: TProps
	): Promise<void>;
	/**
	 * Opens a new page, pushing it to the top of the stack and pausing the current one.
	 * @param target a Svelte component that will become the new active page.
	 */
	navigate(target: SvelteComponentConstructor): Promise<void>;
	/**
	 * Opens a new page showing it as a modal, pushing it to the top of the stack and pausing the current one.
	 * @param target a Svelte component that will become the new active page.
	 * @param props props for the target.
	 */
	openModal<TProps extends Record<string, unknown>>(
		target: SvelteComponentConstructor<TProps>,
		props: TProps
	): Promise<void>;
	/**
	 * Opens a new page showing it as a modal, pushing it to the top of the stack and pausing the current one.
	 * @param target a Svelte component that will become the new active page.
	 */
	openModal(target: SvelteComponentConstructor): Promise<void>;
	/**
	 * Goes to the previous page. If the stack contains only one page this function will throw.
	 */
	goBack: () => Promise<void>;
	/**
	 * Store that contains true if goBack can be invoked, false otherwise.
	 */
	canGoBack: Readable<boolean>;
	/**
	 * Store that contains true if the Navigator is handling a navigation request, false otherwise.
	 */
	navigating: Readable<boolean>;
	/**
	 * Store that contains true if a swipe gesture is in progress.
	 */
	swiping: Readable<boolean>;
};

export type StackNavigatorContext = NavigationUtils & {
	stack: Writable<StackItem[]>;
	mountingItemLifecycleCallbacks: LifecycleCallbacks | null;
	dispatchError: (detail: Error) => unknown;
	unsubscribeFromTransitions: () => void;
	navigationStores: Readable<[number, boolean, boolean]>;
};
