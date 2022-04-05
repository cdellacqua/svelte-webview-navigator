[svelte-webview-navigator](../README.md) / StackNavigator

# Class: StackNavigator

Base class for Svelte components with some minor dev-enhancements. Used when dev=true.

## Hierarchy

- `SvelteComponent`

  ↳ **`StackNavigator`**

## Indexable

▪ [accessor: `string`]: `any`

## Table of contents

### Constructors

- [constructor](StackNavigator.md#constructor)

### Properties

- [$$](StackNavigator.md#$$)
- [$$events\_def](StackNavigator.md#$$events_def)
- [$$prop\_def](StackNavigator.md#$$prop_def)
- [$$set](StackNavigator.md#$$set)
- [$$slot\_def](StackNavigator.md#$$slot_def)

### Methods

- [$capture\_state](StackNavigator.md#$capture_state)
- [$destroy](StackNavigator.md#$destroy)
- [$inject\_state](StackNavigator.md#$inject_state)
- [$on](StackNavigator.md#$on)
- [$set](StackNavigator.md#$set)

## Constructors

### constructor

• **new StackNavigator**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IComponentOptions`<`Record`<`string`, `any`\>\> |

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:59

## Properties

### $$

• **$$**: `T$$`

#### Defined in

node_modules/svelte/types/runtime/internal/Component.d.ts:48

___

### $$events\_def

• `Private` **$$events\_def**: `any`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:51

___

### $$prop\_def

• `Private` **$$prop\_def**: `Props`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:44

___

### $$set

• `Optional` **$$set**: (`$$props`: `any`) => `void`

#### Type declaration

▸ (`$$props`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `$$props` | `any` |

##### Returns

`void`

#### Defined in

node_modules/svelte/types/runtime/internal/Component.d.ts:49

___

### $$slot\_def

• `Private` **$$slot\_def**: `any`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:58

## Methods

### $capture\_state

▸ **$capture_state**(): `void`

#### Returns

`void`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:60

___

### $destroy

▸ **$destroy**(): `void`

#### Returns

`void`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:22

___

### $inject\_state

▸ **$inject_state**(): `void`

#### Returns

`void`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:61

___

### $on

▸ **$on**(`event`, `callback`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `callback` | (`event`: `any`) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:21

___

### $set

▸ **$set**(`props?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `Props` |

#### Returns

`void`

#### Defined in

node_modules/svelte/types/runtime/internal/dev.d.ts:20
