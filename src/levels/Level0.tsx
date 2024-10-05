import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../components/Player"
import { Snail } from "../components/Snail"
import { Log } from "../components/Log"
import { Vector2 } from "three"
import { Woodbug } from "../components/Woodbug"

import img_level_0 from '../../res/level_0.png';
import { loadLevelTiles } from "../Tile"

export function Level0() {
	return (
		<Level 
			tilemap={loadLevelTiles(`
				#######
				#.#...#
				#.....#
				#..##.#
				#.....#
				#.....#
				#######
			`)}
		>
			<Background image={img_level_0}/>
			<Player pos={new Vector2(5, 5)}/>
			<Snail pos={new Vector2(5, 4)}/>
			{/* <Snail pos={new Vector2(5, 3)}/> */}
			<Log pos={new Vector2(3, 4)}/>
			<Log pos={new Vector2(1, 3)}/>
			{/* <Log pos={new Vector2(3, 4)}/> */}
			{/* <Inchworm path={[ 
					new Vector2(1, 5), 
					new Vector2(1, 4), 
					new Vector2(1, 3), 
					new Vector2(2, 3),
					new Vector2(2, 4), 
					new Vector2(3, 4), 
					new Vector2(3, 5), 
					new Vector2(2, 5)
				]} 
				head={2}
				length={4}
			></Inchworm> */}
			{/* <Woodbug direction={null} pos={new Vector2(3, 4)}></Woodbug> */}
			<Woodbug direction={null} pos={new Vector2(1, 4)} agro/>
		</Level>
	)
}
