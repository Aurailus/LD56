import { Fragment, h } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { Entity } from "../entities/Entity";
import { Vector2 } from "three";
import { Player } from "../entities/Player";

// A VERY SIMPLE tile-map which represents the static terrain
// A list of entities which can exist within the grid
// Entities need to have some sort of behavior for when a creature enters its space
// Player has to be controlled with WASD
// UNDO would be nice

enum State {
	Input,
	Response
}

const MIN_MOVE_INTERVAL = 150;
const MIN_INPUT_TIMEOUT = 80;

interface Props {
	entities: () => Entity[],
	tilemap: number[][],
	background: string
	startPos: Vector2
}

let dvorak = true;

export function Level(props: Props) {
	const [ , setIntegrity ] = useState<number>(0);

	const player = useMemo(() => new Player(props.startPos), [])
	const [ entities, setEntities ] = useState<Entity[]>(() => [ ...props.entities(), player ])
	const [ tilemap, setTilemap ] = useState<number[][]>(props.tilemap)
	
	const rerender = useCallback(() => setIntegrity(i => i + 1), []);

	useEffect(() => {
		let movementDirection = new Vector2();
		let lastMovementKey: string = "";
		let state: State = State.Input;
		// setInterval(() => {
		// 	entities.forEach(e => e.onStep());
		// 	rerender();
		// }, 1000);

		const animCallback = () => {
			if (state === State.Input && movementDirection.lengthSq() !== 0) {
				const newPos = player.pos.clone().add(movementDirection);
				if (tilemap[newPos.y][newPos.x] !== 0) {
					player.bump(newPos);
				}
				else {
					player.pos = newPos;
					setTimeout(() => {
						movementDirection = new Vector2()
					}, MIN_INPUT_TIMEOUT);
					state = State.Response;
					Promise.all([
						...entities.map(e => e.onStep()),
						new Promise<void>(res => setTimeout(() => res(), MIN_MOVE_INTERVAL))
					]).then(() => {
						state = State.Input;
					})
					rerender();
				}


			}
			requestAnimationFrame(animCallback);
		}
		animCallback();

		const keyDownCallback = (e: KeyboardEvent) => {
			if ((e.key === "w" && !dvorak) || (e.key === "," && dvorak) || (e.key === "ArrowUp")) {
				movementDirection = new Vector2(0, -1);
				lastMovementKey = e.key;
			}
			else if ((e.key === "a" && !dvorak) || (e.key === "a" && dvorak) || (e.key === "ArrowLeft")) {
				movementDirection = new Vector2(-1, 0);
				lastMovementKey = e.key;
			}
			else if ((e.key === "s" && !dvorak) || (e.key === "o" && dvorak) || (e.key === "ArrowDown")) {
				movementDirection = new Vector2(0, 1);
				lastMovementKey = e.key;
			}
			else if ((e.key === "d" && !dvorak) || (e.key === "e" && dvorak) || (e.key === "ArrowRight")) {
				movementDirection = new Vector2(1, 0);
				lastMovementKey = e.key;
			}
		}

		const keyUpCallback = (e: KeyboardEvent) => {
			// if (e.key === lastMovementKey) {
			// 	movementDirection = new Vector2();
			// }
		}

		window.addEventListener('keydown', keyDownCallback);
		window.addEventListener('keyup', keyUpCallback);

		return () => {
			window.removeEventListener('keydown', keyDownCallback);
			window.removeEventListener('keyup', keyUpCallback);
		}

	}, [])
	return (
		<div 
			class="bg-cover" 
			style={{ 
				transform: `scale(3)`,
				backgroundImage: `url(${props.background})`, 
				width: 32 * tilemap[0].length, 
				height: 32 * tilemap.length
			}}
		>
			{entities.map((e, i) => <Fragment key={i}>{e.render()}</Fragment>)}
		</div>
	);
}
