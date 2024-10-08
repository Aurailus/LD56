import { Vector2 } from "three";

export function range(a: number, b: number = 0) {
	const min = Math.min(a, b);
	const max = Math.max(a, b);

	const arr = [];
	for (let i = min; i < max; i++) arr.push(i);
	return arr;
}

export function classes(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

export const TILE_SIZE = 32;
export const SCALE = 3;

export function posToTranslate(pos: Vector2) {
	return `${pos.x * TILE_SIZE * SCALE}px ${pos.y * TILE_SIZE * SCALE}px`
}

export function translateToPos(pos: string) {
	const segments = pos.split(" ").map(s => s.trim());
	return new Vector2(Number.parseFloat(segments[0]) / TILE_SIZE / SCALE, Number.parseFloat(segments[1]) / TILE_SIZE / SCALE);
}

export function wait(ms: number) {
	return new Promise<void>(res => setTimeout(res, ms));
}

export function stripUndefined<T extends Record<string, any>>(obj: T): T {
	const newVal: any = {};
	for (const [ k, v ] of Object.entries(obj)) {
		if (v !== undefined) newVal[k] = v;
	}
	return newVal as T;
}

export const bumpElem = (elem: HTMLElement | null, dir: Vector2, mag: number = 1) => {
	if (elem) {
		const normalizedBumpOffset = dir.clone().normalize().multiplyScalar(1/8 * mag);
		const currPos = translateToPos(elem.style.translate ?? "");
		const bumpPos = currPos.clone().add(normalizedBumpOffset);
		const bumpStr = posToTranslate(bumpPos);
		elem.style.translate = bumpStr; 
		setTimeout(() => {
			if (elem?.style.translate !== bumpStr) return;
			elem.style.translate = posToTranslate(currPos);
		}, 50);
	}
	return wait(100);
}

export const clone = (obj: Record<string, any>) => {
	const cloneVal = (v: any): any => {
		if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v === null || v === undefined) {
			return v;
		}
		if (v instanceof Vector2) {
			return v.clone();
		}
		if (Array.isArray(v)) {
			return [...v.map(cloneVal)];
		}
		if (typeof v === "object") {
			return clone(v);
		}
		console.error("Unknown type to clone: ", v);
		return null;
	}

	const newObj: Record<string, any> = {};
	for (const [ k, v ] of Object.entries(obj)) {
		newObj[k] = cloneVal(v);
	}

	return newObj;
}
