import Phaser from "phaser";
import { io, Socket } from "socket.io-client";
import { playerDetailSchema } from "../../utils/interface/schema";

export class gameFunction extends Phaser.Scene {
	player: Phaser.Physics.Arcade.Sprite | null;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
	speed: number;
	controls: any;
	socket: Socket | null;
	players: Map<string, Phaser.Physics.Arcade.Sprite> | null;
	playerGroup: Phaser.Physics.Arcade.Group | null;
	constructor() {
		super("scene_1");
		this.player = null;
		this.cursors = null;
		this.speed = 125;
		this.socket = null;
		this.players = new Map();
		this.playerGroup = null;
	}

	preload() {
		this.load.spritesheet("player", "/character.png", {
			frameWidth: 32,
			frameHeight: 48,
		});

		this.load.image(
			"tiles",
			"https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png"
		);
		this.load.tilemapTiledJSON(
			"map",
			"https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json"
		);
	}

	create() {
		this.socket = io('http://localhost:4000', { transports: ['websocket'] })
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

		map.createLayer("Below Player", tileset!, 0, 0);
		const worldLayer = map.createLayer("World", tileset!, 0, 0);
		const aboveLayer = map.createLayer("Above Player", tileset!, 0, 0);

		worldLayer?.setCollisionByProperty({ collides: true });
		aboveLayer?.setDepth(10);

		const spawnPoint: any = map.findObject(
			"Objects",
			(obj) => obj.name === "Spawn Point"
		);

		this.socket?.on('connect', () => {
			console.log('Connected to server');

			this.socket?.on('currentPlayers', (playersList: Map<string, playerDetailSchema>) => {
				console.log('currentPlayers', playersList)
				Object.keys(playersList).forEach((playerId) => {
					if (playerId !== this.socket?.id) {
						this.addPlayer(playersList.get(playerId)!);
					}
				})
			})

			this.socket?.on('newPlayer', (player: playerDetailSchema) => {
				if (player.id !== this.socket?.id) {
					this.addPlayer(player);
				}
				console.log('newPlayer', this.players);
			})

			// this.socket?.on('playerMove', (player: playerDetailSchema) => {
			// 	if (player.id !== this.socket?.id) {
			// 		this.players?.get(player.id!)!.setPosition(player.x, player.y);
			// 	}
			// })

			this.socket?.on('playerDisconnected', (id: string) => {
				const playerSprite = this.players?.get(id);
				if (playerSprite) {
					playerSprite.destroy();
					this.players?.delete(id);
				}
				console.log(`Player Disconnected ${id}`);
			})
		})

		this.player = this.physics.add.sprite(
			spawnPoint!.x,
			spawnPoint!.y,
			"player"
		);

		this.anims.create({
			key: "idle",
			frames: [{ key: "player", frame: 0 }],
			frameRate: 10,
		});

		this.anims.create({
			key: "centre",
			frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: "back",
			frames: this.anims.generateFrameNumbers("player", { start: 12, end: 15 }),
			frameRate: 10,
			repeat: -1,
		});

		this.physics.add.collider(this.player, worldLayer!);
		const camera = this.cameras.main;
		camera.startFollow(this.player);
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		{// this.input.keyboard!.once("keydown-D", (event: any) => {
		// 	// Turn on physics debugging to show player's hitbox
		// 	this.physics.world.createDebugGraphic();

		// 	// Create worldLayer collision graphic above the player, but below the help text
		// 	const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
		// 	worldLayer!.renderDebug(graphics, {
		// 		tileColor: null, // Color of non-colliding tiles
		// 		collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		// 		faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
		// 	});
		// });
		}

		this.cursors = this.input.keyboard!.createCursorKeys();


	}

	addPlayer(playerDetail: playerDetailSchema) {
		const playerSprite = this.physics.add.sprite(playerDetail.x, playerDetail.y, "player");
		this.players?.set(playerDetail.id!, playerSprite);
		this.playerGroup?.add(playerSprite);
	}

	update() {
		this.player?.setVelocity(0);

		if (this.cursors!.left.isDown) {
			this.player!.setVelocityX(-this.speed);
		} else if (this.cursors!.right.isDown) {
			this.player!.setVelocityX(this.speed);
		}

		if (this.cursors!.up.isDown) {
			this.player!.setVelocityY(-this.speed);
		} else if (this.cursors!.down.isDown) {
			this.player!.setVelocityY(this.speed);
		}

		this.player!.body!.velocity.normalize().scale(this.speed);

		if (this.cursors!.left.isDown) {
			this.player!.anims.play("left", true);
		} else if (this.cursors!.right.isDown) {
			this.player!.anims.play("right", true);
		} else if (this.cursors!.up.isDown) {
			this.player!.anims.play("back", true);
		} else if (this.cursors!.down.isDown) {
			this.player!.anims.play("centre", true);
		} else {
			this.player!.anims.play("idle", true);
		}

		// this.socket?.emit('playerMove', {
		// 	id: this.socket?.id,
		// 	x: this.player!.x,
		// 	y: this.player!.y
		// })
		// console.log(`Player positions, { ${this.player!.x}, ${this.player!.y} }`);
	}
}
