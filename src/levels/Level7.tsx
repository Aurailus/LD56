import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Log } from "../entities/Log"
import { Vector2 } from "three"

import img_level_7 from '../../res/level_7.png';
import { Snail } from "../entities/Snail"
import { loadLevelTiles } from "../Tile"
import { Woodbug } from "../entities/Woodbug"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"

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
			<Goal pos={new Vector2(3, 1)} direction={Direction.Down}/>
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
