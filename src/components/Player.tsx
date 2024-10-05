import { h } from "preact"
import { useEntity } from "../hooks/UseEntity"
import { Vector2 } from "three";

import img_player from "../../res/player.png";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { InputState, useLevel } from "../hooks/UseLevel";
import { bumpElem, posToTranslate, translateToPos } from "../Util";

interface Props {
	pos: Vector2;
}

const dvorak = true;


export function Player(props: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const state = useLevel();
	const ent = useEntity(() => ({
		name: "Player",
		pos: props.pos,
		onIntersect: () => ({ blockMovement: true, entity: ent, onCollide: () => Promise.resolve() }),
		onStep: () => new Promise<void>(res => setTimeout(res, 100))
	}));

	useEffect(() => {
		const keyDown = (e: KeyboardEvent) => {
			const newPos = ent.data.pos.clone();
			if ((e.key === "w" && !dvorak) || (e.key === "," && dvorak) || (e.key === "ArrowUp"))
				newPos.add(new Vector2(0, -1));
			else if ((e.key === "a" && !dvorak) || (e.key === "a" && dvorak) || (e.key === "ArrowLeft"))
				newPos.add(new Vector2(-1, 0));
			else if ((e.key === "s" && !dvorak) || (e.key === "o" && dvorak) || (e.key === "ArrowDown"))
				newPos.add(new Vector2(0, 1));
			else if ((e.key === "d" && !dvorak) || (e.key === "e" && dvorak) || (e.key === "ArrowRight"))
				newPos.add(new Vector2(1, 0));

			if (state.data.inputState === InputState.Input) {
				if (newPos.clone().sub(ent.data.pos).lengthSq() !== 0) {
					const collision = state.collides(newPos, ent)
					bumpElem(ref.current!, newPos.clone().sub(ent.data.pos));
					collision.onCollide().then(() => {
						if (!collision.blockMovement) ent.setPos(newPos);
						state.step();
					})
				}
				else if (e.key === " ") {
					state.step();
				}

			}
		}

		window.addEventListener("keydown", keyDown)
		return () => window.removeEventListener("keydown", keyDown)
	}, []);

	return (
		<div 
			ref={ref}
			class="size-8 bg-cover absolute transition-all duration-100 z-50"
			style={{
				background: `url(${img_player})`,
				translate: posToTranslate(ent.data.pos)
			}}
		>
		</div>
	)
} 
