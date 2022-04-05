export function mapRatio(ratio: number, min: number, max: number): number {
	return min + ratio * (max - min);
}
