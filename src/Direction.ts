import { Vector2 } from "three";

export enum Direction {
	Up = 1,
	Down,
	Left,
	Right
}

export const rotateDirection = (dir: Direction) => {
	switch (dir) {
		case Direction.Up: return 180;
		case Direction.Down: return 0;
		case Direction.Right: return 270;
		case Direction.Left: return 90;
	}
}

export const directionFromOffset = (offset: Vector2) => {
	if (offset.x < 0) return Direction.Left;
	else if (offset.x > 0) return Direction.Right;
	else if (offset.y < 0) return Direction.Up;
	else if (offset.y > 0) return Direction.Down;
	return null;
}

export const offsetFromDirection = (dir: Direction) => {
	switch (dir) {
		case Direction.Up: return new Vector2(0, -1);
		case Direction.Down: return new Vector2(0, 1);
		case Direction.Right: return new Vector2(1, 0);
		case Direction.Left: return new Vector2(-1, 0);
	}
}
