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

- [NavigationUtils](README.md#navigationutils)
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

### NavigationUtils

Ƭ **NavigationUtils**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `canGoBack` | `Readable`<`boolean`\> |
| `navigating` | `Readable`<`boolean`\> |
| `swiping` | `Readable`<`boolean`\> |
| `goBack` | () => `Promise`<`void`\> |
| `navigate` | <TProps\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`TProps`\>, `props`: `TProps`) => `Promise`<`void`\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`Record`<`string`, `unknown`\>\>) => `Promise`<`void`\> |
| `openModal` | <TProps\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`TProps`\>, `props`: `TProps`) => `Promise`<`void`\>(`target`: [`SvelteComponentConstructor`](README.md#sveltecomponentconstructor)<`Record`<`string`, `unknown`\>\>) => `Promise`<`void`\> |

#### Defined in

src/lib/_types.ts:33

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

src/lib/_types.ts:4

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

src/lib/_types.ts:25

___

### TransitionFunctions

Ƭ **TransitionFunctions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `back` | (`t`: `number`) => `string` |
| `front` | (`t`: `number`) => `string` |

#### Defined in

src/lib/_types.ts:26

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

src/lib/_premade-transitions.ts:4

## Functions

### mapRatio

▸ **mapRatio**(`ratio`, `min`, `max`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ratio` | `number` |
| `min` | `number` |
| `max` | `number` |

#### Returns

`number`

#### Defined in

src/lib/_transition-utils.ts:1

___

### onPause

▸ **onPause**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `unknown` |

#### Returns

`void`

#### Defined in

src/lib/_hooks.ts:5

___

### onResume

▸ **onResume**<`T`\>(`callback`): `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`returnValue?`: `T`) => `unknown` |

#### Returns

`void`

#### Defined in

src/lib/_hooks.ts:19

___

### useNavigation

▸ **useNavigation**(): [`NavigationUtils`](README.md#navigationutils)

#### Returns

[`NavigationUtils`](README.md#navigationutils)

#### Defined in

src/lib/_hooks.ts:33
