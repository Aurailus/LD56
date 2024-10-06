import { h } from 'preact';
import useStore from '../hooks/UseStore';
import { useCallback, useEffect } from 'preact/hooks';
import { LevelComponentProps, LEVELS } from '../levels';
import { wait } from '../Util';
import clsx from 'clsx';

type Props = LevelComponentProps & {
	level: number
}

export default function LevelScene(props: Props) {
	const renderedLevel = useStore(props.level);
	const opacity = useStore(0);
	useEffect(() => {
		(async () => {
			if (opacity() !== 0) {
				opacity(0);
				await wait(300);
			}
			renderedLevel(props.level)
			requestAnimationFrame(() => requestAnimationFrame(() => opacity(1)));
		})()
	}, [ props.level]);

	const onQuit = useCallback(() => {
		opacity(0);
		wait(50).then(() => props.onQuit());
	}, []);

	const onComplete = useCallback((numMoves: number, usedUndo: boolean) => {
		opacity(0);
		wait(50).then(() => props.onComplete(numMoves, usedUndo));
	}, []);


	const level = LEVELS[renderedLevel()];
	const Component = level.component;
	return (
		<div key={renderedLevel()} class={clsx("w-screen h-screen grid place-items-center transition-all duration-200",
			opacity() ? "opacity-100 scale-100" : "opacity-0 scale-[75%]")}>
			<p class="absolute top-4 left-1/2 -translate-x-1/2 text-nowrap text-white font-handwritten text-5xl [text-shadow:0px_4px_12px_rgb(0_0_0/50%)]">
				{level.name.split("").map((x, i) => <span key={i} class={clsx("inline-block animate-text-bob", x === " " && "opacity-0")} style={{ "--i": i.toString() }}>{x === " " ? "." : x}</span>)}
			</p>

			<p class="absolute bottom-4 left-1/2 -translate-x-1/2 text-nowrap text-white/20 font-handwritten text-3xl [text-shadow:0px_4px_12px_rgb(0_0_0/20%)]">
				{"[Esc] Quit to Menu        [R] Restart        [Z] Undo".split("").map((x, i) => <span key={i} class={clsx("inline-block animate-text-bob", x === " " && "opacity-0")} style={{ "--i": i.toString() }}>{x === " " ? "." : x}</span>)}
			</p>

			<Component onQuit={onQuit} onComplete={onComplete} />
		</div>
	);
}
