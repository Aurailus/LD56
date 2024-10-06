import { h } from "preact"
import { Vector2 } from "three";
import { useEntity } from "../hooks/UseEntity";

import img_log from "../../res/wood.png"
import img_log_submerged from "../../res/wood_submerged.png"

import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import { Tile } from "../Tile";

interface Props {
	pos: Vector2;
}

const ID = "Log";

export function Log(props: Props) {	
	const level = useLevel();
	const ent = useEntity<{ submerged: boolean }>(() => ({
		name: ID,
		data: { 
			submerged: false 
		},
		pos: props.pos,
		canPush: (ent, other) =>
			!level.testCollision(ent.data.pos.clone().add(ent.data.pos.clone().sub(other.data.pos)), ent).collides &&
			!ent.data.submerged,
		canCollide: (ent) => !ent.data.submerged,
		onPush: async (_, other) => {
			if (ent.data.submerged) return;
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
		onStep: async () => {
			if (level.getTile(ent.data.pos) === Tile.Water && level.getEntity(ent.data.pos, ent) === null) {
				ent.setData({ submerged: true });
			}
		}
	}))

	return ent.data.dead ? null : (
		<div ref={ent.ref}
			class="size-24 bg-cover absolute transition-[translate] duration-100"
			style={{
				zIndex: ent.data.submerged ? 0 : 10,
				backgroundImage: ent.data.submerged ? `url(${img_log_submerged})` : `url(${img_log})`,
				translate: posToTranslate(ent.data.pos)
			}}
		/>
	)
}
