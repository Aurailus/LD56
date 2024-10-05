import { h } from "preact"
import { Vector2 } from "three";
import { CollisionResult, EntityInstance, useEntity } from "../hooks/UseEntity";

import img_snail from "../../res/snail.png"
import img_snail_hide from "../../res/snail_hide.png"

import { useRef } from "preact/hooks";
import { useGameState } from "../hooks/UseGameState";

interface Props {
	pos: Vector2;
}

export function Snail(props: Props) {
	const state = useGameState();
	const ref = useRef<HTMLDivElement>(null);
	
	const entity = useEntity(() => ({
		name: "Snail",
		pos: props.pos,
		collides: () => true,
		onIntersect: (other: EntityInstance) => {
			const ogPos = entity.current().pos.clone();
			const posDiff = ogPos.clone().sub(other.current().pos);
			const dstPos = entity.current().pos.clone();
			console.log("position diff", other.current().pos, ogPos, posDiff)
			while (true) {
				console.log("checking position at", dstPos, "snail pos: ", entity.current().pos)
				entity.setPos(dstPos);
				if (state.current().collides(dstPos.clone().add(posDiff), entity.current())[0]) break;
				dstPos.add(posDiff);
			}
			entity.setPos(ogPos);

			if (dstPos.equals(entity.current().pos)) return [ true, async () => {
				ref.current!.style.background = `url(${img_snail_hide})`;
				entity.setPos(dstPos);
				setTimeout(() => {
					ref.current!.style.background = `url(${img_snail})`
				}, 160);
			} ];

			return [ false, async () => {
				ref.current!.style.background = `url(${img_snail_hide})`;
				entity.setPos(dstPos);
				state.pauseUntil(new Promise((res) => setTimeout(res, 90)));
				setTimeout(() => {
					ref.current!.style.background = `url(${img_snail})`
				}, 300);
				setTimeout(() => state.current().collides(dstPos.clone().add(posDiff), entity)[1](), 80);
				await new Promise((res) => setTimeout(res, 80));
			}]
		},
		onStep: () => Promise.resolve(),
	}))

	return (
		<div ref={ref}
			class="size-8 bg-cover absolute transition-[translate] duration-100"
			style={{
				background: `url(${img_snail})`,
				translate: `${entity.pos.x * 32}px ${entity.pos.y * 32}px`
			}}
		>
		</div>
	)
}
