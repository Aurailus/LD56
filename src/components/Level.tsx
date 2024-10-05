import { ComponentChildren, h } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { GameState, GameStateContext, GameStateContextData, GameStateContextHooks, State } from "../contexts/GameState";
import { Vector2 } from "three";
import { CollisionResult, EntityInstance, EntityProps } from "../hooks/UseEntity";

interface Props {
	tilemap: number[][],
	children: ComponentChildren;
}

let dvorak = true;

export function Level(props: Props) {
	const currentGameState = useRef<GameState>(null as any);

	const [ state, setGameState ] = useState<GameStateContextData>(() => ({
		state: State.Input,
		tilemap: props.tilemap,
		entities: []
	}));

	const current = useCallback(() => currentGameState.current, []);

	const pausePromises = useRef<Promise<void>[]>([]);

	const stepGame = useCallback(() => {
		setGameState(state => {
			Promise.all(state.entities.map(e => e.props.onStep()))
				.then(() => setGameState(state => ({ ...state, state: State.Input })));
			return { ...state, state: State.Response };
		});
	}, []);

	const collides = useCallback((pos: Vector2, other: EntityInstance) => {
		console.log('checking collides at ', pos);
		let res: CollisionResult = [ current().tilemap[pos.y][pos.x] !== 0, () => Promise.resolve() ]
		for (let ent of current().entities) {
			if (!ent.pos.equals(pos) || ent === other) continue;
			res = ent.props.onIntersect(other);
			break;
		}
		return res;
	}, []);

	const pauseUntil = useCallback((res: Promise<void>) => {
		setGameState(state => ({ ...state, state: State.Response }));
		pausePromises.current.push(res);
		const currPromises = [ ...pausePromises.current ];
		const cb = () => {
			pausePromises.current = pausePromises.current.filter(pr => !currPromises.includes(pr));
			if (pausePromises.current.length === 0) setGameState(state => ({ ...state, state: State.Input }));
			else Promise.all(pausePromises.current).then(cb);
		}
		Promise.all(pausePromises.current).then(cb);
	}, [])

	const hooks = useMemo<GameStateContextHooks>(() => ({
		stepGame,
		collides,
		current,
		pauseUntil,
	}), [ stepGame, collides, current ])

	const gameState = useMemo(() => ({ ...state, ...hooks }), [ state, hooks ]);
	currentGameState.current = gameState;

	return (
		<GameStateContext.Provider value={gameState}>
			<div class="relative grid [&>*]:[grid-area:a]" style={{
				gridTemplateAreas: "a",
				width: 32 * state.tilemap[0].length, 
				height: 32 * state.tilemap.length,
				transform: `scale(3)`,
			}}>
				{props.children}
			</div>
		</GameStateContext.Provider>
	);
}
