//enemy.js

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, id, speed, damage, health) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.speed = speed;
    this.damage = damage;
    this.health = health;

    this.isDead = false;

    this.setCollideWorldBounds(true);
    this.body.setDrag(50);
    this.body.setDamping(true);
    this.body.immovable = false;

    this.currentScene = scene;
    this.mobsSpeedIncreaseCount = 0;
  }

  update(time, delta) {
    if (this.isDead) return;
    this.move();
  }

  move() {
    if (this.currentScene.player && !this.currentScene.player.isDead) {
      this.currentScene.physics.moveToObject(this, this.currentScene.player, this.speed);
    } else {
      this.body.setVelocity(0);
    }

    const bounds = this.currentScene.physics.world.bounds;
    this.x = Phaser.Math.Clamp(this.x, bounds.x + this.width / 2, bounds.right - this.width / 2);
    this.y = Phaser.Math.Clamp(this.y, bounds.y + this.height / 2, bounds.bottom - this.height / 2);

    this.increaseSpeedThreshold();
  }

  increaseSpeedThreshold() {
    let playerMaxHealth = this.currentScene.player.mxHealth;
    let currentPlayerHealth = this.currentScene.player.health;
    let currentMobBoostThreshold = playerMaxHealth * 0.5;

    if (currentPlayerHealth < currentMobBoostThreshold && this.mobsSpeedIncreaseCount === 0) {
      this.mobsSpeedIncreaseCount++;
      this.speed += 300;
      console.log(this.speed);
    }
  }
}
