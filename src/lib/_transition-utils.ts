/**
 * Linearly map a number between 0 and 1 to a number between min and max.
 * @param ratio a number between 0 and 1.
 * @param min the value that is returned when ratio is 0.
 * @param max the value that is returned when ratio is 1.
 * @returns
 */
export function mapRatio(ratio: number, min: number, max: number): number {
	return min + ratio * (max - min);
}
