import { FunctionalComponent } from "preact"
import { Level0 } from "./Level0";
import { Level2 } from "./Level2";
import { Level1 } from "./Level1";
import { Level7 } from "./Level7";
import { Level6 } from "./Level6";
import { Level5 } from "./Level5";
import { Level4 } from "./Level4";
import { Level3 } from "./Level3";

export type Level = {
	name: string,
	number: number,
	minMoves: number,
	component: FunctionalComponent<{}>,
};

export const LEVELS: Level[] = [
	{
		name: "TESTING",
		number: 0,
		minMoves: 1000,
		component: Level0,
	},
	{
		name: "1. Intro",
		number: 1,
		minMoves: 10,
		component: Level1
	},
	{
		name: "2. something else",
		number: 2,
		minMoves: 10,
		component: Level2
	},
	{
		name: "3. something else",
		number: 3,
		minMoves: 10,
		component: Level3
	},
	{
		name: "4. something else",
		number: 4,
		minMoves: 10,
		component: Level4
	},
	{
		name: "5. something else",
		number: 5,
		minMoves: 10,
		component: Level5
	},
	{
		name: "6. something else",
		number: 6,
		minMoves: 10,
		component: Level6
	},
	{
		name: "7. something else",
		number: 7,
		minMoves: 10,
		component: Level7
	}
];
