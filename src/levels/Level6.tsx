import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../components/Player"
import { Log } from "../components/Log"
import { Vector2 } from "three"

import img_level_6 from '../../res/level_6.png';
import { Snail } from "../components/Snail"
import { loadLevelTiles } from "../Tile"

export function Level6() {
	return (
		<Level 
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
			<Player pos={new Vector2(3, 6)}/>
			<Log pos={new Vector2(6, 4)}/>
			<Snail pos={new Vector2(3, 4)}/>
		</Level>
	)
}
