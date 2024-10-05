import { useState } from 'preact/hooks';

/**
 * Creates a Ref, using a function initializer.
 *
 * @param value - A function that returns the ref's initial value.
 * @returns a ref.
 */

export default function useLazyRef<T = any>(initializer: () => T) {
	const [ref] = useState(() => ({ current: initializer() }));
	return ref;
}
