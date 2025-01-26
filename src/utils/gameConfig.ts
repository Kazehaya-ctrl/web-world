import Phaser from "phaser";
import { gameFunction } from "../components/game/gameFunction";

var gameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1000,
	height: 800,
	parent: "game-container",
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { x: 0, y: 0 },
			debug: false,
		},
	},
	scene: gameFunction,
};

export default gameConfig;
