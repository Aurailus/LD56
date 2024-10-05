import { h } from 'preact';
import { Level } from './Level';
import { Vector2 } from 'three';
import { range } from '../Util';

import img_level_0 from '../../res/level_0.png';
import { Background } from './Background';
import { Player } from './Player';
import { Snail } from './Snail';

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
				<Player pos={new Vector2(3, 5)}/>
				<Snail pos={new Vector2(2, 2)}/>
				<Snail pos={new Vector2(4, 2)}/>
			</Level>
		</div>
	);
}
