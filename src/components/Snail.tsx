import { h } from "preact"
import { Vector2 } from "three";
import { Entity, useEntity } from "../hooks/UseEntity";

import img_snail from "../../res/snail.png"
import img_snail_hide from "../../res/snail_hide.png"

import { useRef } from "preact/hooks";
import { useLevel } from "../hooks/UseLevel";
import { posToTranslate } from "../Util";

interface Props {
	pos: Vector2;
}

const ID = "Snail";

export function Snail(props: Props) {
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
				onCollide: canMove ? async () => {
					ref.current!.style.background = `url(${img_snail_hide})`;
					let dstPos = ent.data.pos.clone();
					while (true) {
						ent.data.pos = dstPos;
						const collision = level.collides(dstPos.clone().add(posDiff), ent);
						if (collision.blockMovement || collision.entity?.props.name === ID) break;
						collision.onCollide();
						dstPos.add(posDiff);
					}
					ent.setPos(dstPos);
					level.await(new Promise((res) => setTimeout(res, 90)));
					setTimeout(() => {
						ref.current!.style.background = `url(${img_snail})`
					}, 300);
					setTimeout(() => level.collides(dstPos.clone().add(posDiff), ent).onCollide(), 80);
					await new Promise((res) => setTimeout(res, 80));
				} : async () => {
					ref.current!.style.background = `url(${img_snail_hide})`;
					setTimeout(() => {
						ref.current!.style.background = `url(${img_snail})`
					}, 160);
				}
			};
		},
		onStep: () => Promise.resolve(),
	}))

	return (
		<div ref={ref}
			class="size-8 bg-cover absolute transition-[translate] duration-100 z-10"
			style={{
				background: `url(${img_snail})`,
				translate: posToTranslate(ent.data.pos)
			}}
		>
		</div>
	)
}
