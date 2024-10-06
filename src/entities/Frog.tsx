import { h } from "preact"
import { Vector2 } from "three";
import { useEntity } from "../hooks/UseEntity";
import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import { Direction, directionFromOffset, offsetFromDirection, rotateDirection } from "../Direction";

import img_frog from "../../res/frog.png"
import img_frog_2 from "../../res/frog_2.png"
import img_frog_sleep from "../../res/frog_sleep.png"
import img_frog_sleep_2 from "../../res/frog_sleep_2.png"
import { useAnimFrame } from "../hooks/UseAnimFrame";
import clsx from "clsx";
import { Howl } from "howler"
import sfx_frog_eat from "../../sfx/frog_eat.wav"
import sfx_frog_wake_up from "../../sfx/frog_wake_up.wav"

const ID = "Frog";

interface Props {
	pos: Vector2;
	agro?: boolean;
	direction: Direction | null;
}


export function Frog(props: Props) {
	const level = useLevel();
	const frame = useAnimFrame("frog");
	const ent = useEntity<{ direction: Direction | null }>(() => ({
		name: ID,
		data: { 
			direction: props.direction 
		},
		pos: props.pos,
		canPush: () => false,
		canCollide: () => true,
		onCollide: async (_, other) => {
			const posDiff = ent.data.pos.clone().sub(other.data.pos).normalize();
			if (other.props.name === "Snail" && directionFromOffset(posDiff.clone().negate()) === ent.data.direction) {
				level.await(wait(200));
				ent.bump(other.data.pos, 3);
				other.setPos(ent.data.pos.clone());
				new Howl({ src: sfx_frog_eat, html5: true, rate: Math.random() * 0.3 + 1, volume: 0.6 }).play();
				wait(50).then(() => other.setDead(true));
			}
			else {
				const otherPos = other.data.pos;
				wait(50).then(() => ent.bump(otherPos, -1));
				wait(100).then(() => new Howl({ src: sfx_frog_wake_up, html5: true, rate: Math.random() * 0.3 + 1, volume: 0.9 }).play());
				if (!ent.data.direction) ent.setData({ direction: directionFromOffset(posDiff) });
				// else if (ent.data.direction === directionFromOffset(posDiff.negate())) ent.setData({ direction: null });
			}
		},
		onStep: async () => {
			if (ent.data.direction && props.agro) {
				const testPos = ent.data.pos.clone().add(offsetFromDirection(ent.data.direction));
				const collides = level.testCollision(testPos, ent);
				if (collides.entity?.props.name === "Snail") {
					await wait(300);
					level.await(wait(200));
					ent.bump(collides.entity.data.pos, 3);
					collides.entity.setPos(ent.data.pos.clone());
					new Howl({ src: sfx_frog_eat, html5: true, rate: Math.random() * 0.3 + 1, volume: 0.9 }).play();
					wait(50).then(() => collides.entity!.setDead(true));
				}
			}
		}
	}))

	return (
		// <div ref={ent.ref}
		// 	class="size-24 bg-cover absolute transition-[translate] duration-100 z-10"
		// 	style={{
		// 		backgroundImage: `url(${ent.data.direction === null ? img_frog_asleep : img_frog})`,
		// 		translate: posToTranslate(ent.data.pos),
		// 		rotate: ent.data.direction ? `${rotateDirection(ent.data.direction)}deg` : '',
		// 	}}
		// >
		// </div>
		<div 
			ref={ent.ref}
			class="size-24 absolute transition-core duration-100 z-10"
			style={{
				translate: posToTranslate(ent.data.pos),
				rotate: ent.data.direction ? `${rotateDirection(ent.data.direction)}deg` : '',
			}}
		>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (Math.floor(frame / 3) % 2 === 0 || ent.data.direction !== null) && "opacity-0")}
				style={{ backgroundImage: `url(${img_frog_sleep})` }}/>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (Math.floor(frame / 3) % 2 === 1 || ent.data.direction !== null) && "opacity-0")}
				style={{ backgroundImage: `url(${img_frog_sleep_2})` }}/>

			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (frame % 2 === 0 || ent.data.direction === null) && "opacity-0")}
				style={{ backgroundImage: `url(${img_frog})` }}/>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (frame % 2 === 1 || ent.data.direction === null) && "opacity-0")}
				style={{ backgroundImage: `url(${img_frog_2})` }}/>
		</div>
	)
}
