import Phaser from "phaser";
import { gameFunction } from "../components/game/gameFunction";

var gameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 400,
	parent: "phaser-game",
	scene: gameFunction,
};

export default gameConfig;
