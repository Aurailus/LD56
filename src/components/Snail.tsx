import { h } from "preact"
import { Vector2 } from "three";
import { Entity, useEntity } from "../hooks/UseEntity";

import img_snail from "../../res/snail.png"
import img_snail_hide from "../../res/snail_hide.png"

import { useMemo, useRef } from "preact/hooks";
import { useLevel } from "../hooks/UseLevel";

interface Props {
	pos: Vector2;
}

export function Snail(props: Props) {
	const level = useLevel();
	const ref = useRef<HTMLDivElement>(null);
	const uuid = useMemo(() => Math.floor(Math.random() * 1000), []);
	const ent = useEntity(() => ({
		name: "Snail",
		pos: props.pos,
		collides: () => true,
		onIntersect: (other: Entity) => {
			const posDiff = ent.data.pos.clone().sub(other.data.pos);
			const dstPos = ent.data.pos.clone();
			const initialPos = ent.data.pos.clone();
			console.log(uuid, "position diff", posDiff)
			while (true) {
				ent.data.pos = dstPos;
				const collision = level.collides(dstPos.clone().add(posDiff), ent);
				if (collision.blockMovement || collision.entity?.props.name === "Snail") break;
				dstPos.add(posDiff);
			}
			console.log(uuid, 'collided at ', dstPos);
			ent.data.pos = initialPos;
			const canMove = !dstPos.equals(initialPos);
			return {
				blockMovement: !canMove,
				entity: ent,
				onCollide: canMove ? async () => {
					ref.current!.style.background = `url(${img_snail_hide})`;
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
			class="size-8 bg-cover absolute transition-[translate] duration-100"
			style={{
				background: `url(${img_snail})`,
				translate: `${ent.data.pos.x * 32}px ${ent.data.pos.y * 32}px`
			}}
		>
		</div>
	)
}
