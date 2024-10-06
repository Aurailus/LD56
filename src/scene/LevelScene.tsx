import { h } from 'preact';
import useStore from '../hooks/UseStore';
import { useCallback, useEffect } from 'preact/hooks';
import { LEVELS } from '../levels';
import { wait } from '../Util';
import clsx from 'clsx';

interface Props {
	level: number
	returnToMenu: () => void;
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

	const returnToMenu = useCallback((level: number) => {
		opacity(0);
		wait(50).then(() => props.returnToMenu());
	}, []);


	const Component = LEVELS[renderedLevel()].component;
	return (
		<div key={renderedLevel()} class={clsx("w-screen h-screen grid place-items-center transition-all duration-200",
			opacity() ? "opacity-100 scale-100" : "opacity-0 scale-[75%]")}>
			<Component/>
		</div>
	);
}
