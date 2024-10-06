import { Fragment, h } from "preact"
import { Vector2 } from "three";
import { AnyEntity, useEntity } from "../hooks/UseEntity";
import { useCallback } from "preact/hooks";
import { useLevel } from "../hooks/UseLevel";
import { range, posToTranslate, wait } from "../Util";

import img_path_ns from "../../res/inchworm_path_ns.png"
import img_path_nw from "../../res/inchworm_path_nw.png"
import img_path_sw from "../../res/inchworm_path_sw.png"
import img_path_we from "../../res/inchworm_path_we.png"
import img_body_ns from "../../res/inchworm_ns.png"
import img_body_nw from "../../res/inchworm_nw.png"
import img_body_sw from "../../res/inchworm_sw.png"
import img_body_we from "../../res/inchworm_we.png"
import img_head_n from "../../res/inchworm_head_n.png"
import img_head_e from "../../res/inchworm_head_e.png"
import img_head_s from "../../res/inchworm_head_s.png"
import img_butt_n from "../../res/inchworm_butt_n.png"
import img_butt_e from "../../res/inchworm_butt_e.png"
import img_butt_s from "../../res/inchworm_butt_s.png"

type MidSegmentImages = {
	n: string;
	e: string;
	s: string;
	nw: string;
	sw: string;
}
type EndSegmentImages = { 
	n: string; 
	e: string; 
	s: string; 
}

const PATH_IMAGES: MidSegmentImages = {
	n: img_path_ns,
	s: img_path_ns,
	e: img_path_we,
	nw: img_path_nw,
	sw: img_path_sw
}

const BODY_IMAGES: MidSegmentImages = {
	n: img_body_ns,
	s: img_body_ns,
	e: img_body_we,
	nw: img_body_nw,
	sw: img_body_sw
}
const HEAD_IMAGES: EndSegmentImages = {
	n: img_head_n,
	s: img_head_s,
	e: img_head_e,
}
const BUTT_IMAGES: EndSegmentImages = {
	n: img_butt_n,
	s: img_butt_s,
	e: img_butt_e,
}

const isCorner = (path: Vector2[], ind: number) => {
	const diff = path[(ind + 1) % path.length].clone().sub(path[(ind - 1 + path.length) % path.length]);
	return diff.x !== 0 && diff.y !== 0;
}

const getRotatedMidSegment = (images: MidSegmentImages, path: Vector2[], ind: number): [ string, boolean ] => {
	const corner = isCorner(path, ind);
	const curr = path[ind];
	const prev = path[(ind - 1 + path.length) % path.length];
	const next = path[(ind + 1) % path.length];
	if (!corner) {
		const prevDiff = curr.clone().sub(prev);
		if (prevDiff.x !== 0) return [ images.e, prevDiff.x > 0 ];
		else return prevDiff.y > 0 ? [ images.s, false ] : [ images.n, false ]
	}
	else {
		const prevDiff = curr.clone().sub(prev);
		const nextDiff = curr.clone().sub(next);
		const verticalIsNext = nextDiff.y !== 0;
		const isWest = verticalIsNext ? prevDiff.x < 0 : nextDiff.x < 0;
		const isSouth = verticalIsNext ? nextDiff.y < 0 : prevDiff.y < 0;
		return [ isSouth ? images.sw : images.nw, isWest ];
	}
}

const getRotatedEndSegment = (images: EndSegmentImages, path: Vector2[], ind: number, seekPrev: boolean): [ string, boolean ] => {
	const diff = seekPrev 
		? path[ind].clone().sub(path[(ind - 1 + path.length) % path.length]) 
		: path[(ind + 1) % path.length].clone().sub(path[ind]);
	if (diff.y < 0) return [images.n, false]
	else if (diff.y > 0) return [images.s, false]
	else return [images.e, diff.x < 0];
}

interface Props {
	path: Vector2[];
	head: number;
	length: number;
	delay: number;
}

const BODY_ID = "InchwormBody";
const HEAD_ID = "InchwormHead";
const TAIL_ID = "InchwormTail";

export function Inchworm(props: Props) {
	const level = useLevel();
	
	const entities: AnyEntity[] = [];
	const ent = useEntity<{
		head: number;
		length: number;
		delayTillExpand: number;
	}>(() => ({
		name: HEAD_ID,
		data: {
			head: props.head,
			length: props.length,
			delayTillExpand: -1
		},
		pos: props.path[props.head],
		canCollide: () => true,
		onCollide: async (ent, other) => {
			const diff = ent.data.pos.clone().sub(other.data.pos);
			wait(50).then(() => entities.forEach((ent) => ent.bump(ent.data.pos.clone().add(diff))));
		},
		canPush: (ent) => {
			return (ent === entities[0]) && ent.data.length === props.length;
		},
		onPush: async (self, other) => {
			if (!self.props.canPush(self, other)) return;
			await contractWorm();
		},
		onStep: async () => {
			ent.setData({ delayTillExpand: Math.max(ent.data.delayTillExpand - 1, -1) });
			if (ent.data.length < props.length && ent.data.delayTillExpand < 0) expandWorm(); 
		}
	}));

	const contractWorm = useCallback(async () => {
		ent.setData({ delayTillExpand: props.delay });
		for (let i = 0; i < props.length - 2; i++) {
			ent.setData({ length: ent.data.length - 1 });
			level.await(wait(110));
			await wait(100);
		}
		entities.slice(0, entities.length - 2).forEach(ent => ent.setPos(new Vector2(-100, -100)));
		level.await(wait(200));
	}, [])

	const expandWorm = useCallback(async () => {
		const loopCount = props.length - ent.data.length;
		for (let i = 0; i < loopCount; i++) {
			const ent = entities[entities.length - 1];
			const headPos = props.path[ent.data.head % props.path.length];
			const nextPos = props.path[(ent.data.head + 1) % props.path.length]
			ent.data.pos = headPos;
			const collides = level.testCollision(nextPos, ent);
			const pushable = level.testPush(nextPos, ent);
			if (!collides.collides || pushable.canPush) {
				level.await(collides.entity?.props.onCollide(collides.entity, ent) ?? Promise.resolve());
				if (pushable) level.await(pushable.entity?.props.onPush(pushable.entity, ent) ?? Promise.resolve());
				ent.setData({
					length: ent.data.length + 1,
					head: (ent.data.head + 1) % props.path.length,
				});
				level.await(wait(110));
				await wait(100);
			}
			else {
				wait(150)
				.then(() => Promise.all(entities.map((ent) => ent?.bump(nextPos))))
				.then(() => entities.forEach((seg, indRaw) => {
					const ind = (ent.data.head - indRaw + props.path.length) % props.path.length
					if (!seg.ref.current) return;
					seg.ref.current.style.translate = posToTranslate(props.path[ind]);
				}));
				level.await(wait(100));
				break;
			}
		}
		range(ent.data.length).map(indRaw => {
			const pos = props.path[(ent.data.head + indRaw - ent.data.length + 1 + props.path.length) % props.path.length] 
			entities[indRaw].setPos(pos);
		})
	}, [])

	entities.push(...range(props.length - 1).map((indRaw) => {
		const ind = (props.head - indRaw + props.path.length) % props.path.length;
		const seg = useEntity(() => ({
			name: ind === 0 ? HEAD_ID : ind === props.length - 1 ? TAIL_ID : BODY_ID,
			data: {},
			pos: props.path[(ent.data.head + indRaw + 1 - props.length + props.path.length) % props.path.length],
			canCollide: () => true,
			onCollide: async (seg, other) => {
				const diff = seg.data.pos.clone().sub(other.data.pos);
				wait(50).then(() => entities.forEach((ent) => ent.bump(ent.data.pos.clone().add(diff))));
			},
			canPush: (seg) => {
				return (seg === entities[0]) && ent.data.length === props.length;
			},
			onPush: async (self, other) => {
				if (!self.props.canPush(self, other)) return;
				await contractWorm();
			}
		}));
		return seg;
	}))
	entities.push(ent);

	return (
		<Fragment>
			{props.path.map((pos, ind) => {
				const [ img, flip ] = getRotatedMidSegment(PATH_IMAGES, props.path, ind);
				return (
					<div
						class="size-8 bg-cover absolute transition-[translate] duration-100 z-0"
						style={{
							background: `url(${img})`,
							translate: posToTranslate(pos),
							transform: `scaleX(${flip ? -1 : 1})`
						}}
					/>
				)
			})}

			{range(ent.data.length).map(indRaw => {
				const ind = (ent.data.head - indRaw + props.path.length) % props.path.length;
				const isEnd = ind === ent.data.head || ind === (ent.data.head - ent.data.length + 1 + props.path.length) % props.path.length
				const [ img, flip ] = isEnd 
					? getRotatedEndSegment(ind === ent.data.head ? HEAD_IMAGES : BUTT_IMAGES, props.path, ind, ind === ent.data.head) 
					: getRotatedMidSegment(BODY_IMAGES, props.path, ind);
				const pos = props.path[ind];
				return (
					<div 
						ref={entities[indRaw].ref}
						class="size-8 bg-cover absolute transition-[translate] duration-100 z-0"
						style={{
							backgroundColor: ent === entities[0] ? "red" : "transparent",
							background: `url(${img})`,
							translate: posToTranslate(pos),
							transform: `scaleX(${flip ? -1 : 1})`
						}}
					/>
				)
			})}
			
		</Fragment>
	)
}
