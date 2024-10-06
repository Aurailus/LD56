import { h } from "preact";
import { useLevel } from "../hooks/UseLevel";

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
				width: 32 * state.data.tilemap[0].length, 
				height: 32 * state.data.tilemap.length
			}}
		/> 
	);
}
