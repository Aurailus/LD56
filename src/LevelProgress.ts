export type LevelProgress = {
	completed: boolean;
	minMoves: boolean;
	noUndo: boolean;
}

export const LEVEL_PROGRESS_NONE: LevelProgress = {
	completed: false,
	minMoves: false,
	noUndo: false
}
