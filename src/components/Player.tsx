import { h } from "preact"
import { useEntity } from "../hooks/UseEntity"
import { Vector2 } from "three";

import img_player from "../../res/player.png";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { useGameState } from "../hooks/UseGameState";
import { State } from "../contexts/GameState";

interface Props {
	pos: Vector2;
}

const dvorak = true;

export function Player(props: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const state = useGameState();
	const entity = useEntity(() => ({
		name: "Player",
		pos: props.pos,
		collides: () => true,
		onIntersect: () => [ true, () => Promise.resolve() ],
		onStep: () => new Promise<void>(res => setTimeout(res, 100))
	}));

	const bump = useCallback((to: Vector2) => {
		const bumpStr = `${(entity.pos.x + (to.x - entity.pos.x) / 8) * 32}px ${(entity.pos.y + (to.y - entity.pos.y) / 8) * 32}px`;
		ref.current!.style.translate = bumpStr; 
		setTimeout(() => {
			if (ref.current!.style.translate !== bumpStr) return;
			ref.current!.style.translate = `${entity.pos.x * 32}px ${entity.pos.y * 32}px`;
		}, 50);
	}, [ entity.pos ])

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			const newPos = entity.pos.clone();
			if ((e.key === "w" && !dvorak) || (e.key === "," && dvorak) || (e.key === "ArrowUp"))
				newPos.add(new Vector2(0, -1));
			else if ((e.key === "a" && !dvorak) || (e.key === "a" && dvorak) || (e.key === "ArrowLeft"))
				newPos.add(new Vector2(-1, 0));
			else if ((e.key === "s" && !dvorak) || (e.key === "o" && dvorak) || (e.key === "ArrowDown"))
				newPos.add(new Vector2(0, 1));
			else if ((e.key === "d" && !dvorak) || (e.key === "e" && dvorak) || (e.key === "ArrowRight"))
				newPos.add(new Vector2(1, 0));
			
			if (newPos.lengthSq() !== 0 && state.state === State.Input) {
				const [stopsMovement, cb] = state.collides(newPos, entity)
				bump(newPos);
				cb().then(() => {
					if (!stopsMovement) {
						entity.setPos(newPos);
						state.stepGame();
					}
				})
			}
		}

		window.addEventListener("keydown", keyDown)
		return () => window.removeEventListener("keydown", keyDown)
	}, [ state, bump ]);

	return (
		<div 
			ref={ref}
			class="size-8 bg-cover absolute transition-all duration-100"
			style={{
				background: `url(${img_player})`,
				translate: `${entity.pos.x * 32}px ${entity.pos.y * 32}px`
			}}
		>
		</div>
	)
} 
