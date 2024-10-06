import { useState, useEffect } from 'preact/hooks';

/**
 * Creates a stateful value that is stored in local storage via a unique key, providing a simple way to
 * store persistent state. State is stored using `JSON.stringify` on update, and retrieved using `JSON.parse`.
 * Based on https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/.
 *
 * @param def - The default value if no stored value exists.
 * @param key - The unique key to store the value under.
 * @param serverDefault - The default value if the hook is used in SSR.
 * @returns the value and a function to update it, wrapped in an array.
 */

export default function useStoredState<T>(def: T | (() => T), key: string): [
	T, (value: T | ((currentValue: T) => T)) => void ] {

	const [ value, setValue ] = useState<T>(() => {
		const stored = window?.localStorage.getItem(key);
		try {
			return stored !== null && stored !== undefined ? JSON.parse(stored) : def;
		} catch (e) {
			console.warn('StoredState error:' + e);
			return typeof def === 'function' ? (def as any)() : def;
		}
	});

	useEffect(() => window.localStorage.setItem(key, JSON.stringify(value)), [ key, value ]);

	return [ value, setValue ];
}
