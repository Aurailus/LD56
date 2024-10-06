import { useMemo } from "preact/hooks";

const COUNTER_VALS: Record<string, number> = {};

export function useUniqueCounter(key: string) {
	return useMemo(() => {
		if (!COUNTER_VALS[key]) COUNTER_VALS[key] = 0;
		const value = COUNTER_VALS[key];;
		COUNTER_VALS[key]++;
		return value;
	}, [ key ]);
}
