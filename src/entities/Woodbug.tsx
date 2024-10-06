import { h } from "preact"
import { Vector2 } from "three";
import { useEntity } from "../hooks/UseEntity";
import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import { Direction, directionFromOffset, offsetFromDirection, rotateDirection } from "../Direction";

import img_woodbug from "../../res/woodbug.png"
import img_woodbug_closed from "../../res/woodbug_closed.png"

const ID = "Woodbug";


interface Props {
	pos: Vector2;
	agro?: boolean;
	direction: Direction | null;
}


export function Woodbug(props: Props) {
	const level = useLevel();
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
			if (other.props.name === "Log" && directionFromOffset(posDiff.clone().negate()) === ent.data.direction) {
				level.await(wait(200));
				ent.bump(other.data.pos, 3);
				other.setPos(ent.data.pos.clone());
				wait(50).then(() => other.setDead(true));
			}
			else {
				const otherPos = other.data.pos;
				wait(50).then(() => ent.bump(otherPos, -1));
				if (!ent.data.direction) ent.setData({ direction: directionFromOffset(posDiff) });
				else if (ent.data.direction === directionFromOffset(posDiff.negate())) ent.setData({ direction: null });
			}
		},
		onStep: async () => {
			if (ent.data.direction && props.agro) {
				const testPos = ent.data.pos.clone().add(offsetFromDirection(ent.data.direction));
				const collides = level.testCollision(testPos, ent);
				if (collides.entity?.props.name === "Log") {
					await wait(300);
					level.await(wait(200));
					ent.bump(collides.entity.data.pos, 3);
					collides.entity.setPos(ent.data.pos.clone());
					wait(50).then(() => collides.entity!.setDead(true));
				}
			}
		}
	}))

	return (
		<div ref={ent.ref}
			class="size-24 bg-cover absolute transition-[translate] duration-100 z-10"
			style={{
				backgroundImage: `url(${ent.data.direction === null ? img_woodbug_closed : img_woodbug})`,
				translate: posToTranslate(ent.data.pos),
				rotate: ent.data.direction ? `${rotateDirection(ent.data.direction)}deg` : '',
				filter: props.agro ? `sepia(100%) saturate(300%) hue-rotate(-45deg)` : ''
			}}
		>
		</div>
	)
}
