import { useEffect } from "preact/hooks";
import useStore from "./UseStore";
import { useUniqueCounter } from "./UseUniqueCounter";

const FRAME_UPDATE_INTERVAL = 250;

const listeners = new Set<() => void>();

let frame = 0;
let timeout = 0;
const setUpdateTimeout = () => {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		frame++;
		listeners.forEach(l => l());
		setUpdateTimeout();
	}, FRAME_UPDATE_INTERVAL) as any as number;
}
setUpdateTimeout();

export function useAnimFrame(key?: string) {
	const counter = useUniqueCounter(key ?? "");
	const currFrame = useStore(frame);
	useEffect(() => {
		const cb = () => currFrame(frame);
		listeners.add(cb);
		return () => listeners.delete(cb);
	}, []);
	return currFrame() + (key ? counter : 0);
}

export function pulseFrame() {
	frame++;
	listeners.forEach(l => l());
	setUpdateTimeout();
}
