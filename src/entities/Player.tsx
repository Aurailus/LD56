import { h } from "preact"
import { useEntity } from "../hooks/UseEntity"
import { Vector2 } from "three";
import { useEffect } from "preact/hooks";
import { InputState, useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import { IS_DEBUG, IS_DVORAK } from "../Main";
import { Direction } from "../Direction";
import { directionFromOffset, rotateDirection } from "../Direction";

import img_player from "../../res/player.png";
import img_player_2 from "../../res/player_2.png";
import { pulseFrame, useAnimFrame } from "../hooks/UseAnimFrame";
import clsx from "clsx";
import { Howl } from "howler";

import sfx_move from "../../sfx/move.wav"
import sfx_bump from "../../sfx/bump.wav"

interface Props {
	pos: Vector2;
	direction: Direction;
}

export function Player(props: Props) {
	const frame = useAnimFrame();
	const level = useLevel();
	const ent = useEntity<{ direction: Direction }>(() => ({
		name: "Player",
		data: {
			direction: props.direction,
		},
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
			
			if (!e.repeat) {
				if ((e.key === "w" && !IS_DVORAK) || (e.key === "," && IS_DVORAK) || (e.key === "ArrowUp"))
					newPos.add(new Vector2(0, -1));
				else if ((e.key === "a" && !IS_DVORAK) || (e.key === "a" && IS_DVORAK) || (e.key === "ArrowLeft"))
					newPos.add(new Vector2(-1, 0));
				else if ((e.key === "s" && !IS_DVORAK) || (e.key === "o" && IS_DVORAK) || (e.key === "ArrowDown"))
					newPos.add(new Vector2(0, 1));
				else if ((e.key === "d" && !IS_DVORAK) || (e.key === "e" && IS_DVORAK) || (e.key === "ArrowRight"))
					newPos.add(new Vector2(1, 0));
			}

			if (level.data.inputState === InputState.Input) {
				if (newPos.clone().sub(ent.data.pos).lengthSq() !== 0) {
					level.writeUndoStep();
					ent.setData({ direction: directionFromOffset(newPos.clone().sub(ent.data.pos))! });
					// pulseFrame();
					level.data.inputState = InputState.Waiting;
					const collision = level.testCollision(newPos, ent)
					const push = level.testPush(newPos, ent)
					ent.bump(newPos);
					const promises: Promise<void>[] = [];
					if (collision.collides) promises.push(collision.entity?.props.onCollide(collision.entity!, ent) ?? Promise.resolve());
					promises.push(collision.entity?.props.onPush(collision.entity!, ent) ?? Promise.resolve());
					if (push.canPush || !collision.collides) {
						ent.setPos(newPos);
						new Howl({ src: sfx_move, html5: true, rate: Math.random() * 0.5 + 2, volume: 0.6 }).play();
					}
					else {
						new Howl({ src: sfx_bump, html5: true, rate: Math.random() * 0.3 + 0.3, volume: 0.6 }).play();
					}
					await Promise.all(promises);
					level.step();

				}
				else if (e.key === " ") {
					level.writeUndoStep();
					new Howl({ src: sfx_bump, html5: true, rate: Math.random() * 0.4 + 0.8, volume: 0.7 }).play();
					const upPos = ent.data.pos.clone().add(new Vector2(0, -1));
					ent.bump(upPos);
					level.step();
				}
				else if (e.key === "z" || (IS_DVORAK && e.key === ";")) {
					level.undo();
				}
				else if (e.key === "Escape") {
					level.quit();
				}
				else if (e.key === "r") {
					level.restart();
				}
				else if (e.key === "Enter" && IS_DEBUG) {
					level.complete();
				} 
			}
		}

		window.addEventListener("keydown", keyDown)
		return () => window.removeEventListener("keydown", keyDown)
	}, []);

	return (
		<div 
			ref={ent.ref}
			class="size-24 absolute transition-core duration-100 z-50"
			style={{
				translate: posToTranslate(ent.data.pos),
				rotate: `${rotateDirection(ent.data.direction) + 180}deg`
			}}
		>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", frame % 2 === 0 && "opacity-0")}
				style={{ backgroundImage: `url(${img_player})` }}/>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", frame % 2 === 1 && "opacity-0")}
				style={{ backgroundImage: `url(${img_player_2})` }}/>
		</div>
	)
} 
