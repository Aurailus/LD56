import { h } from "preact"
import { Level } from "../components/Level"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Log } from "../entities/Log"
import { Vector2 } from "three"

import img_level_6 from '../../res/level_6.png';
import { Snail } from "../entities/Snail"
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"

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
			<Goal pos={new Vector2(10, 4)} direction={Direction.Left}/>
			<Log pos={new Vector2(6, 4)}/>
			<Snail pos={new Vector2(3, 4)}/>
		</Level>
	)
}
