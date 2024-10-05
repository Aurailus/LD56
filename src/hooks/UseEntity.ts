import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks"
import { Vector2 } from "three";
import { useGameState } from "./UseGameState";

export type CollisionResult = [ boolean, () => Promise<void> ];

export interface EntityProps {
	name: string,
	pos: Vector2;
	onIntersect: (e: EntityInstance) => CollisionResult;
	onStep: () => Promise<void>;
}

export interface EntityInstance {
	pos: Vector2;
	props: EntityProps
	current: () => EntityInstance;
	setPos: (newPos: Vector2) => void;
}

export const useEntity = (propsFactory: () => EntityProps): EntityInstance => {
	const props = useMemo<EntityProps>(propsFactory, []);
	const [ pos, setPosRaw ] = useState<Vector2>(props.pos);
	const gameState = useGameState();
	
	const setPos = useCallback((pos: Vector2) => {
		setPosRaw(pos);
		props.pos = pos;
	}, [])
	
	const currentInstance = useRef<EntityInstance>(null);

	const instance = useMemo<EntityInstance>(() => ({
		current: () => currentInstance.current!,
		props,
		pos,
		setPos,
	}), [ props.name, pos, setPos ])
	currentInstance.current = instance;

	useLayoutEffect(() => {
		gameState.entities.push(instance);
		return () => gameState.entities.splice(gameState.entities.indexOf(instance), 1);
	}, [ instance ]);

	return instance;
}
