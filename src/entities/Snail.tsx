import { h } from "preact"
import { Vector2 } from "three";
import { useEntity } from "../hooks/UseEntity";

import img_snail from "../../res/snail.png"
import img_snail_2 from "../../res/snail_2.png"
import img_snail_submerged from "../../res/snail_submerged.png"
import img_snail_hide from "../../res/snail_hide.png"
import img_snail_hide_2 from "../../res/snail_hide_2.png"

import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import { Tile } from "../Tile";
import { useAnimFrame } from "../hooks/UseAnimFrame";
import useStore from "../hooks/UseStore";

interface Props {
	pos: Vector2;
}

const ID = "Snail";

const TILES_BEFORE_SUBMERGE = 1;

export function Snail(props: Props) {
	const frame = useAnimFrame(ID);
	const level = useLevel();
	const hiding = useStore<boolean>(false);
	const ent = useEntity<{
		submerged: boolean,
		waterTimer: number
	}>(() => ({
		name: ID,
		data: {
			submerged: false,
			waterTimer: 0
		},
		pos: props.pos,
		canPush: (ent, other) =>
			!level.testCollision(ent.data.pos.clone().add(ent.data.pos.clone().sub(other.data.pos)), ent).collides && 
			other.props.name !== "Player" &&
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
				hiding(true);
				let dstPos = ent.data.pos.clone();
				while (true) {
					ent.data.pos = dstPos;
					const testPos = dstPos.clone().add(posDiff);
					const collision = level.testCollision(testPos, ent);
					const push = level.testPush(testPos, ent);
					if (push.canPush) {
						const pushFromPos = dstPos;
						setTimeout(() => {
							const oldPos = ent.data.pos;
							ent.data.pos = pushFromPos;
							level.await(collision.entity?.props.onCollide(push.entity!, ent) ?? Promise.resolve());
							level.await(push.entity?.props.onPush(push.entity!, ent) ?? Promise.resolve());
							ent.data.pos = oldPos;
						}, 30)
						dstPos = testPos;
						break;
					}
					else if (collision.collides) {
						collision.entity?.props.onCollide(push.entity!, ent);
						break;
					}
					if (level.getTile(ent.data.pos) === Tile.Water && level.getEntity(ent.data.pos, ent) === null) {
						if (ent.data.waterTimer >= TILES_BEFORE_SUBMERGE) {
							level.await(wait(300));
							break;
						}
						else ent.setData({ waterTimer: ent.data.waterTimer + 1 });
					}
					dstPos = testPos;
				}
				ent.setPos(dstPos);
				level.await(new Promise((res) => setTimeout(res, 90)));
				setTimeout(() => hiding(false), 300);
				await new Promise((res) => setTimeout(res, 80));
			}
		},
		onStep: async () => {
			if (level.getTile(ent.data.pos) === Tile.Water && level.getEntity(ent.data.pos, ent) === null) {
				ent.setData({ submerged: true });
			}
		}
	}))

	return (
		<div ref={ent.ref}
			class="size-24 bg-cover absolute transition-core duration-100 z-10"
			style={{
				backgroundImage: 
					ent.data.submerged 
					? `url(${img_snail_submerged})` 
					: hiding()
						? (frame % 2 === 0) ? `url(${img_snail_hide_2})` : `url(${img_snail_hide})`
						: (frame % 2 === 0) ? `url(${img_snail_2})` : `url(${img_snail})`,
				translate: posToTranslate(ent.data.pos)
			}}
		>
		</div>
	)
}
