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
		canCollide: (ent) => !ent.data.submerged,
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
				level.await(new Promise((res) => setTimeout(res, 90)));
			}
		},
		onStep: async () => {
			if (level.getTile(ent.data.pos) === Tile.Water && level.getEntity(ent.data.pos, ent) === null) {
				ent.setData({ submerged: true });
			}
		}
	}))

	return ent.data.dead ? null : (
		<div ref={ent.ref}
			class="size-24 bg-cover absolute transition-core duration-100"
			style={{
				zIndex: ent.data.submerged ? 0 : 10,
				backgroundImage: ent.data.submerged 
					? frame % 2 === 0 ? `url(${img_snail_submerged_2})` : `url(${img_snail_submerged})`
					: hidden()
						? frame % 2 === 0 ? `url(${img_snail_hide_2})` : `url(${img_snail_hide})`
						: frame % 2 === 0 ? `url(${img_snail_2})` : `url(${img_snail})`,
				translate: posToTranslate(ent.data.pos),
				scale: `${ent.data.isLeft ? "-1" : "1"} 1`
			}}
		/>
	)
}
