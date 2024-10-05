import { MutableRef, useCallback, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks"
import { Vector2 } from "three";
import { useLevel } from "./UseLevel";
import { bumpElem, stripUndefined } from "../Util";
import { RefObject } from "preact";

export type AnyEntity = Entity<any>;

export type PushResult = {
	canPush: boolean
	entity: AnyEntity | null,
};

export type CollisionResult = {
	entity: AnyEntity | null,
	collides: boolean
}

export interface EntityProps<T extends Record<string, any>> {
	name: string,
	pos: Vector2;
	data: T;

	canPush(self: AnyEntity, other: AnyEntity): boolean;
	onPush(self: AnyEntity, other: AnyEntity): Promise<void>;
	canCollide(self: AnyEntity, other: AnyEntity): boolean;
	onCollide(self: AnyEntity, other: AnyEntity): Promise<void>;
	onStep: (self: AnyEntity) => Promise<void>;
	bump: (self: AnyEntity, from: Vector2, mag: number) => Promise<void>;
}

const DEFAULT_ENTITY_PROPS = {
	canPush: () => false,
	onPush: () => Promise.resolve(),
	canCollide: () => true,
	onCollide: () => Promise.resolve(),
	onStep: () => Promise.resolve(),
	bump: (self, from, mag) => {
		const posDiff = from.clone().sub(self.data.pos);
		return bumpElem(self.ref.current!, posDiff, mag);
	}
} satisfies Partial<EntityProps<any>>;

type InputEntityProps<T extends Record<string, any>> = 
	Omit<EntityProps<T>, keyof typeof DEFAULT_ENTITY_PROPS> & Partial<EntityProps<T>>;

export type EntityData<T extends Record<string, any>> = {
	pos: Vector2;
	dead: boolean;
} & T;

export interface Entity<T extends Record<string, any>> {
	props: EntityProps<T>
	data: EntityData<T>
	ref: RefObject<HTMLDivElement>
	setPos: (newPos: Vector2) => void;
	setDead: (dead: boolean) => void;
	bump: (from: Vector2, mag?: number) => void;
}

export const useEntity = <T extends Record<string, any> = {}>(propsFactory: () => InputEntityProps<T>): Entity<T> => {
	const [ , setIntegrity ] = useState<number>(0);
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);

	const ref = useRef<HTMLDivElement>(null);
	const props = useMemo<EntityProps<T>>(() => ({ ...DEFAULT_ENTITY_PROPS, ...stripUndefined(propsFactory()) }), []);
	const data = useMemo(() => ({ pos: props.pos, dead: false, ...props.data }), []);
	
	const setPos = useCallback((pos: Vector2) => {
		data.pos = pos;
		rerender();
	}, [])

	const setDead = useCallback((dead: boolean) => {
		data.dead = dead;
		rerender();
	}, [])

	const setData = useCallback((newData: Partial<T>) => {
		Object.assign(data, stripUndefined(newData));
		rerender();
	}, []);
	
	const bump = useCallback((from: Vector2, mag = 1) => props.bump(entity, from, mag), []);
	
	const entity = useMemo<Entity<T>>(() => ({
		props,
		data,
		ref,
		setPos,
		setDead,
		setData,
		bump
	}), [])

	const level = useLevel();
	useLayoutEffect(() => {
		level.data.entities.push(entity);
		return () => level.data.entities.splice(level.data.entities.indexOf(entity), 1);
	}, []);

	return entity;
}
