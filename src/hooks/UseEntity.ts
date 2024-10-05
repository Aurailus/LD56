import { useCallback, useLayoutEffect, useMemo, useState } from "preact/hooks"
import { Vector2 } from "three";
import { useLevel } from "./UseLevel";
import { stripUndefined } from "../Util";

export type CollisionResult = {
	blockMovement: boolean,
	entity: Entity | null,
	onCollide: () => Promise<void>
};

export type EntityCollisionResult = {
	blockMovement: boolean,
	onCollide: () => Promise<void>
};

export interface EntityProps {
	name: string,
	pos: Vector2;

	onIntersect: (self: Entity, other: Entity) => EntityCollisionResult;
	onStep: () => Promise<void>;
}

const DEFAULT_ENTITY_PROPS = {
	onIntersect: () => ({
		blockMovement: true,
		onCollide: () => Promise.resolve()
	}),
	onStep: () => Promise.resolve()
} satisfies Partial<EntityProps>;

type InputEntityProps = Omit<EntityProps, keyof typeof DEFAULT_ENTITY_PROPS> & Partial<EntityProps>;

export interface EntityData {
	pos: Vector2;
	dead: boolean;
}

export interface Entity {
	props: EntityProps
	data: EntityData
	setPos: (newPos: Vector2) => void;
	setDead: (dead: boolean) => void;
}

export const useEntity = (propsFactory: () => InputEntityProps): Entity => {
	const [ , setIntegrity ] = useState<number>(0);
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);

	const props = useMemo<EntityProps>(() => ({ ...DEFAULT_ENTITY_PROPS, ...stripUndefined(propsFactory()) }), []);
	const data = useMemo(() => ({ pos: props.pos, dead: false }), []);
	
	const setPos = useCallback((pos: Vector2) => {
		data.pos = pos;
		rerender();
	}, [])

	const setDead = useCallback((dead: boolean) => {
		data.dead = dead;
		rerender();
	}, [])
	
	const entity = useMemo<Entity>(() => ({
		props,
		data,
		setPos,
		setDead
	}), [])

	const level = useLevel();
	useLayoutEffect(() => {
		level.data.entities.push(entity);
		return () => level.data.entities.splice(level.data.entities.indexOf(entity), 1);
	}, []);

	return entity;
}
