svelte-webview-navigator

# svelte-webview-navigator

## Table of contents

### References

- [SafeAreaScrollView](README.md#safeareascrollview)
- [SafeAreaView](README.md#safeareaview)
- [ScrollView](README.md#scrollview)

### Classes

- [StackNavigator](classes/StackNavigator.md)

### Type aliases

- [LifecycleCallbacks](README.md#lifecyclecallbacks)
- [NavigationUtils](README.md#navigationutils)
- [StackItem](README.md#stackitem)
- [StackNavigatorContext](README.md#stacknavigatorcontext)
- [SvelteComponentConstructor](README.md#sveltecomponentconstructor)
- [TransitionFunction](README.md#transitionfunction)
- [TransitionFunctions](README.md#transitionfunctions)

### Variables

- [premadeTransitions](README.md#premadetransitions)

### Functions

- [mapRatio](README.md#mapratio)
- [onPause](README.md#onpause)
- [onResume](README.md#onresume)
- [useNavigation](README.md#usenavigation)

## References

### SafeAreaScrollView

Renames and re-exports [StackNavigator](classes/StackNavigator.md)

___

### SafeAreaView

Renames and re-exports [StackNavigator](classes/StackNavigator.md)

___

### ScrollView

Renames and re-exports [StackNavigator](classes/StackNavigator.md)

## Type aliases

### LifecycleCallbacks

Ƭ **LifecycleCallbacks**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onPauseCallbacks` | () => `unknown` \| `Promise`<`unknown`\>[] |
| `onResumeCallbacks` | (`returnValue?`: `unknown`) => `unknown` \| `Promise`<`unknown`\>[] |

#### Defined in

[src/lib/_types.ts:12](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L12)

___

### NavigationUtils

Ƭ **NavigationUtils**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `canGoBack` | `Readable`<`boolean`\> | Store that contains true if goBack can be invoked, false otherwise. |
| `navigating` | `Readable`<`boolean`\> | Store that contains true if the Navigator is handling a navigation request, false otherwise. |
| `swiping` | `Readable`<`boolean`\> | Store that contains true if a swipe gesture is in progress. |
| `goBack` | (`returnValue?`: `unknown`) => `Promise`<`void`\> | Goes to the previous page. If the stack contains only one page this function will throw. |
| `navigate` | <TProps\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`TProps`\>, `props`: `TProps`) => `Promise`<`void`\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`Record`<`string`, `unknown`\>\>) => `Promise`<`void`\> | Opens a new page, pushing it to the top of the stack and pausing the current one. |
| `openModal` | <TProps\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`TProps`\>, `props`: `TProps`) => `Promise`<`void`\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`Record`<`string`, `unknown`\>\>) => `Promise`<`void`\> | Opens a new page showing it as a modal, pushing it to the top of the stack and pausing the current one. |

#### Defined in

[src/lib/_types.ts:33](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L33)

___

### StackItem

Ƭ **StackItem**: { `componentInstance`: [`StackNavigator`](classes/StackNavigator.md) ; `mountPoint`: `HTMLDivElement` ; `overlay`: `HTMLDivElement` ; `ref`: `HTMLDivElement` ; `transitions`: [`TransitionFunctions`](README.md#transitionfunctions)  } & [`LifecycleCallbacks`](README.md#lifecyclecallbacks)

#### Defined in

[src/lib/_types.ts:17](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L17)

___

### StackNavigatorContext

Ƭ **StackNavigatorContext**: [`NavigationUtils`](README.md#navigationutils) & { `mountingItemLifecycleCallbacks`: [`LifecycleCallbacks`](README.md#lifecyclecallbacks) \| ``null`` ; `navigationStores`: `Readable`<[`number`, `boolean`, `boolean`]\> ; `stack`: `Writable`<[`StackItem`](README.md#stackitem)[]\> ; `dispatchError`: (`detail`: `Error`) => `unknown` ; `unsubscribeFromTransitions`: () => `void`  }

#### Defined in

[src/lib/_types.ts:80](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L80)

___

### SvelteComponentConstructor

Ƭ **SvelteComponentConstructor**<`TProps`\>: (`params`: { `context`: `Map`<`string`, `unknown`\> ; `props`: `TProps` ; `target`: `HTMLElement`  }) => `SvelteComponentTyped`<`TProps`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TProps` | extends `Record`<`string`, `unknown`\> = `Record`<`string`, `unknown`\> |

#### Type declaration

• (`params`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.context` | `Map`<`string`, `unknown`\> |
| `params.props` | `TProps` |
| `params.target` | `HTMLElement` |

#### Defined in

[src/lib/_types.ts:4](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L4)

___

### TransitionFunction

Ƭ **TransitionFunction**: (`t`: `number`) => `string`

#### Type declaration

▸ (`t`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `t` | `number` |

##### Returns

`string`

#### Defined in

[src/lib/_types.ts:25](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L25)

___

### TransitionFunctions

Ƭ **TransitionFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `back` | (`t`: `number`) => `string` |
| `front` | (`t`: `number`) => `string` |

#### Defined in

[src/lib/_types.ts:26](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_types.ts#L26)

## Variables

### premadeTransitions

• `Const` **premadeTransitions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scale` | { `back`: (`t`: `number`) => `string` ; `front`: (`t`: `number`) => `string`  } |
| `scale.back` | (`t`: `number`) => `string` |
| `scale.front` | (`t`: `number`) => `string` |
| `slide` | { `back`: (`t`: `number`) => `string` ; `front`: (`t`: `number`) => `string`  } |
| `slide.back` | (`t`: `number`) => `string` |
| `slide.front` | (`t`: `number`) => `string` |
| `slideRotate` | { `back`: (`t`: `number`) => `string` ; `front`: (`t`: `number`) => `string`  } |
| `slideRotate.back` | (`t`: `number`) => `string` |
| `slideRotate.front` | (`t`: `number`) => `string` |
| `slideShort` | { `back`: (`t`: `number`) => `string` ; `front`: (`t`: `number`) => `string`  } |
| `slideShort.back` | (`t`: `number`) => `string` |
| `slideShort.front` | (`t`: `number`) => `string` |

#### Defined in

[src/lib/_premade-transitions.ts:4](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_premade-transitions.ts#L4)

## Functions

### mapRatio

▸ **mapRatio**(`ratio`, `min`, `max`): `number`

Linearly map a number between 0 and 1 to a number between min and max.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ratio` | `number` | a number between 0 and 1. |
| `min` | `number` | the value that is returned when ratio is 0. |
| `max` | `number` | the value that is returned when ratio is 1. |

#### Returns

`number`

#### Defined in

[src/lib/_transition-utils.ts:8](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_transition-utils.ts#L8)

___

### onPause

▸ **onPause**(`callback`): `void`

Attach a callback to the pause event in the component lifecycle, i.e. when
the component is moved behind another one in the stack.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | () => `unknown` | a callback that will be invoked when a forward navigation event occurs from the currently visible component to another one. If the callback returns a Promise, the navigation will wait for it to resolve before starting the transition. |

#### Returns

`void`

#### Defined in

[src/lib/_hooks.ts:13](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_hooks.ts#L13)

___

### onResume

▸ **onResume**<`T`\>(`callback`): `void`

Attach a callback to the resume event in the component lifecycle, i.e. when
the component that was paused becomes the first (top) element of the stack.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`returnValue?`: `T`) => `unknown` | a callback that will be invoked when a backward navigation event occurs causing this previously paused component to be resumed. If the callback returns a Promise, the navigation will wait for it to resolve before starting the transition. |

#### Returns

`void`

#### Defined in

[src/lib/_hooks.ts:36](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_hooks.ts#L36)

___

### useNavigation

▸ **useNavigation**(): [`NavigationUtils`](README.md#navigationutils)

Return an object containing stores and functions that can be used to
interact with the navigator.

#### Returns

[`NavigationUtils`](README.md#navigationutils)

#### Defined in

[src/lib/_hooks.ts:55](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/src/lib/_hooks.ts#L55)
