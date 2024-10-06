import { h } from "preact"
import { Level } from "../components/Level"
import { range } from "../Util"
import { Background } from "../components/Background"
import { Player } from "../entities/Player"
import { Snail } from "../entities/Snail"
import { Vector2 } from "three"

import img_level_5 from '../../res/level_5.png';
import { Woodbug } from "../entities/Woodbug"
import { loadLevelTiles } from "../Tile"
import { Inchworm } from "../entities/Inchworm"
import { Goal } from "../entities/Goal"
import { Direction } from "../Direction"
import { LevelComponentProps } from "."

export function Level5(props: LevelComponentProps) {
	return (
		<Level
			onComplete={props.onComplete}
			onQuit={props.onQuit}
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
			<Player pos={new Vector2(5, 5)} direction={Direction.Left}/>
			<Goal pos={new Vector2(3, 8)} direction={Direction.Up}/>
			<Snail pos={new Vector2(4, 4)}/>
			<Woodbug pos={new Vector2(2, 3)}/>
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
