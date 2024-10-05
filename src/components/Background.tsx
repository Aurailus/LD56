import { h } from "preact";
import { useGameState } from "../hooks/UseGameState";

interface Props {
	image: string;
}

export function Background(props: Props) {
	const state = useGameState();
	return (
		<div 
			class="bg-cover" 
			style={{ 
				backgroundImage: `url(${props.image})`,
				width: 32 * state.tilemap[0].length, 
				height: 32 * state.tilemap.length
			}}
		/> 
	);
}
