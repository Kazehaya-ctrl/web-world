import Phaser from "phaser";

export class gameFunction extends Phaser.Scene {
	player: Phaser.Physics.Arcade.Sprite | null;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
	speed: number;
	controls: any;
	constructor() {
		super("scene_1");
		this.player = null;
		this.cursors = null;
		this.speed = 100;
	}

	preload() {
		this.load.image("background", "/background.png");
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
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

		const belowLayer = map.createLayer("Below Player", tileset!, 0, 0);
		const worldLayer = map.createLayer("World", tileset!, 0, 0);
		const aboveLayer = map.createLayer("Above Player", tileset!, 0, 0);

		worldLayer?.setCollisionByProperty({ collides: true });
		aboveLayer?.setDepth(10);

		this.player = this.physics.add.sprite(700, 500, "player");

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

		this.cursors = this.input.keyboard!.createCursorKeys();
	}

	update() {
		const speed = 125;

		this.player?.setVelocity(0);

		if (this.cursors!.left.isDown) {
			this.player!.setVelocityX(-speed);
		} else if (this.cursors!.right.isDown) {
			this.player!.setVelocityX(speed);
		}

		if (this.cursors!.up.isDown) {
			this.player!.setVelocityY(-speed);
		} else if (this.cursors!.down.isDown) {
			this.player!.setVelocityY(speed);
		}

		this.player!.body!.velocity.normalize().scale(speed);

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
	}
}
