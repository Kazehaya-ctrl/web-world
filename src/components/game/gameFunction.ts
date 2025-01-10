import Phaser from "phaser";
import socket from "../utils/socketConnection";

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let player: Phaser.GameObjects.Sprite;
let playerMove: boolean = false;

function preload(this: Phaser.Scene) {
	this.load.image("background", "./assets/sky.png");
	this.load.image("player", "./assets/star.png");
}

function create(this: Phaser.Scene) {
	this.add.image(this.scale.width / 2, this.scale.height / 2, "background");
	player = this.add.sprite(
		Math.random() * this.scale.width,
		Math.random() * this.scale.height,
		"player"
	);
	cursors = this.input.keyboard!.createCursorKeys();
}

function update(this: Phaser.Scene) {
	if (!cursors || !player) return;

	const speed = 200;

	if (cursors.left.isDown) {
		player.x -= (speed * this.game.loop.delta) / 1000;
		playerMove = true;
	}
	if (cursors.right.isDown) {
		player.x += (speed * this.game.loop.delta) / 1000;
		playerMove = true;
	}
	if (cursors.up.isDown) {
		player.y += (speed * this.game.loop.delta) / 1000;
		playerMove = true;
	}
	if (cursors.down.isDown) {
		player.x -= (speed * this.game.loop.delta) / 1000;
		playerMove = true;
	}

	if (playerMove) {
		socket.emit("playerMove", { x: player.x, y: player.y });
	}
}

export { preload, create, update };
