import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"

import img_level_7 from '../../res/level_7.png';
import { Woodbug } from "../entities/Woodbug"
import { loadLevelTiles } from "../Tile"
import { Frog } from "../entities/Frog"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."

export function Level7(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
			tilemap={loadLevelTiles(`
				############
				###.####...#
				#..^####/#.#
				#.#^..../#^#
				#..^###..#.#
				###^.......#
				###...#....#
				####.#######
				############
			`)}
		>
			<Background image={img_level_7}/>
			<Player pos={new Vector2(4, 7)} direction={Direction.Up}/>
			<Goal pos={new Vector2(3, 1)} direction={Direction.Down}/>
			<Snail pos={new Vector2(7, 4)}/>
			<Snail pos={new Vector2(7, 5)}/>
			<Snail pos={new Vector2(9, 5)}/>
			<Snail pos={new Vector2(10, 5)}/>
			<Snail pos={new Vector2(2, 2)}/>
			<Frog pos={new Vector2(10, 4)} direction={null} agro/>
			<Woodbug pos={new Vector2(10, 2)}/>
		</Level>
	)
}
