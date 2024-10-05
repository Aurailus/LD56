import { h } from "preact"
import { Vector2 } from "three";
import { Entity, useEntity } from "../hooks/UseEntity";

import img_woodbug from "../../res/woodbug.png"
import img_woodbug_closed from "../../res/woodbug_closed.png"

import { useRef } from "preact/hooks";
import { useLevel } from "../hooks/UseLevel";
import { bumpElem, posToTranslate, wait } from "../Util";
import useStore from "../hooks/UseStore";

const ID = "Woodbug";

export enum Direction {
	Up = 1,
	Down,
	Left,
	Right
}

interface Props {
	pos: Vector2;
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

export function Woodbug(props: Props) {
	const level = useLevel();
	const direction = useStore<Direction | null>(props.direction)
	const ref = useRef<HTMLDivElement>(null);
	const ent = useEntity(() => ({
		name: ID,
		pos: props.pos,
		onIntersect: (_, other) => {
			const posDiff = ent.data.pos.clone().sub(other.data.pos).normalize();
			if (other.props.name === "Log" && directionFromOffset(posDiff.negate()) === direction()) {
				level.await(wait(200));
				bumpElem(ref.current, posDiff, 3);
				other.setPos(ent.data.pos.clone());
				wait(50).then(() => other.setDead(true));
			}
			else {
				wait(50).then(() => bumpElem(ref.current!, posDiff));
				if (other.props.name === "Player") {
					if (!direction()) direction(directionFromOffset(posDiff));
					else if (direction() === directionFromOffset(posDiff.negate())) direction(null);
				}
			}
			return {
				blockMovement: true,
				onCollide: () => Promise.resolve()
				// onCollide: canMove ? async () => {
				// 	ref.current!.style.background = `url(${img_woodbug_closed})`;
				// 	let dstPos = ent.data.pos.clone();
				// 	while (true) {
				// 		ent.data.pos = dstPos;
				// 		const collision = level.collides(dstPos.clone().add(posDiff), ent);
				// 		if (collision.blockMovement || collision.entity?.props.name === ID) break;
				// 		collision.onCollide();
				// 		dstPos.add(posDiff);
				// 	}
				// 	ent.setPos(dstPos);
				// 	level.await(new Promise((res) => setTimeout(res, 90)));
				// 	setTimeout(() => {
				// 		ref.current!.style.background = `url(${img_snail})`
				// 	}, 300);
				// 	setTimeout(() => level.collides(dstPos.clone().add(posDiff), ent).onCollide(), 80);
				// 	await new Promise((res) => setTimeout(res, 80));
				// } : async () => {
				// 	ref.current!.style.background = `url(${img_snail_hide})`;
				// 	setTimeout(() => {
				// 		ref.current!.style.background = `url(${img_snail})`
				// 	}, 160);
				// }
			};
		},
		onStep: () => Promise.resolve(),
	}))

	return (
		<div ref={ref}
			class="size-8 bg-cover absolute transition-[translate] duration-100 z-10"
			style={{
				background: `url(${direction() === null ? img_woodbug_closed : img_woodbug})`,
				translate: posToTranslate(ent.data.pos),
				rotate: direction() ? `${rotateDirection(direction()!)}deg` : ''
			}}
		>
		</div>
	)
}
