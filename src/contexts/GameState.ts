import { createContext } from "preact";
import { CollisionResult, EntityInstance, EntityProps } from "../hooks/UseEntity";
import { Vector2 } from "three";

export enum State {
	Input,
	Response
}

export type GameStateContextData = {
	state: State;
	tilemap: number[][]
	entities: EntityInstance[]
}

export type GameStateContextHooks = {
	stepGame(): void;
	collides(pos: Vector2, other: EntityInstance): CollisionResult;
	current(): GameState;
	pauseUntil(res: Promise<void>): void; 
}

export type GameState = GameStateContextData & GameStateContextHooks;

export const GameStateContext = createContext<GameState>({} as any);
