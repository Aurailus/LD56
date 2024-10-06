import { h } from 'preact';
import { Level0 } from '../levels/Level0';
import { Level1 } from '../levels/Level1';
import useStore from '../hooks/UseStore';
import { useEffect } from 'preact/hooks';
import { Level3 } from '../levels/Level3';
import { Level4 } from '../levels/Level4';
import { Level2 } from '../levels/Level2';
import { Level5 } from '../levels/Level5';
import { Level6 } from '../levels/Level6';
import { Level7 } from '../levels/Level7';

const LEVELS = [
	Level0,
	Level1,
	Level2,
	Level3,
	Level4,
	Level5,
	Level6,
	Level7,
];

export default function App() {
	const level = useStore<number>(5);
	const LevelComponent = LEVELS[level()];

	useEffect(() => {
		const keydownEvent = (e: KeyboardEvent) => {
			if (e.key === ">") level(l => l + 1);
			else if (e.key === "<") level(l => l - 1);
		}
		window.addEventListener("keydown", keydownEvent);
		return () => window.addEventListener("keyup", keydownEvent);
	}, []);

	return (
		<div class="w-screen h-screen grid place-items-center bg-slate-800">
			<LevelComponent/>
		</div>
	);
}
