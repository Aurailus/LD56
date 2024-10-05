import { useContext } from "preact/hooks";
import { GameStateContext } from "../contexts/GameState";

export const useGameState = () => {
	return useContext(GameStateContext);
}
