import Phaser from "phaser";
import { preload, create, update } from "../components/game/gameFunction";

var gameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 500,
	height: 500,
	parent: "phaser-game",
	scene: {
		preload,
		create,
		update,
	},
};

export default gameConfig;
