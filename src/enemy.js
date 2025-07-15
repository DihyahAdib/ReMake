//enemy.js

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    frame,
    id,
    enemySpeed,
    enemyDamage,
    enemyHealth,
    isEnemyDead,
    enemyAmount
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.id = id;
    this.speed = enemySpeed;
    this.damage = enemyDamage;
    this.health = enemyHealth;
    this.isDead = isEnemyDead;
    this.count = enemyAmount;

    this.canTakeDamage = true;
    this.setCollideWorldBounds(true);
    this.body.setDrag(50);
    this.body.setDamping(true);
    this.body.immovable = false;

    this.currentScene = scene;
    this.mobsSpeedIncreaseCount = 0;

    this.enemyDefinition = null;
    this.nameTag = null;
    this.healthTag = null;

    this.createTags();
  }

  createTags() {
    this.nameTag = this.currentScene.add
      .text(this.x, this.y - this.displayHeight / 2 - 10, this.id, {
        font: "12px Arial",
        fill: "#FFD700",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(11);
    this.healthTag = this.currentScene.add
      .text(this.x, this.y - this.displayHeight / 2 - 25, `HP: ${this.health}`, {
        font: "12px Arial",
        fill: "#FF0000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(11);
  }

  update(time, delta) {
    if (this.isDead) {
      if (this.nameTag) this.nameTag.setVisible(false);
      if (this.healthTag) this.healthTag.setVisible(false);
      return;
    }
    this.move();

    if (this.nameTag) {
      this.nameTag.x = this.x;
      this.nameTag.y = this.y - this.displayHeight / 2 - 10;
    }
    if (this.healthTag) {
      this.healthTag.x = this.x;
      this.healthTag.y = this.y - this.displayHeight / 2 - 25;
      this.healthTag.setText(`HP: ${this.health}`);
    }
  }

  takeDamage(amount) {
    if (this.canTakeDamage && !this.isDead && this.active) {
      this.health -= amount;
      console.log(`Enemy ${this.health}`);
      if (this.health <= 0) {
        this.health = 0;
        this.die();
      }
      this.canTakeDamage = false;
      this.currentScene.time.delayedCall(
        200,
        () => {
          this.canTakeDamage = true;
        },
        [],
        this
      );
    }
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

  die() {
    this.isDead = true;
    this.body.setVelocity(0, 0);
    this.disableBody(true, true);
    this.destroy();

    if (this.nameTag) {
      this.nameTag.destroy();
      this.nameTag = null;
    }

    if (this.healthTag) {
      this.healthTag.destroy();
      this.healthTag = null;
    }

    if (this.enemyDefinition) {
      this.enemyDefinition.isDead = true;
      console.log(`Enemy ${this.id} marked as dead in room data.`);
    }
  }

  static createEnemyFromDef(scene, enemyDef) {
    const enemy = new Enemy(
      scene,
      scene.cameras.main.centerX + enemyDef.xOffset,
      scene.cameras.main.centerY + enemyDef.yOffset,
      "enemy",
      null,
      enemyDef.id,
      enemyDef.speed,
      enemyDef.damage,
      enemyDef.health,
      enemyDef.isDead,
      enemyDef.count
    );
    enemy.enemyDefinition = enemyDef;
    return enemy;
  }
}
