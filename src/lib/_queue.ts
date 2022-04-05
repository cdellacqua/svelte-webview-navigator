export type Runnable<T = unknown> = () => Promise<T>;

export type CommandQueue = {
	run: <T>(runnable: Runnable<T>) => Promise<T>;
};

export function makeCommandQueue(): CommandQueue {
	const queue: {
		runnable: Runnable;
		promise: Promise<unknown>;
		res: (result: unknown) => unknown;
		rej: (err: unknown) => unknown;
	}[] = [];

	let consuming = false;

	function prepareQueueItem<T>(runnable: Runnable<T>) {
		let res: (result: T) => unknown = () => undefined;
		let rej: (err: unknown) => unknown = () => undefined;
		const promise = new Promise<T>((pRes, pRej) => {
			res = pRes;
			rej = pRej;
		});
		return {res, rej, promise, runnable};
	}

	function enqueue<T>(runnable: Runnable<T>): Promise<unknown> {
		queue.push(prepareQueueItem(runnable) as typeof queue[number]);
		return queue[queue.length - 1].promise;
	}

	async function consume() {
		if (consuming) {
			return;
		}
		consuming = true;
		while (queue.length > 0) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const {runnable, rej, res} = queue.shift()!;
			try {
				res(await runnable());
			} catch (err) {
				rej(err);
			}
		}
		consuming = false;
	}

	return {
		run: async function <T>(runnable: Runnable<T>) {
			const promise = enqueue<T>(runnable);
			consume();
			return promise as Promise<T>;
		}
	};
}
