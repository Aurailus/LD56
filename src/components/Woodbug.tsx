import { h } from "preact"
import { Vector2 } from "three";
import { useEntity } from "../hooks/UseEntity";
import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";
import useStore from "../hooks/UseStore";

import img_woodbug from "../../res/woodbug.png"
import img_woodbug_closed from "../../res/woodbug_closed.png"

const ID = "Woodbug";

export enum Direction {
	Up = 1,
	Down,
	Left,
	Right
}

interface Props {
	pos: Vector2;
	agro?: boolean;
	direction: Direction | null;
}

const rotateDirection = (dir: Direction) => {
	switch (dir) {
		case Direction.Up: return 180;
		case Direction.Down: return 0;
		case Direction.Right: return 270;
		case Direction.Left: return 90;
	}
}

const directionFromOffset = (offset: Vector2) => {
	if (offset.x < 0) return Direction.Left;
	else if (offset.x > 0) return Direction.Right;
	else if (offset.y < 0) return Direction.Up;
	else if (offset.y > 0) return Direction.Down;
	return null;
}
const offsetFromDirection = (dir: Direction) => {
	switch (dir) {
		case Direction.Up: return new Vector2(0, -1);
		case Direction.Down: return new Vector2(0, 1);
		case Direction.Right: return new Vector2(1, 0);
		case Direction.Left: return new Vector2(-1, 0);
	}
}

export function Woodbug(props: Props) {
	const level = useLevel();
	const direction = useStore<Direction | null>(props.direction)
	const ent = useEntity(() => ({
		name: ID,
		data: {},
		pos: props.pos,
		canPush: () => false,
		canCollide: () => true,
		onCollide: async (_, other) => {
			const posDiff = ent.data.pos.clone().sub(other.data.pos).normalize();
			if (other.props.name === "Log" && directionFromOffset(posDiff.clone().negate()) === direction()) {
				level.await(wait(200));
				ent.bump(other.data.pos, 3);
				other.setPos(ent.data.pos.clone());
				wait(50).then(() => other.setDead(true));
			}
			else {
				const otherPos = other.data.pos;
				wait(50).then(() => ent.bump(otherPos, -1));
				if (!direction()) direction(directionFromOffset(posDiff));
				else if (direction() === directionFromOffset(posDiff.negate())) direction(null);
			}
		},
		onStep: async () => {
			if (direction() && props.agro) {
				const testPos = ent.data.pos.clone().add(offsetFromDirection(direction()!));
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
			class="size-8 bg-cover absolute transition-[translate] duration-100 z-10"
			style={{
				background: `url(${direction() === null ? img_woodbug_closed : img_woodbug})`,
				translate: posToTranslate(ent.data.pos),
				rotate: direction() ? `${rotateDirection(direction()!)}deg` : '',
				filter: props.agro ? `sepia(100%) saturate(300%) hue-rotate(-45deg)` : ''
			}}
		>
		</div>
	)
}
