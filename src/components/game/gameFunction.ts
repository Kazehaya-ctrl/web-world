import Phaser from "phaser";

var cursors: any;
var player: any

function preload(this: Phaser.Scene) {
  this.load.image("background", "../../assets/sky.png");
  this.load.image("player", "../../assets/star.png")
}

function create(this: Phaser.Scene) {
  this.add.image(Math.random() * 10, Math.random() * 10, "player")
  player = Phaser.GameObjects.Sprite()
  cursors = this.input.keyboard?.createCursorKeys()
}

function update(this: Phaser.Scene) {
  if (cursors.left.isDown) {

  }
}

export { preload, create, update };
