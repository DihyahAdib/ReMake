//enemy.js
import { Player } from "./player.ts";

interface enemyDefinition {
  id: string;
  x: number;
  y: number;
  speed: number;
  damage: number;
  health: number;
  isDead: boolean;
  count: number;
}
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public id: string;
  public speed: number;
  public damage: number;
  public health: number;
  public isDead: boolean;
  public count: number;
  public canTakeDamage: boolean;
  public mobsSpeedIncreaseCount: number;
  public enemyDefinition: enemyDefinition | null;
  public nameTag: Phaser.GameObjects.Text | null;
  public healthTag: Phaser.GameObjects.Text | null;
  public currentScene: Phaser.Scene;
  public isDevelopmentMode?: boolean;

  declare body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string | number | undefined,
    id: string,
    enemySpeed: number,
    enemyDamage: number,
    enemyHealth: number,
    isEnemyDead: boolean,
    enemyAmount: number,
    isDevelopmentMode?: boolean
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

  createTags(): void {
    this.nameTag = this.currentScene.add
      .text(this.x, this.y - this.displayHeight / 2 - 10, this.id, {
        font: "12px Arial",
        color: "#FFD700",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(11);
    this.healthTag = this.currentScene.add
      .text(this.x, this.y - this.displayHeight / 2 - 25, `HP: ${this.health}`, {
        font: "12px Arial",
        color: "#FF0000",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(11);
  }

  update(time: number, delta: number): void {
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

  takeDamage(amount: number): void {
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

  move(): void {
    const player = (this.currentScene as any).player as Player;
    if (player && !player.isDead) {
      this.currentScene.physics.moveToObject(this, player, this.speed);
    } else {
      this.body.setVelocity(0);
    }

    const bounds = this.currentScene.physics.world.bounds;
    this.x = Phaser.Math.Clamp(this.x, bounds.x + this.width / 2, bounds.right - this.width / 2);
    this.y = Phaser.Math.Clamp(this.y, bounds.y + this.height / 2, bounds.bottom - this.height / 2);

    this.increaseSpeedThreshold();
  }

  increaseSpeedThreshold(): void {
    const player = (this.currentScene as any).player as Player;

    let playerMaxHealth = player.mxHealth;
    let currentPlayerHealth = player.health;
    let currentMobBoostThreshold = playerMaxHealth * 0.5;

    if (currentPlayerHealth < currentMobBoostThreshold && this.mobsSpeedIncreaseCount === 0) {
      this.mobsSpeedIncreaseCount++;
      this.speed += 300;
      console.log(this.speed);
    }
  }

  die(): void {
    this.isDead = true;
    this.body.setVelocity(0, 0);
    this.disableBody(true, true);

    if (this.enemyDefinition) {
      this.enemyDefinition.isDead = true;
      console.log(`Enemy ${this.id} marked as dead in room data.`);
    }

    this.destroy();
  }

  /**
   * Overrides the default Phaser.GameObjects.Sprite destroy method.
   * This ensures that associated game objects like nameTag and healthTag are also destroyed
   * when the enemy sprite itself is destroyed (e.g., when clearing a group).
   * @param {boolean} [fromScene] - Whether this destroy call originated from the Scene.
   */
  destroy(fromScene?: boolean): void {
    if (this.nameTag) {
      this.nameTag.destroy();
      this.nameTag = null;
    }
    if (this.healthTag) {
      this.healthTag.destroy();
      this.healthTag = null;
    }
    super.destroy(fromScene);
  }

  static createEnemyFromDef(scene: Phaser.Scene, enemyDef: enemyDefinition): Enemy {
    const enemy = new Enemy(
      scene,
      scene.cameras.main.centerX + enemyDef.x,
      scene.cameras.main.centerY + enemyDef.y,
      "enemy",
      undefined,
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
