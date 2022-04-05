# svelte-webview-navigator

A Svelte navigator for WebView-based apps that emulates the Stack navigation behavior of native Apps.

You can use this navigator in Capacitor.js, Cordova and other JavaScript WebView adapters.

Note: although it's possible, it's not recommended to use this navigator as a router in a Web App,
because the Web UX differs from the App UX, for example Apps don't really have links, only
special entry points, Web Apps and Websites don't use a stack-based history navigation, and so on.

[NPM Package](https://www.npmjs.com/package/svelte-webview-navigator)

`npm install svelte-webview-navigator`

[Documentation](https://github.com/cdellacqua/svelte-webview-navigator/blob/main/docs/README.md)

## Quick start

Make sure your `<html>`, `<body>` and all the elements wrapping the navigator component have `height: 100%`.

Add this `<meta>` tag to your html `<head>` to prevent unwanted pinch-to-zoom (`maximum-scale`) and to support the notch or similar things covering the screen (`viewport-fit`):

`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />`

Add this CSS block to your styles:

```css
:root {
	--safe-area-inset-top: env(safe-area-inset-top);
	--safe-area-inset-right: env(safe-area-inset-right);
	--safe-area-inset-bottom: env(safe-area-inset-bottom);
	--safe-area-inset-left: env(safe-area-inset-left);
}
```

Now that the environment is set up, you can import the `StackNavigator` component and place it in your main component:

```svelte
<script lang="ts">
	import {StackNavigator} from 'svelte-webview-navigator';
	import Home from './Home.svelte';
</script>

<StackNavigator main={Home} />
```

The `Home` component will be the first one mounted by the navigator and the one the user will get back to when
swiping back or pressing the hardware back button.

## Views

By default the content in your page is displayed as-is in a container with `overflow: hidden` and
`height: 100%`. This means that if the page content is taller than the screen height it will
get clipped and that if there is a notch it can cover parts of the content.

This navigator provides 3 wrappers for your views/pages: SafeAreaView, ScrollView, SafeAreaScrollView.

When you create a new page in your app you will probably need to use one of those to make sure
that the page content is correctly displayed.

SafeAreaView and SafeAreaScrollView add padding at the top, right, bottom and left sides of the page
to make sure that its content is never behind a notch. If there is no notch they have no effect.

| wrapper            | content scrollable | content behind the notch |
| ------------------ | ------------------ | ------------------------ |
| none               | no                 | yes                      |
| ScrollView         | yes                | yes                      |
| SafeAreaView       | no                 | no                       |
| SafeAreaScrollView | yes                | no                       |

## Navigation

By calling `useNavigation` inside a page (a component rendered by the navigator, e.g. `Home` in the example above)
you get access to a handful of functions and stores that can be used to navigate and get the current
status of the navigator.

As an example, here is a page with a back button:

```svelte
<script lang="ts">
	const {goBack, canGoBack} = useNavigation();
</script>

<button on:click={() => {
	if ($canGoBack)
		goBack();
	} else {
		alert('The stack contains only the current page, cannot go back')
	}
}}>Back</button>
```

To navigate forward you can call either `navigate` or `openModal`. They both accept the same
parameters (a component or a component and its props), but the presentation is different.

```svelte
<script lang="ts">
	import AnotherPage from './AnotherPage.svelte';

	const {navigate} = useNavigation();
</script>

<button
	on:click={() => {
		navigate(AnotherPage);
		// or openModal(AnotherPage);
	}}>Link</button
>
<button
	on:click={() => {
		navigate(AnotherPage, {someProp: 42});
		// or openModal(AnotherPage, {someProp: 42});
	}}>Link with props</button
>
```

Here is a complete reference of the functions and stores provided by `useNavigation`:

| name       | type     | description                                                                                  |
| ---------- | -------- | -------------------------------------------------------------------------------------------- |
| navigate   | function | Opens a new page, pushing it to the top of the stack and pausing the current one.            |
| openModal  | function | Same as navigate, but presents the new page as a modal.                                      |
| goBack     | function | Goes to the previous page. If the stack contains only one page this function will throw.     |
| canGoBack  | store    | Store that contains true if goBack can be invoked, false otherwise.                          |
| navigating | store    | Store that contains true if the Navigator is handling a navigation request, false otherwise. |
| swiping    | store    | Store that contains true if a swipe gesture is in progress.                                  |

All navigation functions return a Promise that resolves once the navigation is complete (i.e. the transition has ended),
or rejects if there was an error (e.g. goBack was called even if canGoBack was false).

The StackNavigator component has also a `on:error` event to which you can attach a listener that will receive all
the errors that can occur during navigation.

### Hardware back button

To handle the hardware back button in your framework of choice you can manually call the `goBack` function
from the router context. As an example, if you are using Capacitor.js (or Ionic) you can install
the `@capacitor/app` plugin (details in the [docs here](https://capacitorjs.com/docs/apis/app)):

```svelte
<script lang="ts">
	import {get} from 'svelte/store';
	import {App} from '@capacitor/app';
	import type {StackNavigatorContext} from 'svelte-webview-navigator';
	import {StackNavigator} from 'svelte-webview-navigator';
	import Home from './Home.svelte';

	let routerContext: StackNavigatorContext | undefined;
	App.addListener('backButton', () => {
		if (!routerContext) {
			return;
		}
		if (get(routerContext.canGoBack)) {
			routerContext.goBack();
		} else {
			App.exitApp();
		}
	});
</script>

<StackNavigator main={Home} bind:routerContext />
```

## Customizations

### Colors

You can customize the appearance of the navigator by setting the following CSS variables:

| variable                                 | description                                                                                                     | default            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------ |
| --svelte-stack-nav-page-background       | The background of the current page.                                                                             | #fff               |
| --svelte-stack-nav-modal-offset-top      | The distance from the safe area top border and the modal top border.                                            | 30px               |
| --svelte-stack-nav-modal-border-radius   | The border radius of the modal window.                                                                          | 30px               |
| --svelte-stack-nav-modal-landscape-width | The width of the modal window when the device is in landscape mode.                                             | 68%                |
| --svelte-stack-nav-overlay-background    | The page overlay color. This overlay is used to darken the content of a page when transitioning to another one. | rgba(0, 0, 0, 0.2) |

You can pass those variables directly to the StackNavigator `style` property (e.g. `<StackNavigator style="--svelte-stack-nav-page-background: red" ... />`) or you can set them in your stylesheet
(e.g. `:root { --svelte-stack-nav-page-background: red }`).

As with all CSS variables, you can customize them based on the preferred color scheme of the user
using the following media query:

```css
@media (prefers-color-scheme: dark) {
	:root {
		--svelte-stack-nav-page-background: black;
	}
}
```

### Page transitions

You can customize the transition between pages by creating your transition functions and passing
them to the navigator `transitions` property or by passing a premade transition object:

```svelte
<script lang="ts">
	import {StackNavigator, premadeTransitions} from 'svelte-webview-navigator';
	import Home from './Home.svelte';
</script>

<StackNavigator transitions={premadeTransitions.slideRotate} main={Home} />
```

You can also customize the easing and duration of the transition by passing
the `transitionEasing` and `transitionDuration` properties. The easing is
can be imported from `svelte/easing`, while the duration is a number in milliseconds.

| prop               | description                                                                                 | default                  |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------ |
| transitions        | An object containing a transition for the page in front of the user and the page behind it. | premadeTransitions.slide |
| transitionEasing   | An easing function u = f(t) where both t and u are numbers from 0 to 1.                     | expoInOut                |
| transitionDuration | The duration of the transition in milliseconds.                                             | 600                      |

If you want to create your custom transition you can use the following template:

```typescript
const myTransition = {
	front: (t: number): string => `opacity: ${t}; transform: translateX(${10 * (1 - t)}%)`,
	back: (t: number): string => `opacity: ${1 - t}; transform: translateX(${-10 * t}%)`
};
```

`front` describes the transition of the current page, while
`back` is the page behind it. `t` is 0 when a new page has just been pushed onto the stack
and the transition is about to start, while it is 1 when the transition has ended and
the navigation has completed. When the user goes to the previous page `t` goes from 1 to 0
to reverse the original transition.

### Swipe gestures

The StackNavigator supports the swipe back and swipe down gestures out
of the box. If you want to tailor the swipe interaction you can tweak the following properties:

| prop                                           | description                                                                                                            | default   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------- |
| enableSwipeGestures                            | Whether the swipe gestures are enabled or disabled.                                                                    | true      |
| swipeGestureSensitiveAreaWidth                 | Portion of the left-most part of the screen that should be listening for swipe gestures.                               | 0.05 (5%) |
| swipeGestureSensitiveAreaHeight                | Portion of the upper-most part of the screen that should be listening for swipe gestures.                              | 1 (100%)  |
| swipeGestureSpeedThresholdPixelsPerMillisecond | Number of pixels per millisecond that should trigger a call to the goBack function                                     | 0.1       |
| swipeGestureThreshold                          | When the user drags the current page crossing this threshold, goBack is called regardless of the speed of the gesture. | 0.4 (40%) |
| swipeGestureMaxSpeedSamples                    | Number of samples used to determine the speed of the swipe gesture.                                                    | 100       |
| swipeGestureMinDistance                        | Minimum distance that the finger has to travel to activate the swipe gesture.                                          | 50        |
