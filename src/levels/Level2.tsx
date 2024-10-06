import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"

import img_level_2 from '../../res/level_1_5.png';
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."

export function Level2(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
			tilemap={loadLevelTiles(`
				#######
				###..##
				#.....#
				##..###
				##.####
				#######
			`)}
		>
			<Background image={img_level_2}/>
			<Player pos={new Vector2(1, 2)} direction={Direction.Right}/>
			<Goal pos={new Vector2(4, 1)} direction={Direction.Down}/>
			<Snail pos={new Vector2(3, 2)}/>
			<Snail pos={new Vector2(4, 2)}/>
		</Level>
	)
}
