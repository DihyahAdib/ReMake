//player.js

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    frame,
    attackDamage,
    initialSpeed,
    initialHealth
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5);
    this.setCollideWorldBounds(true);
    this.body.setDamping(true);
    this.body.setDrag(100);

    this.body.immovable = true;

    this.currentScene = scene;
    this.attackDamage = attackDamage;
    this.speed = initialSpeed;
    this.health = initialHealth;
    this.mxHealth = 100;

    this.isDead = false;
    this.canTakeDamage = true;
    this.damageCooldownDuration = 500;

    this.keys = this.currentScene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  update(time, delta) {
    if (this.isDead) return;
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
    this.x += moveX * this.speed * dt;
    this.y += moveY * this.speed * dt;

    this.body.setVelocity(moveX * this.speed, moveY * this.speed);
  }

  takeDamage(amount) {
    if (!this.canTakeDamage || this.isDead) {
      return;
    }

    this.health -= amount;
    console.log(`Player health: ${this.health}`);

    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }

    this.canTakeDamage = false;
    this.setTint(0xff0000);

    this.currentScene.time.delayedCall(
      this.damageCooldownDuration,
      () => {
        this.canTakeDamage = true;
        this.clearTint();
      },
      [],
      this
    );
  }

  die() {
    this.isDead = true;
    this.body.setVelocity(0, 0);
    this.disableBody(true, true);
    console.log("Player defeated!");
  }
}
