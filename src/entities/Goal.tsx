import { h } from "preact"
import { useEntity } from "../hooks/UseEntity"
import { Vector2 } from "three";

import { useLevel } from "../hooks/UseLevel";
import { posToTranslate, wait } from "../Util";

import img_player from "../../res/player.png";
import img_player_2 from "../../res/player_2.png";
import { useAnimFrame } from "../hooks/UseAnimFrame";
import { Direction, rotateDirection } from "../Direction";

interface Props {
	pos: Vector2;
	direction: Direction;
}

export function Goal(props: Props) {
	const frame = useAnimFrame();
	const level = useLevel();
	const ent = useEntity(() => ({
		name: "Goal",
		data: {},
		pos: props.pos,
		canPush: () => false,
		canCollide: () => true,
		onCollide: async (_, other) => {
			if (other.props.name === "Player") {
				wait(40).then(() => ent.bump(other.data.pos, 1));
				level.complete();
			}
		}
	}));

	return (
		<div 
			ref={ent.ref}
			class="size-24 bg-cover absolute transition-core duration-100 z-10"
			style={{
				filter: `hue-rotate(220deg)`,
				backgroundImage: (frame % 2) === 1 ? `url(${img_player_2})` : `url(${img_player})`,
				translate: posToTranslate(ent.data.pos),
				rotate: `${rotateDirection(props.direction) + 180}deg`,
			}}
		>
		</div>
	)
} 
