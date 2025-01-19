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

	socket.on(
		"currentPlayers",
		(playersList: { [id: string]: playerDetailSchema }) => {
			console.log("currentPlayer hit" + playersList);
			for (let key in playersList) {
				if (key !== socket.id) {
					addPlayer(this, key, playersList[key]);
				}
			}
			console.log(players);
		}
	);

	socket.on("newPlayer", (newplayerDetail: playerDetailSchema) => {
		if (newplayerDetail.id !== socket.id) {
			console.log("newPlayer hit" + newplayerDetail.id);
			addPlayer(this, newplayerDetail.id!, newplayerDetail);
		}
	});

	socket.on("playersMove", (playerDetail: playerDetailSchema) => {
		console.log(playerDetail);
		if (players[playerDetail.id!] && playerDetail.id !== socket.id) {
			players[playerDetail.id!].x = playerDetail.x;
			players[playerDetail.id!].y = playerDetail.y;
		}
		console.log(players[playerDetail.id!]);
	});

	socket.on("playerDisconnected", (id: string) => {
		if (players[id]) {
			players[id].destroy();
			delete players[id];
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

	if (moved === true) {
		let playerDetail: playerDetailSchema = {
			x: player.x,
			y: player.y,
			id: socket.id,
		};
		socket.emit("playerPosition", playerDetail);
	}
}

export { preload, create, update };
