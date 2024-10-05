import { h } from "preact"
import { useEntity } from "../hooks/UseEntity"
import { Vector2 } from "three";

import img_player from "../../res/player.png";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { InputState, useLevel } from "../hooks/UseLevel";
import { bumpElem, posToTranslate, translateToPos, wait } from "../Util";

interface Props {
	pos: Vector2;
}

const dvorak = true;


export function Player(props: Props) {
	const level = useLevel();
	const ent = useEntity(() => ({
		name: "Player",
		data: {},
		pos: props.pos,
		canPush: (ent, other) => 
			!level.testCollision(ent.data.pos.clone().add(ent.data.pos.clone().sub(other.data.pos)), ent).collides,
		onPush: async (_, other) => {
			const posDiff = ent.data.pos.clone().sub(other.data.pos);
			let dstPos = ent.data.pos.clone().add(posDiff);
			const collides = level.testCollision(dstPos, ent);
			if (collides.collides) {
				collides.entity?.props.onCollide(collides.entity!, ent);
				wait(40).then(() => ent.bump(dstPos));
			}
			else {
				ent.setPos(dstPos);
				level.await(new Promise((res) => setTimeout(res, 90)));
			}
		},
		onStep: () => new Promise<void>(res => setTimeout(res, 100))
	}));

	useEffect(() => {
		const keyDown = async (e: KeyboardEvent) => {
			const newPos = ent.data.pos.clone();
			if ((e.key === "w" && !dvorak) || (e.key === "," && dvorak) || (e.key === "ArrowUp"))
				newPos.add(new Vector2(0, -1));
			else if ((e.key === "a" && !dvorak) || (e.key === "a" && dvorak) || (e.key === "ArrowLeft"))
				newPos.add(new Vector2(-1, 0));
			else if ((e.key === "s" && !dvorak) || (e.key === "o" && dvorak) || (e.key === "ArrowDown"))
				newPos.add(new Vector2(0, 1));
			else if ((e.key === "d" && !dvorak) || (e.key === "e" && dvorak) || (e.key === "ArrowRight"))
				newPos.add(new Vector2(1, 0));

			if (level.data.inputState === InputState.Input) {
				if (newPos.clone().sub(ent.data.pos).lengthSq() !== 0) {
					level.data.inputState = InputState.Waiting;
					const collision = level.testCollision(newPos, ent)
					const push = level.testPush(newPos, ent)
					ent.bump(newPos);
					const promises: Promise<void>[] = [];
					if (collision.collides) promises.push(collision.entity?.props.onCollide(collision.entity!, ent) ?? Promise.resolve());
					promises.push(collision.entity?.props.onPush(collision.entity!, ent) ?? Promise.resolve());
					if (push.canPush || !collision.collides) ent.setPos(newPos);
					await Promise.all(promises);
					level.step();
				}
				else if (e.key === " ") {
					level.step();
				}
			}
		}

		window.addEventListener("keydown", keyDown)
		return () => window.removeEventListener("keydown", keyDown)
	}, []);

	return (
		<div 
			ref={ent.ref}
			class="size-8 bg-cover absolute transition-all duration-100 z-50"
			style={{
				background: `url(${img_player})`,
				translate: posToTranslate(ent.data.pos)
			}}
		>
		</div>
	)
} 
