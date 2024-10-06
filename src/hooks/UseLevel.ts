import { useContext } from "preact/hooks";
import { createContext } from "preact";
import { PushResult, CollisionResult, AnyEntity } from "./UseEntity";
import { Vector2 } from "three";

export enum InputState {
	Input,
	Waiting
}

export type LevelStateData = {
	inputState: InputState;
	tilemap: number[][]
	entities: AnyEntity[]
}

export type LevelState = {
	data: LevelStateData
	
	step(): Promise<void>;
	testCollision(pos: Vector2, other: AnyEntity): CollisionResult;
	testPush(pos: Vector2, other: AnyEntity): PushResult
	getTile(pos: Vector2): number;
	getEntity(pos: Vector2, ignore?: AnyEntity): AnyEntity | null;
	await(res: Promise<void>): Promise<void>;
	writeUndoStep(): void;
	undo(): void;
};

export const LevelStateContext = createContext<LevelState>({} as any);

export const useLevel = () => {
	return useContext(LevelStateContext);
}
