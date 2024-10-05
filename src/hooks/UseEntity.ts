import { useCallback, useLayoutEffect, useMemo, useState } from "preact/hooks"
import { Vector2 } from "three";
import { useLevel } from "./UseLevel";

export type CollisionResult = {
	blockMovement: boolean,
	entity: Entity | null,
	onCollide: () => Promise<void>
};

export interface EntityProps {
	name: string,
	pos: Vector2;

	onIntersect: (e: Entity) => CollisionResult;
	onStep: () => Promise<void>;
}

export interface EntityData {
	pos: Vector2;
}

export interface Entity {
	props: EntityProps
	data: EntityData
	setPos: (newPos: Vector2) => void;
}

export const useEntity = (propsFactory: () => EntityProps): Entity => {
	const [ , setIntegrity ] = useState<number>(0);
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);

	const props = useMemo<EntityProps>(propsFactory, []);
	const data = useMemo(() => ({ pos: props.pos }), []);
	
	const setPos = useCallback((pos: Vector2) => {
		data.pos = pos;
		rerender();
	}, [])
	
	const entity = useMemo<Entity>(() => ({
		props,
		data,
		setPos
	}), [])

	const level = useLevel();
	useLayoutEffect(() => {
		level.data.entities.push(entity);
		return () => level.data.entities.splice(level.data.entities.indexOf(entity), 1);
	}, []);

	return entity;
}
