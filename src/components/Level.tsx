import { ComponentChildren, h } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { Vector2 } from "three";
import { CollisionResult, Entity } from "../hooks/UseEntity";
import { InputState, LevelState, LevelStateContext, LevelStateData } from "../hooks/UseLevel";

interface Props {
	tilemap: number[][],
	children: ComponentChildren;
}

let dvorak = true;

export function Level(props: Props) {
	const [ integrity, setIntegrity ] = useState<number>(0);
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);

	const data = useMemo<LevelStateData>(() => ({ 
		entities: [], 
		inputState: InputState.Input,
		tilemap: props.tilemap
	}), []);

	const awaitingPromises = useRef<Promise<void>[]>([]);

	const step = useCallback(async () => {
		data.inputState = InputState.Waiting;
		await Promise.all(data.entities.map(e => e.props.onStep()));
		if (awaitingPromises.current.length === 0) data.inputState = InputState.Input;
	}, []);

	const collides = useCallback((pos: Vector2, other: Entity) => {
		let res: CollisionResult = {
			blockMovement: data.tilemap[pos.y][pos.x] !== 0,
			entity: null,
			onCollide: () => Promise.resolve()
		}
		for (let ent of data.entities) {
			if (ent.data.pos.equals(pos) && ent !== other && !ent.data.dead) {
				const entityRes = ent.props.onIntersect(ent, other);
				res = { ...entityRes, entity: ent }; 
				break;
			}
		}
		return res;
	}, []);

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
				Promise.all(currPromises).then(cb);
				currPromises = [ ...awaitingPromises.current ];
			}
		}
		Promise.all(currPromises).then(cb);
	}), [])

	const levelState = useMemo<LevelState>(() => ({
		data,
		await: awaitFn,
		collides,
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
