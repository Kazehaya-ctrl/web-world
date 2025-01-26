import Phaser from "phaser";
import { gameFunction } from "../components/game/gameFunction";

var gameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1000,
	height: 800,
	parent: "game-container",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { x: 0, y: 300 },
			debug: false,
		},
	},
	scene: gameFunction,
};

export default gameConfig;
