import { h } from "preact"

import { Entity } from "./Entity";

import img_player from "../../res/player.png";

export class Player extends Entity {
	// onStep(): void {
	// 	this.pos.x += 1;
	// }

	render() {
		return (
			<div 
				class="size-8 bg-cover absolute transition-all duration-100"
				style={{
					background: `url(${img_player})`,
					translate: `${this.pos.x * 32}px ${this.pos.y * 32}px`
				}}
			>
			</div>
		);
	}	
}
