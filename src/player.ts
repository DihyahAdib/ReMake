//player.js
import Phaser from "phaser";
import { Weapons } from "./weapons.ts";

type DirectionKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  public currentScene: Phaser.Scene;
  public attackDamage: number;
  public speed: number;
  public health: number;
  public mxHealth: number = 100;
  public currentLevel: number;
  public playerName: string;
  public isDead: boolean = false;
  public canDealDamage: boolean = true;
  public canTakeDamage: boolean = true;
  public damageCooldown: number = 1000;
  public inventory: unknown[] = [];
  public keys: DirectionKeys;
  public equippedWeapon?: Weapons;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string | number,
    attackDamage: number,
    initialSpeed: number,
    initialHealth: number,
    level: number,
    nameTag: string
  ) {
    super(scene, x, y, texture, frame);

    this.currentScene = scene;
    this.attackDamage = attackDamage;
    this.speed = initialSpeed;
    this.health = initialHealth;
    this.currentLevel = level;
    this.playerName = nameTag;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setOrigin(0.5);
    (this.body as Phaser.Physics.Arcade.Body).setDamping(true);
    (this.body as Phaser.Physics.Arcade.Body).setDrag(100);

    this.keys = this.currentScene!.input!.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as DirectionKeys;

    this.currentScene.input.on("pointerdown", () => {
      if (this.equippedWeapon) {
        this.equippedWeapon.shoot(this.x, this.y, this.currentScene.input.activePointer);
      }
    });
  }

  update(time: number, delta: number): void {
    if (this.isDead) return;
    const deltaSec = delta / 1000;
    this.handleMovement(deltaSec);
  }

  handleMovement(deltaSec: number): void {
    let moveX = 0;
    let moveY = 0;

    if (this.keys.up.isDown) moveY = -1;
    if (this.keys.down.isDown) moveY = 1;
    if (this.keys.left.isDown) moveX = -1;
    if (this.keys.right.isDown) moveX = 1;

    if (moveX !== 0 && moveY !== 0) {
      const factor = Math.SQRT1_2;
      moveX *= factor;
      moveY *= factor;
    }

    this.setVelocity(moveX * this.speed, moveY * this.speed);
  }

  takeDamage(amount: number): void {
    if (!this.canTakeDamage || this.isDead) return;

    this.health -= amount;
    console.log(`Player health: ${this.health}`);

    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }

    this.canTakeDamage = false;
    this.setTint(0xff0000);

    this.currentScene.time.delayedCall(
      this.damageCooldown,
      () => {
        this.canTakeDamage = true;
        this.clearTint();
      },
      [],
      this
    );
  }

  public die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.disableBody(true, true);
  }

  setWeapon(weapon: Weapons): void {
    this.equippedWeapon = weapon;
  }

  getWeapon(): Weapons | undefined {
    return this.equippedWeapon;
  }
}
