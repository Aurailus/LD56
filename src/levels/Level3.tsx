import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Vector2 } from "three"
import { Woodbug } from "../entities/Woodbug"

import img_level_2 from '../../res/level_2.png';
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."

export function Level3(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
			tilemap={loadLevelTiles(`
				#########
				##.###.##
				##..##.##
				#.......#
				###.#..##
				#########
			`)}
		>
			<Background image={img_level_2}/>
			<Player pos={new Vector2(1, 3)} direction={Direction.Right}/>
			<Goal pos={new Vector2(7, 3)} direction={Direction.Left}/>
			<Woodbug pos={new Vector2(3, 3)}/>
			<Woodbug pos={new Vector2(4, 3)}/>
		</Level>
	)
}
