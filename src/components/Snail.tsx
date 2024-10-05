import { h } from "preact"
import { Vector2 } from "three";
import { AnyEntity, useEntity } from "../hooks/UseEntity";

import img_snail from "../../res/snail.png"
import img_snail_submerged from "../../res/snail_submerged.png"
import img_snail_hide from "../../res/snail_hide.png"

import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import useStore from "../hooks/UseStore";
import { Tile } from "../Tile";

interface Props {
	pos: Vector2;
}

const ID = "Snail";

const TILES_BEFORE_SUBMERGE = 1;

export function Snail(props: Props) {
	
	const level = useLevel();
	const submerged = useStore<boolean>(false);
	const waterTimer = useStore<number>(0);

	const ent = useEntity<{}>(() => ({
		name: ID,
		data: {},
		pos: props.pos,
		canPush: (ent, other) =>
			!level.testCollision(ent.data.pos.clone().add(ent.data.pos.clone().sub(other.data.pos)), ent).collides && 
			other.props.name !== "Player" &&
			!submerged(),
		canCollide: () => !submerged(),
		onPush: async (_, other) => {
			if (submerged()) return;
			const posDiff = ent.data.pos.clone().sub(other.data.pos);
			let dstPos = ent.data.pos.clone().add(posDiff);
			const collides = level.testCollision(dstPos, ent);
			if (collides.collides) {
				collides.entity?.props.onCollide(collides.entity!, ent);
				wait(40).then(() => ent.bump(dstPos));
			}
			else {
				ent.ref.current!.style.background = `url(${img_snail_hide})`;
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
						if (waterTimer() >= TILES_BEFORE_SUBMERGE) {
							level.await(wait(300));
							break;
						}
						else waterTimer(w => w + 1);
					}
					dstPos = testPos;
				}
				ent.setPos(dstPos);
				level.await(new Promise((res) => setTimeout(res, 90)));
				setTimeout(() => {
					if (!submerged()) ent.ref.current!.style.background = `url(${img_snail})`
				}, 300);
				await new Promise((res) => setTimeout(res, 80));
			}
		},
		onStep: async () => {
			if (level.getTile(ent.data.pos) === Tile.Water && level.getEntity(ent.data.pos, ent) === null) {
				submerged(true);
			}
		}
	}))

	return (
		<div ref={ent.ref}
			class="size-8 bg-cover absolute transition-[translate] duration-100 z-10"
			style={{
				background: submerged() ? `url(${img_snail_submerged})` : `url(${img_snail})`,
				translate: posToTranslate(ent.data.pos)
			}}
		>
		</div>
	)
}
