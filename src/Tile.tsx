export const Tile = {
	Ground: 0,
	Wall: 1,
	RoughGround: 2,
	Water: 3
} as const;

const CHAR_TO_TILE: Record<string, number> = {
	"#": Tile.Wall,
	".": Tile.Ground,
	"/": Tile.RoughGround,
	"^": Tile.Water
}

export const loadLevelTiles = (level: string): number[][] =>
	level.split("\n").filter(s => s.trim()).map(line => line.trim().split("").map(ch => CHAR_TO_TILE[ch]));
