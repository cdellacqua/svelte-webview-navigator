import {mapRatio} from './_transition-utils.js';
import type {TransitionFunctions} from './_types';

export const premadeTransitions = {
	slide: {
		front: (t: number): string => `transform: translateX(${100 * (1 - t)}%);`,
		back: (t: number): string => `transform: translateX(${-33 * t}%)`
	},
	slideShort: {
		front: (t: number): string => `opacity: ${t};transform: translateX(${10 * (1 - t)}%)`,
		back: (t: number): string => `opacity: ${1 - t};transform: translateX(${-10 * t}%)`
	},
	scale: {
		front: (t: number): string => `opacity: ${t};transform: scale(${mapRatio(t, 0.9, 1)})`,
		back: (t: number): string => `opacity: ${1 - t};transform: scale(${mapRatio(t, 1, 0.9)})`
	},
	slideRotate: {
		front: (t: number): string =>
			`opacity: ${t}; transform-origin: bottom center; transform: translateX(${
				10 * (1 - t)
			}%) rotateZ(${10 * (1 - t)}deg)`,
		back: (t: number): string =>
			`opacity: ${1 - t}; transform-origin: bottom center; transform: translateX(${
				-10 * t
			}%) rotateZ(${-10 * t}deg)`
	}
};

export const isPortrait =
	typeof window !== 'undefined'
		? window.matchMedia('(orientation: portrait)')
		: {
				matches: false,
				addEventListener: () => undefined,
				removeEventListener: () => undefined
		  };
export const modalTransitions: TransitionFunctions = {
	front: (t: number): string => `transform: translateY(${100 * (1 - t)}%);`,
	back: (t: number): string =>
		isPortrait.matches
			? `transform-origin: top center; transform: perspective(200px) translateY(${
					(Math.max(0, t - 0.8) / 0.2) * 10
			  }px) translateZ(${(Math.max(0, t - 0.8) / 0.2) * -10}px) rotateX(${
					(-Math.max(0, t - 0.8) / 2) * 10
			  }deg); border-top-left-radius: calc(var(--svelte-stack-nav-modal-border-radius, 30px) * ${t}); border-top-right-radius: calc(var(--svelte-stack-nav-modal-border-radius, 30px) * ${t})`
			: ''
};
