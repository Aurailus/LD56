import { useContext } from "preact/hooks";
import { createContext } from "preact";
import { CollisionResult, Entity } from "./UseEntity";
import { Vector2 } from "three";

export enum InputState {
	Input,
	Waiting
}

export type LevelStateData = {
	inputState: InputState;
	tilemap: number[][]
	entities: Entity[]
}

export type LevelState = {
	data: LevelStateData
	
	step(): Promise<void>;
	collides(pos: Vector2, other: Entity): CollisionResult;
	await(res: Promise<void>): Promise<void>;
};

export const LevelStateContext = createContext<LevelState>({} as any);

export const useLevel = () => {
	return useContext(LevelStateContext);
}
