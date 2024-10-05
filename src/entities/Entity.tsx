import { Vector2 } from "three";
import { Fragment, h } from "preact";

export class Entity {
	pos: Vector2;
	dead: boolean = false;

	constructor(pos: Vector2) {
		this.pos = pos;
	}

	/** Returns `true` if the movement should be cancelled. */
	onIntersect(_other: Entity): boolean { return !this.dead; };

	/** Run every time the player moves. */
	onStep(): Promise<void> { return Promise.resolve(); };

	render() {
		return this.dead ? (
			<Fragment/>
		) : (
			<div>
				<p>Override me pls</p>
			</div>
		)
	};
}
