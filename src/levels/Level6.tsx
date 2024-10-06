import { h } from "preact"
import { Level } from "../components/Level"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"

import img_level_6 from '../../res/level_6.png';
import { Woodbug } from "../entities/Woodbug"
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."
import { Frog } from "../entities/Frog"

export function Level6(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
			tilemap={loadLevelTiles(`
				############
				#......#####
				#.###..^####
				#......^^..#
				###....^^..#
				###.#..^^..#
				###.##.^^.##
				############
			`)}
		>
			<Background image={img_level_6}/>
			<Player pos={new Vector2(3, 6)} direction={Direction.Up}/>
			<Frog pos={new Vector2(6, 1)} direction={Direction.Down} agro/>
			<Goal pos={new Vector2(10, 4)} direction={Direction.Left}/>
			<Snail pos={new Vector2(6, 4)}/>
			<Woodbug pos={new Vector2(3, 4)}/>
		</Level>
	)
}
