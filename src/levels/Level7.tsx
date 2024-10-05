import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../components/Player"
import { Log } from "../components/Log"
import { Vector2 } from "three"

import img_level_7 from '../../res/level_7.png';
import { Snail } from "../components/Snail"
import { loadLevelTiles } from "../Tile"
import { Direction, Woodbug } from "../components/Woodbug"

export function Level7() {
	return (
		<Level 
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
			<Player pos={new Vector2(4, 7)}/>
			<Log pos={new Vector2(7, 4)}/>
			<Log pos={new Vector2(7, 5)}/>
			<Log pos={new Vector2(9, 5)}/>
			<Log pos={new Vector2(10, 5)}/>
			<Log pos={new Vector2(2, 2)}/>
			<Woodbug pos={new Vector2(10, 4)} direction={null} agro/>
			<Snail pos={new Vector2(10, 2)}/>
		</Level>
	)
}
