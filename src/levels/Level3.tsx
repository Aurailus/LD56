import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../components/Player"
import { Vector2 } from "three"
import { Snail } from "../components/Snail"

import img_level_2 from '../../res/level_2.png';
import { loadLevelTiles } from "../Tile"

export function Level3() {
	return (
		<Level 
			tilemap={loadLevelTiles(`
				########
				##.###.#
				##..##.#
				#......#
				###.#..#
				########
			`)}
		>
			<Background image={img_level_2}/>
			<Player pos={new Vector2(1, 3)}/>
			<Snail pos={new Vector2(3, 3)}/>
			<Snail pos={new Vector2(4, 3)}/>
		</Level>
	)
}
