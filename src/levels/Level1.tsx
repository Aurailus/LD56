import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Log } from "../entities/Log"
import { Vector2 } from "three"

import img_level_1 from '../../res/level_1.png';
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"

export function Level1() {
	return (
		<Level 
			tilemap={loadLevelTiles(`
				#######
				##.#.##
				##....#
				##.####
				#...###
				#...###
				#######
			`)}
		>
			<Background image={img_level_1}/>
			<Player pos={new Vector2(2, 5)}/>
			<Goal pos={new Vector2(4, 1)} direction={Direction.Down}/>
			<Log pos={new Vector2(2, 3)}/>
			<Log pos={new Vector2(4, 2)}/>
		</Level>
	)
}
