import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Log } from "../entities/Log"
import { Vector2 } from "three"

import img_level_5 from '../../res/level_5.png';
import { Snail } from "../entities/Snail"
import { loadLevelTiles } from "../Tile"
import { Inchworm } from "../entities/Inchworm"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"

export function Level5() {
	return (
		<Level 
			tilemap={loadLevelTiles(`
				#######
				####//#
				##....#
				##.#..#
				##.#.##
				##.#..#
				##...##
				##...##
				###.###
				#######
			`)}
		>
			<Background image={img_level_5}/>
			<Player pos={new Vector2(5, 5)}/>
			<Goal pos={new Vector2(3, 8)} direction={Direction.Up}/>
			<Log pos={new Vector2(4, 4)}/>
			<Snail pos={new Vector2(2, 3)}/>
			<Inchworm head={5} length={6} delay={0} path={[
				new Vector2(2, 5),
				new Vector2(2, 6),
				new Vector2(2, 7),
				new Vector2(3, 7),
				new Vector2(4, 7),
				new Vector2(4, 6),
				new Vector2(4, 5),
				new Vector2(4, 4),
				new Vector2(4, 3),
				new Vector2(4, 2),
				new Vector2(3, 2),
				new Vector2(2, 2),
				new Vector2(2, 3),
				new Vector2(2, 4),
			]}></Inchworm>
		</Level>
	)
}
