import { h } from "preact";
import { useLevel } from "../hooks/UseLevel";
import { SCALE, TILE_SIZE } from "../Util";

interface Props {
	image: string;
}

export function Background(props: Props) {
	const state = useLevel();
	return (
		<div 
			class="bg-cover" 
			style={{ 
				backgroundImage: `url(${props.image})`,
				width: TILE_SIZE * state.data.tilemap[0].length * SCALE, 
				height: TILE_SIZE * state.data.tilemap.length * SCALE,
			}}
		/> 
	);
}
