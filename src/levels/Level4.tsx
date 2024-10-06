import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"

import img_level_3 from '../../res/level_3.png';
import { Woodbug } from "../entities/Woodbug"
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."

export function Level4(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
			tilemap={loadLevelTiles(`
				##########
				#####...##
				#####....#
				#####.#.##
				#........#
				#..####.##
				#######.##
				##########
			`)}
		>
			<Background image={img_level_3}/>
			<Player pos={new Vector2(1, 4)} direction={Direction.Right}/>
			<Goal pos={new Vector2(8, 4)} direction={Direction.Left}/>
			<Woodbug pos={new Vector2(3, 4)}/>
			<Woodbug pos={new Vector2(6, 4)}/>
			<Woodbug pos={new Vector2(6, 2)}/>
			<Woodbug pos={new Vector2(7, 2)}/>
		</Level>
	)
}
