//player.js

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5);
    this.setCollideWorldBounds(true);
    this.body.setDamping(true);
    this.body.setDrag(100);

    this.playerSpeed = 260;
    this.health = 100;

    this.currentScene = scene;

    this.keys = this.currentScene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time, delta) {
    const deltaSec = delta / 1000;
    this.handleMovement(deltaSec);
  }

  handleMovement(dt) {
    let moveX = 0;
    let moveY = 0;

    if (this.keys.up.isDown) moveY = -1;
    if (this.keys.down.isDown) moveY = 1;
    if (this.keys.left.isDown) moveX = -1;
    if (this.keys.right.isDown) moveX = 1;

    if (moveX !== 0 && moveY !== 0) {
      const factor = Math.sqrt(0.5);
      moveX *= factor;
      moveY *= factor;
    }
    this.x += moveX * this.playerSpeed * dt;
    this.y += moveY * this.playerSpeed * dt;
  }
}
