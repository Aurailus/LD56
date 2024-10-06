import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Woodbug } from "../entities/Woodbug"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"
import { Frog } from "../entities/Frog"

import img_level_0 from '../../res/level_0.png';
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."

export function Level0(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
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
			<Player pos={new Vector2(5, 5)} direction={Direction.Up}/>
			<Woodbug pos={new Vector2(5, 4)}/>
			{/* <Snail pos={new Vector2(5, 3)}/> */}
			<Snail pos={new Vector2(3, 4)}/>
			<Snail pos={new Vector2(1, 3)}/>
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
			<Frog direction={null} pos={new Vector2(1, 4)} agro/>
			<Goal pos={new Vector2(2, 4)} direction={Direction.Down}/>
		</Level>
	)
}
