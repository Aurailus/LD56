import { h } from 'preact';

import { LEVELS } from '../levels';

import img_level_icon from "../../res/level_icon.png"
import img_star_outline from "../../res/level_star_outline.png"
import img_star from "../../res/level_star.png"
import img_title from "../../res/title.png"
import { LevelProgress } from '../LevelProgress';
import clsx from 'clsx';
import useStore from '../hooks/UseStore';
import { useCallback, useEffect } from 'preact/hooks';
import { wait } from '../Util';
import { useAnimFrame } from '../hooks/UseAnimFrame';

interface Props {
	getLevelProgress: (number: number) => LevelProgress;
	startLevel: (number: number) => void;
}

export function MenuScene(props: Props) {
	const frame = useAnimFrame();
	const opacity = useStore(0);
	useEffect(() => void requestAnimationFrame(() => opacity(1)), []);

	const startLevel = useCallback((level: number) => {
		opacity(0);
		wait(50).then(() => props.startLevel(level));
	}, []);

	return (
		<div class={clsx("w-screen h-screen grid grid-cols-[auto,1fr] place-items-center transition-all p-16 duration-200", 
			opacity() ? "opacity-100" : "opacity-0")}>
			<div class="w-[calc(192*4px)] h-[calc(106*4px)] bg-cover animate-text-bob"
				style={{ backgroundImage: `url(${img_title})`, '--i': 0 }}
			></div>
			<div class="grid grid-cols-4 grid-rows-2 p-48 pt-32 px-16 w-full h-full place-items-center overflow-auto items-center justify-center">
				{LEVELS.slice(1).map(level => {
					const progress = props.getLevelProgress(level.number);
					const unlocked = props.getLevelProgress(level.number - 1).completed || level.number === 1;
					const isCurrent = unlocked && !props.getLevelProgress(level.number + 1).completed && !progress.completed;
					return (
						<button
							disabled={!unlocked}
							onClick={() => startLevel(level.number)}
							class={clsx(
								"aspect-square bg-cover grid place-items-center isolate relative shrink-0 outline-none",
								!unlocked && "opacity-30")}
							style={{ width: `24px`, scale: `300%` }}
						>
							<div class={clsx("absolute z-0 inset-0", frame % 2 === 1 && "opacity-0")} style={{ 
								backgroundImage: `url(${img_level_icon})`,
								rotate: `${(level.number % 4) * 90}deg`
							}}></div>
							<div class={clsx("absolute z-0 inset-0", frame % 2 === 0 && "opacity-0")} style={{ 
								backgroundImage: `url(${img_level_icon})`,
								rotate: `${(level.number % 4) * 90 + 90}deg`
							}}></div>
							{isCurrent && <div class="absolute z-0 inset-0 animate-ping" style={{ 
								backgroundImage: `url(${img_level_icon})`,
								rotate: `${(level.number % 4) * 90}deg`,
								scale: `80%`,
							}}></div>}
							<p class="font-handwritten text-sky-800 relative leading-none pb-1">{level.number}</p>
							<div class={"transition-all " + (unlocked ? "scale-1 opacity-100" : "scale-0 opacity-0")}>
								<div class={clsx("bg-cover absolute [translate:-50%_0%] top-full -left-0.5 mt-1 aspect-square", progress.completed && "animate-text-bob")}
									title="Level Completed"
									style={{ backgroundImage: `url(${progress.completed ? img_star : img_star_outline})`, width: `16px`, '--i': 0 }}/>
								<div class={clsx("bg-cover absolute [translate:-50%_0%] top-full left-1/2 mt-1 aspect-square", progress.noUndo && "animate-text-bob")}
									style={{ backgroundImage: `url(${progress.noUndo ? img_star : img_star_outline})`, width: `16px`, '--i': 3 }}
										title="No Undo"
									/>
								<div class={clsx("bg-cover absolute [translate:50%_0%] top-full -right-0.5 mt-1 aspect-square", progress.minMoves && "animate-text-bob")}
									style={{ backgroundImage: `url(${progress.minMoves ? img_star : img_star_outline})`, width: `16px`, '--i': 7 }}
									title="Minimum Moves"/>
							</div>
						</button>
					);
					})}
			</div>
		</div>
	)
}
