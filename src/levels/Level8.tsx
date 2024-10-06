import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"

import img_level_8 from '../../res/level_8.png';
import { Woodbug } from "../entities/Woodbug"
import { loadLevelTiles } from "../Tile"
import { Frog } from "../entities/Frog"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."
import { Inchworm } from "../entities/Inchworm"

export function Level8(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
			tilemap={loadLevelTiles(`
				############
				##..^.....##
				#...^......#
				#...^......#
				#...^......#
				#...^......#
				#...^......#
				##..^.....##
				############
			`)}
		>
			<Background image={img_level_8}/>
			<Player pos={new Vector2(1, 4)} direction={Direction.Right}/>
			<Goal pos={new Vector2(10, 4)} direction={Direction.Left}/>

			<Inchworm head={6} length={7} delay={0} path={[
				new Vector2(7, 1),
				new Vector2(7, 2),
				new Vector2(7, 3),
				new Vector2(7, 4),
				new Vector2(7, 5),
				new Vector2(7, 6),
				new Vector2(7, 7),
				new Vector2(8, 7),
				new Vector2(9, 7),
				new Vector2(9, 6),
				new Vector2(10, 6),
				new Vector2(10, 5),
				new Vector2(10, 4),
				new Vector2(10, 3),
				new Vector2(10, 2),
				new Vector2(9, 2),
				new Vector2(9, 1),
				new Vector2(8, 1),
				// new Vector2(10, 1),
				// new Vector2(10, 0),
			]}></Inchworm>
			<Frog pos={new Vector2(3, 1)} direction={Direction.Down} agro/>
			<Snail pos={new Vector2(3, 5)}/>
			<Woodbug pos={new Vector2(3, 6)}/>
			<Snail pos={new Vector2(3, 7)}/>
			{/* <Goal pos={new Vector2(3, 1)} direction={Direction.Down}/>
			<Snail pos={new Vector2(7, 5)}/>
			<Snail pos={new Vector2(9, 5)}/>
			<Snail pos={new Vector2(10, 5)}/>
			<Snail pos={new Vector2(2, 2)}/>
			<Frog pos={new Vector2(10, 4)} direction={null} agro/>
			<Woodbug pos={new Vector2(10, 2)}/> */}
		</Level>
	)
}
