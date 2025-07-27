//enemy.js
import { Player } from "./player";

export interface EnemyDefinition {
  id: string;
  position: {x: number, y: number}
  speed: number;
  damage: number;
  health: number;
  isDead: boolean;
  count: number;
  rmkey: string;
}
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  currentScene: Phaser.Scene;
  enemyImage: string;
  enemyFrame: any;

  id: string;
  position: {x: number, y: number};
  speed: number;
  damage: number;
  health: number;
  isDead: boolean;
  count: number;
  rmkey: string;

  canTakeDamage: boolean;
  mobsSpeedIncreaseCount: number;
  enemyDefinition: EnemyDefinition | null;

  nameTag: Phaser.GameObjects.Text | null;
  healthTag: Phaser.GameObjects.Text | null;
  isDevelopmentMode?: boolean;

  declare body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    frame: any,
    id: string,
    position: {x: number, y: number},
    enemySpeed: number,
    enemyDamage: number,
    enemyHealth: number,
    isEnemyDead: boolean,
    enemyAmount: number,
    roomKeys: string,
  ) {
    super(scene, position.x, position.y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.currentScene = scene;
    this.enemyImage = texture;
    this.id = id;

    this.position = position;
    this.speed = enemySpeed;
    this.damage = enemyDamage;
    this.health = enemyHealth;
    this.isDead = isEnemyDead;
    this.count = enemyAmount;
    this.rmkey = roomKeys;

    this.canTakeDamage = true;
    this.setCollideWorldBounds(true);
    this.body.setDrag(50);
    this.body.setDamping(true);
    this.body.immovable = false;

    this.enemyDefinition = null;
    this.nameTag = null;
    this.healthTag = null;

    this.mobsSpeedIncreaseCount = 0;

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

  static createEnemyFromDef(scene: Phaser.Scene, enemyDef: EnemyDefinition): Enemy {
    const enemy = new Enemy(
      scene,
      "enemy",
      undefined,
      enemyDef.id,
      enemyDef.position,
      enemyDef.speed,
      enemyDef.damage,
      enemyDef.health,
      enemyDef.isDead,
      enemyDef.count,
      enemyDef.rmkey,
    );
    enemy.enemyDefinition = enemyDef;
    return enemy;
  }
}
