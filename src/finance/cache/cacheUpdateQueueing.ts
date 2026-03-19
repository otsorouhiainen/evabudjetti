let currentlyRunningUpdate: Promise<unknown> | undefined;

export function queueCacheUpdate<T>(
	updateFunction: () => Promise<T>,
): Promise<T> {
	const previousUpdate: Promise<unknown> =
		currentlyRunningUpdate ?? Promise.resolve();

	const updatePromise: Promise<T> = previousUpdate.then(
		updateFunction,
		updateFunction,
	);

	currentlyRunningUpdate = updatePromise;

	const clearIfCurrent = (): void => {
		if (currentlyRunningUpdate === updatePromise) {
			currentlyRunningUpdate = undefined;
		}
	};

	updatePromise.then(clearIfCurrent, clearIfCurrent);

	return updatePromise;
}
