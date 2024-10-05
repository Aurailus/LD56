import { ComponentChildren, h } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { Vector2 } from "three";
import { PushResult, Entity, CollisionResult, AnyEntity } from "../hooks/UseEntity";
import { InputState, LevelState, LevelStateContext, LevelStateData } from "../hooks/UseLevel";
import { Tile } from "../Tile";

interface Props {
	tilemap: number[][],
	children: ComponentChildren;
}

export function Level(props: Props) {
	const [ integrity, setIntegrity ] = useState<number>(0);
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);

	const data = useMemo<LevelStateData>(() => ({ 
		entities: [], 
		inputState: InputState.Input,
		tilemap: props.tilemap
	}), []);

	const awaitingPromises = useRef<Promise<void>[]>([]);

	const awaitFn = useCallback((promise: Promise<void>) => new Promise<void>(res => {
		data.inputState = InputState.Waiting;
		awaitingPromises.current.push(promise);
		let currPromises = [ ...awaitingPromises.current ];
		const cb = () => {
			awaitingPromises.current = awaitingPromises.current.filter(pr => !currPromises.includes(pr));
			if (awaitingPromises.current.length === 0) {
				data.inputState = InputState.Input;
				res();
			}
			else {
				currPromises = [ ...awaitingPromises.current ];
				Promise.all(currPromises).then(cb);
			}
		}
		Promise.all(currPromises).then(cb);
	}), [])

	const step = useCallback(async () => {
		data.inputState = InputState.Waiting;
		await awaitFn(Promise.resolve());
		data.inputState = InputState.Waiting;
		await Promise.all(data.entities.map(e => e.props.onStep(e)));
		await awaitFn(Promise.resolve());
	}, []);

	const testCollision = useCallback((pos: Vector2, other: AnyEntity) => {
		const tile = data.tilemap[pos.y][pos.x];
		let res: CollisionResult = {
			collides: other.props.name === "Player" 
				? (tile !== Tile.Ground && tile !== Tile.RoughGround) 
				: (tile !== Tile.Ground && tile !== Tile.Water),
			entity: null
		}
		for (let ent of data.entities) {
			if (ent.data.pos.equals(pos) && ent !== other && !ent.data.dead) {
				const collides = ent.props.canCollide(ent, other);
				res = { collides, entity: ent }; 
				break;
			}
		}
		return res;
	}, [])

	const testPush = useCallback((pos: Vector2, other: AnyEntity) => {
		let res: PushResult = {
			canPush: false,
			entity: null
		}
		for (let ent of data.entities) {
			if (ent.data.pos.equals(pos) && ent !== other && !ent.data.dead) {
				const canPush = ent.props.canPush(ent, other);
				res = { canPush, entity: ent }; 
				break;
			}
		}
		return res;
	}, []);

	const getTile = useCallback((pos: Vector2) => {
		return data.tilemap[pos.y][pos.x];
	}, []);

	const getEntity = useCallback((pos: Vector2, ignore?: AnyEntity) => {
		return data.entities.find(ent => ent.data.pos.equals(pos) && ent.data !== ignore?.data) ?? null;
	}, []);

	const levelState = useMemo<LevelState>(() => ({
		data,
		await: awaitFn,
		testCollision,
		testPush,
		getTile,
		getEntity,
		step,
	}), []);

	const diffedLevelState = useMemo(() => ({ ...levelState }), [ integrity ]);

	return (
		<LevelStateContext.Provider value={diffedLevelState}>
			<div class="relative grid [&>*]:[grid-area:a]" style={{
				gridTemplateAreas: "a",
				width: 32 * data.tilemap[0].length, 
				height: 32 * data.tilemap.length,
				transform: `scale(3)`,
			}}>
				{props.children}
			</div>
		</LevelStateContext.Provider>
	);
}
