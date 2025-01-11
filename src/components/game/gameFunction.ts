import Phaser from "phaser";
import socket from "../utils/socketConnection";

interface playerCoordiSchema {
	x: number;
	y: number;
	id?: string;
}

let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let player: Phaser.GameObjects.Sprite;
let players: { [id: string]: Phaser.GameObjects.Sprite } = {};

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

	socket.on("newPlayer", (playerCoordi: playerCoordiSchema) => {
		addPlayer(this, playerCoordi.id!, playerCoordi);
	});

	socket.on(
		"currentPlayers",
		(playerList: { [id: string]: playerCoordiSchema }) => {
			console.log(playerList);
			for (const id in playerList) {
				if (id == socket.id) continue;
				addPlayer(this, id, playerList[id]);
			}
		}
	);

	socket.on("playerMove", (playerData: playerCoordiSchema) => {
		if (players[playerData.id!]) {
			players[playerData.id!].x = playerData.x;
			players[playerData.id!].y = playerData.y;
		}
	});

	socket.on("playerDisconnect", (id: string) => {
		if (players[id]) {
			players[id].destroy();
			delete players[id];
		}
	});
}

function addPlayer(
	scene: Phaser.Scene,
	playerId: string,
	playerCoordi: playerCoordiSchema
) {
	players[playerId] = scene.add.sprite(
		playerCoordi.x,
		playerCoordi.y,
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

	if (moved) {
		socket.emit("playerMove", { id: socket.id, x: player.x, y: player.y });
	}
}

export { preload, create, update };
