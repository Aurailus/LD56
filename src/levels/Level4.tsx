import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Log } from "../entities/Log"
import { Vector2 } from "three"

import img_level_3 from '../../res/level_3.png';
import { Snail } from "../entities/Snail"
import { loadLevelTiles } from "../Tile"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"

export function Level4() {
	return (
		<Level 
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
			<Player pos={new Vector2(1, 4)}/>
			<Goal pos={new Vector2(8, 4)} direction={Direction.Left}/>
			<Snail pos={new Vector2(3, 4)}/>
			<Snail pos={new Vector2(6, 4)}/>
			<Snail pos={new Vector2(6, 2)}/>
			<Snail pos={new Vector2(7, 2)}/>
		</Level>
	)
}
