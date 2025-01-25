import Phaser from "phaser";

export class gameFunction extends Phaser.Scene {
	player: Phaser.GameObjects.Sprite | null;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
	speed: number;
	mapHeight: number;
	mapWidth: number;
	constructor() {
		super("scene_1");
		this.player = null;
		this.cursors = null;
		this.speed = 100;
		this.mapHeight = 600;
		this.mapWidth = 800;
	}

	preload() {
		this.load.image("background", "/background.png");
		this.load.spritesheet("player", "/character.png", {
			frameWidth: 32,
			frameHeight: 48,
		});
	}

	create() {
		this.add.image(this.scale.width / 2, this.scale.height / 2, "background");
		this.player = this.add.sprite(100, 250, "player");

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

		this.cursors = this.input.keyboard!.createCursorKeys();
	}

	update() {
		let isMoving = false;

		if (this.cursors!.left.isDown) {
			this.player!.x -= (this.speed * this.game.loop.delta) / 1000;
			this.player!.anims.play("left", true);
			isMoving = true;
		} else if (this.cursors!.right.isDown) {
			this.player!.x += (this.speed * this.game.loop.delta) / 1000;
			this.player!.anims.play("right", true);
			isMoving = true;
		} else if (this.cursors!.up.isDown) {
			this.player!.y -= (this.speed * this.game.loop.delta) / 1000;
			this.player!.anims.play("back", true);
			isMoving = true;
		} else if (this.cursors!.down.isDown) {
			this.player!.y += (this.speed * this.game.loop.delta) / 1000;
			this.player!.anims.play("centre", true);
			isMoving = true;
		}

		if (!isMoving) {
			this.player!.anims.play("idle", true);
		}

		this.player!.x = Phaser.Math.Clamp(this.player!.x, 0, this.mapWidth);
		this.player!.y = Phaser.Math.Clamp(this.player!.y, 0, this.mapHeight);
	}
}
