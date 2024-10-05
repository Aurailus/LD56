import { h } from 'preact';
import { Level } from './Level';
import { Vector2 } from 'three';
import { range } from '../Util';

import img_level_0 from '../../res/level_0.png';

export default function App() {
	return (
		<div class="w-screen h-screen grid place-items-center">
			<Level 
				background={img_level_0} 
				entities={() => []} 
				startPos={new Vector2(3, 5)}
				tilemap={[
					range(0, 7).map(() => 1),
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(i => i === 0 || i === 6 ? 1 : 0),
					range(0, 7).map(() => 1),
				]}
			></Level>
		</div>
	);
}
