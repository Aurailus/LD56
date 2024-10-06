import { ComponentChildren, h } from "preact";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Vector2 } from "three";
import { PushResult, CollisionResult, AnyEntity } from "../hooks/UseEntity";
import { InputState, LevelState, LevelStateContext, LevelStateData } from "../hooks/UseLevel";
import { Tile } from "../Tile";
import { clone, wait } from "../Util";
import clsx from "clsx";
import { NO_TILT } from "../Main";
import { LevelComponentProps } from "../levels";
import useStore from "../hooks/UseStore";
import { Howl } from "howler";
import sfx_yippee from "../../sfx/yippee.wav";
import sfx_level_win from "../../sfx/level_win.wav";
import sfx_move from "../../sfx/move.wav"
import sfx_bump from "../../sfx/bump.wav"
import sfx_level_enter from "../../sfx/level_enter.wav"

let TILT_MAG = 0;
requestAnimationFrame(() => { TILT_MAG = NO_TILT ? 0 : 0.3 });;

type Props = {
	tilemap: number[][],
	children: ComponentChildren;
} & LevelComponentProps;

export function Level(props: Props) {
	const [ integrity, setIntegrity ] = useState<number>(0);
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);
	const isComplete = useStore<boolean>(false);

	const history = useMemo<Record<string, any>[][]>(() => [], []);
	useEffect(() => { 
		history.push(data.entities.map(ent => clone(ent.data))) 
		new Howl({ src: sfx_level_enter, html5: true, rate: Math.random() * 0.2 + 1, volume: 0.6 }).play();
	}, [])

	const data = useMemo<LevelStateData>(() => ({ 
		entities: [], 
		inputState: InputState.Input,
		tilemap: props.tilemap,
		numMoves: 0,
		usedUndo: false
	}), []);

	const writeUndoStep = useCallback(() => {
		data.numMoves++;
		history.push(data.entities.map(ent => clone(ent.data)));
	}, []);

	const undo = useCallback(() => {
		data.usedUndo = true;
		data.numMoves--;
		const currHist = history.pop();

		if (!currHist) {
			new Howl({ src: sfx_bump, html5: true, rate: Math.random() * 0.3 + 0.3, volume: 0.6 }).play();
			return
		};
		new Howl({ src: sfx_move, html5: true, rate: Math.random() * 0.3 + 0.3, volume: 0.6 }).play();

		currHist.map((newData, ind) => data.entities[ind].setData(clone(newData)));
		rerender();
	}, []);

	const restart = useCallback(() => {
		const currHist = history.at(0);
		if (currHist) {
			new Howl({ src: sfx_level_enter, html5: true, rate: Math.random() * 0.2 + 1, volume: 0.6 }).play();
			currHist.map((newData, ind) => data.entities[ind].setData(clone(newData)));
			history.splice(1, history.length - 1);
		}
		data.numMoves = 0;
		data.usedUndo = false;
		rerender();
	}, []);

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

	const quit = useCallback(() => {
		awaitFn(new Promise(() => {}));
		props.onQuit();
	}, []);

	const complete = useCallback(() => {
		awaitFn(new Promise(() => {}));
		new Howl({ src: sfx_yippee, html5: true, rate: 1.4, volume: 0.7 }).play();
		wait(400).then(() => new Howl({ src: sfx_level_win, html5: true, rate: 0.7, volume: 0.3 }).play());
				
		wait(150).then(() => isComplete(true));
		wait(1200).then(() => props.onComplete(data.numMoves, data.usedUndo));
	}, []);

	const levelState = useMemo<LevelState>(() => ({
		data,
		await: awaitFn,
		testCollision,
		testPush,
		getTile,
		getEntity,
		step,
		writeUndoStep,
		undo,
		quit,
		complete,
		restart
	}), []);

	const diffedLevelState = useMemo(() => ({ ...levelState }), [ integrity ]);


	const screenRef = useRef<HTMLDivElement>(null);
	const setTilt = useCallback(() => {
		const player = data.entities.find(e => e.props.name === "Player");
		const xTilt = (((player?.data.pos.x ?? 0) / data.tilemap[0].length * 2) - 1) * TILT_MAG;
		const yTilt = (((player?.data.pos.y ?? 0) / data.tilemap.length * 2) - 1) * TILT_MAG;
		screenRef.current!.style.transform = `rotateY(${-xTilt}deg) rotateX(${yTilt}deg)`;
	}, []);

	useEffect(() => {
		window.addEventListener('keydown', setTilt);
		setTilt();
		return () => window.removeEventListener('keydown', setTilt);
	}, [])

	return (
		<LevelStateContext.Provider value={diffedLevelState}>
			<div class={clsx("w-screen h-screen grid place-items-center transition bg-transparent duration-200 [perspective:200px]", isComplete() && "scale-125 !bg-green-700")}>
				<div ref={screenRef} class="will-change-transform isolate relative grid [&>*]:[grid-area:a] rounded-xl 
					overflow-hidden shadow-lg shadow-black/30 transition-all duration-300" style={{
					gridTemplateAreas: "a",
					width: 32 * data.tilemap[0].length * 3, 
					height: 32 * data.tilemap.length * 3,
				}}>
					{props.children}
				</div>
			</div>
		</LevelStateContext.Provider>
	);
}
