import { h } from 'preact';
import useStore from '../hooks/UseStore';
import { useCallback, useEffect } from 'preact/hooks';
import { MenuScene } from '../scene/MenuScene';
import LevelScene from '../scene/LevelScene';
import { LEVELS } from '../levels';
import useStoredState from '../hooks/UseStoredState';
import { LEVEL_PROGRESS_NONE, LevelProgress } from '../LevelProgress';
import clsx from 'clsx';

enum Scene {
	Menu = 1,
	Level = 2,
}

export default function App() {
	const scene = useStore<Scene>(Scene.Menu)
	const currLevel = useStore<number>(0);
	const [ levelProgressRaw, setLevelProgressRaw ] = 
		useStoredState<(LevelProgress & { number: number })[]>([], "level_progress")

	const getLevelProgress = useCallback((number: number) => {
		let progress = LEVEL_PROGRESS_NONE;
		setLevelProgressRaw(prog => {
			prog.filter(p => p.number === number).forEach((prog) => {
				progress = prog;
			});
			return prog;
		});
		return progress;
	}, []);

	const setLevelProgress = useCallback((number: number, progress: LevelProgress) =>
		setLevelProgressRaw(prog => [...prog.filter(p => p.number !== number), { number, ...progress }]), []);

	const startLevel = useCallback((number: number) => {
		currLevel(number);
		scene(Scene.Level);
	}, []);

	const returnToMenu = useCallback(() => {
		scene(Scene.Menu);
	}, []);

	useEffect(() => {
		const keydownEvent = (e: KeyboardEvent) => {
			if (e.key === ">") currLevel(l => l + 1);
			else if (e.key === "<") currLevel(l => l - 1);
			else if (e.key === "Escape" && scene() === Scene.Level) scene(Scene.Menu);
		}
		window.addEventListener("keydown", keydownEvent);
		return () => window.addEventListener("keyup", keydownEvent);
	}, []);

	return (
		<div class={clsx("w-screen h-screen grid transition-all duration-300 bg-sky-500", 
			scene() === Scene.Level && "!bg-slate-800")}>
			{scene() === Scene.Menu 
				? <MenuScene getLevelProgress={getLevelProgress} startLevel={startLevel}/> 
				: <LevelScene level={currLevel()} returnToMenu={returnToMenu}/>}
		</div>
		
	)
}
