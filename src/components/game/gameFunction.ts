import Phaser from "phaser";
import socket from "../utils/socketConnection";
import { playerDetailSchema } from "../../utils/interface/schema";

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let players: { [id: string]: Phaser.GameObjects.Sprite } = {};
let player: Phaser.GameObjects.Sprite;

function preload(this: Phaser.Scene) {
	this.load.image("background", "./sky.png");
	this.load.image("player", "./star.png");
}

function create(this: Phaser.Scene) {
	this.add.image(this.scale.width / 2, this.scale.height / 2, "background");

	player = this.add.sprite(
		Math.random() * this.scale.width,
		Math.random() * this.scale.height,
		"player"
	);
	cursors = this.input.keyboard!.createCursorKeys();

	socket.on("newPlayer", (newplayerDetail: playerDetailSchema) => {
		if (newplayerDetail.id !== socket.id) {
			addPlayer(this, newplayerDetail.id!, newplayerDetail);
		}
	});
}

function addPlayer(
	scene: Phaser.Scene,
	playerSocketId: string,
	playerDetailSchema: playerDetailSchema
) {
	players[playerSocketId] = scene.add.sprite(
		playerDetailSchema.x,
		playerDetailSchema.y,
		"player"
	);
}

function update(this: Phaser.Scene) {
	if (!cursors || !player) return;

	const speed = 200;
	let moved = false;

	if (cursors.left.isDown) {
		player.x -= (speed * this.game.loop.delta) / 1000;
		moved = true;
	}
	if (cursors.right.isDown) {
		player.x += (speed * this.game.loop.delta) / 1000;
		moved = true;
	}
	if (cursors.up.isDown) {
		player.y -= (speed * this.game.loop.delta) / 1000;
		moved = true;
	}
	if (cursors.down.isDown) {
		player.y += (speed * this.game.loop.delta) / 1000;
		moved = true;
	}
}

export { preload, create, update };
