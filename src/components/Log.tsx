import { h } from "preact"
import { Vector2 } from "three";
import { Entity, useEntity } from "../hooks/UseEntity";

import img_log from "../../res/wood.png"

import { useRef } from "preact/hooks";
import { useLevel } from "../hooks/UseLevel";
import { bumpElem, posToTranslate, wait } from "../Util";

interface Props {
	pos: Vector2;
}

const ID = "Log";

export function Log(props: Props) {
	const level = useLevel();
	const ref = useRef<HTMLDivElement>(null);
	const ent = useEntity(() => ({
		name: ID,
		pos: props.pos,
		onIntersect: (_, other) => {
			const posDiff = ent.data.pos.clone().sub(other.data.pos);
			const canMove = !level.collides(ent.data.pos.clone().add(posDiff), ent).blockMovement;
			return {
				blockMovement: !canMove,
				entity: ent,
				onCollide: async () => {
					wait(40).then(() => bumpElem(ref.current!, posDiff));
					if (canMove) {
						let dstPos = ent.data.pos.clone().add(posDiff);
						const collision = level.collides(dstPos, ent);
						ent.setPos(dstPos);
						collision.onCollide();
						level.await(new Promise((res) => setTimeout(res, 90)));
					}
				}
			};
		},
		onStep: () => Promise.resolve(),
	}))

	return ent.data.dead ? null : (
		<div ref={ref}
			class="size-8 bg-cover absolute transition-[translate] duration-100 z-10"
			style={{
				background: `url(${img_log})`,
				translate: posToTranslate(ent.data.pos)
			}}
		>
		</div>
	)
}
