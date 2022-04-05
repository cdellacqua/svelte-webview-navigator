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
	navigate<TProps extends Record<string, unknown>>(
		target: SvelteComponentConstructor<TProps>,
		props: TProps
	): Promise<void>;
	navigate(target: SvelteComponentConstructor): Promise<void>;
	openModal<TProps extends Record<string, unknown>>(
		target: SvelteComponentConstructor<TProps>,
		props: TProps
	): Promise<void>;
	openModal(target: SvelteComponentConstructor): Promise<void>;
	goBack: () => Promise<void>;
	canGoBack: Readable<boolean>;
	navigating: Readable<boolean>;
	swiping: Readable<boolean>;
};

export type StackNavigatorContext = NavigationUtils & {
	stack: Writable<StackItem[]>;
	mountingItemLifecycleCallbacks: LifecycleCallbacks | null;
	dispatchError: (detail: Error) => unknown;
	unsubscribeFromTransitions: () => void;
	navigationStores: Readable<[number, boolean, boolean]>;
};
