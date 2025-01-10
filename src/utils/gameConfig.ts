import Phaser from "phaser";
import { preload, create, update } from "../components/game/gameFunction";

var gameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: {
		preload,
		create,
		update,
	},
};

const game = new Phaser.Game(gameConfig);

export default game;
