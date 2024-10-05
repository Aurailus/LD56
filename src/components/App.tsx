import { h } from 'preact';
import { Level } from './Level';
import { Vector2 } from 'three';
import { range } from '../Util';

import img_level_0 from '../../res/level_0.png';
import { Background } from './Background';
import { Player } from './Player';
import { Snail } from './Snail';
import { Inchworm } from './Inchworm';
import { Direction, Woodbug } from './Woodbug';
import { Log } from './Log';

export default function App() {
	return (
		<div class="w-screen h-screen grid place-items-center bg-slate-800">
			<Level 
				tilemap={[
					range(0, 7).map(() => 1),
					[1, 0, 1, 0, 0, 0, 1],
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					[1, 0, 0, 1, 1, 0, 1],
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(() => 1),
				]}
			>
				<Background image={img_level_0}/>
				<Player pos={new Vector2(5, 5)}/>
				<Snail pos={new Vector2(5, 3)}/>
				<Snail pos={new Vector2(5, 4)}/>
				<Log pos={new Vector2(4, 4)}/>
				{/* <Inchworm path={[ 
					new Vector2(1, 5), 
					new Vector2(1, 4), 
					new Vector2(1, 3), 
					new Vector2(2, 3),
					new Vector2(2, 4), 
					new Vector2(3, 4), 
					new Vector2(3, 5), 
					new Vector2(2, 5)
				]} 
				head={2}
				length={4}
			></Inchworm> */}
			<Woodbug direction={null} pos={new Vector2(3, 4)}></Woodbug>
			</Level>
		</div>
	);
}
