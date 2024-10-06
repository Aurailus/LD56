import { h } from "preact"
import { Vector2 } from "three";
import { useEntity } from "../hooks/UseEntity";

import img_snail from "../../res/snail.png"
import img_snail_2 from "../../res/snail_2.png"
import img_snail_hide from "../../res/snail_hide.png"
import img_snail_hide_2 from "../../res/snail_hide_2.png"
import img_snail_submerged from "../../res/snail_submerged.png"
import img_snail_submerged_2 from "../../res/snail_submerged_2.png"

import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import { Tile } from "../Tile";
import { useAnimFrame } from "../hooks/UseAnimFrame";
import { useUniqueCounter } from "../hooks/UseUniqueCounter";
import useStore from "../hooks/UseStore";
import { useRef } from "preact/hooks";
import clsx from "clsx";
import { Howl } from "howler"

import sfx_push from "../../sfx/push.wav"
import sfx_splash from "../../sfx/splash.wav"

interface Props {
	pos: Vector2;
}

const ID = "Snail";

export function Snail(props: Props) {	
	const dirCounter = useUniqueCounter("direction");
	const frame = useAnimFrame(ID);
	const level = useLevel();
	const hidden = useStore(false);
	const hiddenTimeout = useRef<number>(0);
	const ent = useEntity<{ submerged: boolean, isLeft: boolean }>(() => ({
		name: ID,
		data: { 
			submerged: false,
			isLeft: dirCounter % 2 === 0
		},
		pos: props.pos,
		canPush: (ent, other) =>
			!level.testCollision(ent.data.pos.clone().add(ent.data.pos.clone().sub(other.data.pos)), ent).collides &&
			!ent.data.submerged,
		canCollide: (ent, other) => {
			if (ent.data.submerged && other.props.name === "Player") {
				new Howl({ src: sfx_splash, html5: true, rate: Math.random() * 0.3 + 1.8, volume: 0.3 }).play();
			}
			return !ent.data.submerged
		},
		onPush: async (_, other) => {
			if (ent.data.submerged) return;
			const posDiff = ent.data.pos.clone().sub(other.data.pos);
			if (posDiff.x < 0) ent.setData({ isLeft: true });
			if (posDiff.x > 0) ent.setData({ isLeft: false });
			hidden(true);
			clearTimeout(hiddenTimeout.current);
			hiddenTimeout.current = setTimeout(() => hidden(false), 200) as any as number;
			let dstPos = ent.data.pos.clone().add(posDiff);
			const collides = level.testCollision(dstPos, ent);
			if (collides.collides) {
				collides.entity?.props.onCollide(collides.entity!, ent);
				wait(40).then(() => ent.bump(dstPos));
			}
			else {
				ent.setPos(dstPos);
				new Howl({ src: sfx_push, html5: true, rate: Math.random() * 0.5 + 0.75, volume: 0.6 }).play();
				level.await(new Promise((res) => setTimeout(res, 90)));
			}
		},
		onStep: async () => {
			if (!ent.data.submerged && level.getTile(ent.data.pos) === Tile.Water && level.getEntity(ent.data.pos, ent) === null) {
				ent.setData({ submerged: true });
				new Howl({ src: sfx_splash, html5: true, rate: Math.random() * 0.3 + 0.85, volume: 0.6 }).play();
			}
		}
	}))
	return ent.data.dead ? null : (
		<div 
			ref={ent.ref}
			class="size-24 absolute transition-core duration-100"
			style={{
				zIndex: ent.data.submerged ? 0 : 10,
				translate: posToTranslate(ent.data.pos),
				scale: `${ent.data.isLeft ? "-1" : "1"} 1`
			}}
		>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (frame % 2 === 0 || !ent.data.submerged) && "opacity-0")}
				style={{ backgroundImage: `url(${img_snail_submerged})` }}/>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (frame % 2 === 1 || !ent.data.submerged) && "opacity-0")}
				style={{ backgroundImage: `url(${img_snail_submerged_2})` }}/>

			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (frame % 2 === 0 || ent.data.submerged || hidden()) && "opacity-0")}
				style={{ backgroundImage: `url(${img_snail_2})` }}/>
			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (frame % 2 === 1 || ent.data.submerged || hidden()) && "opacity-0")}
				style={{ backgroundImage: `url(${img_snail})` }}/>

			<div class={clsx("w-full h-full inset-0 absolute bg-cover", (ent.data.submerged || !hidden()) && "opacity-0")}
				style={{ backgroundImage: `url(${img_snail_hide})` }}/>
		</div>
	)
}
