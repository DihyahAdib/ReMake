//player.js
import * as Phaser from "phaser";
import { WeaponDefinition, Weapons} from "./weapons";

type DirectionKeys = {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export interface PlayerDefaults {
  id: string;
  x: number;
  y: number;
  texture: string;
  frame: string | number | undefined;
  initialDamage: number;
  initialSpeed: number;
  initialHealth: number;
  level: number;
  name: string;
}

export interface IPlayer extends Phaser.Physics.Arcade.Sprite {
  health: number;
  mxHealth: number;
  isDead: boolean;
  equippedWeapon: Weapons;
  inventory: WeaponDefinition[];
  update: (time: number, delta: number) => void;
  handleMovement: () => void
  takeDamage: (amount: number) => void;
  getPlayerCenterX: () => number;
  getPlayerCenterY: () => number;
}

type PlayerOverrides = Partial<PlayerDefaults>;

export class Player extends Phaser.Physics.Arcade.Sprite {
  currentScene: Phaser.Scene;
  playerImage: string;
  playerFrame: string | number | undefined;
  id: string;
  attackDamage: number;
  speed: number;
  health: number;
  mxHealth: number = 100;
  currentLevel: number;
  playerName: string;
  isDead: boolean = false;
  canDealDamage: boolean = true;
  canTakeDamage: boolean = true;
  damageCooldown: number = 1000;
  inventory: any[] = [];
  keys: DirectionKeys;
  equippedWeapon!: Weapons;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    frame: string | number | undefined,
    id: string,
    x: number,
    y: number,
    attackDamage: number,
    initialSpeed: number,
    initialHealth: number,
    level: number,
    nameTag: string,
  ) {
    super(scene, x, y, texture, frame);

    this.currentScene = scene;
    this.playerImage = texture;
    this.playerFrame = frame;

    this.id = id;
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
    this.handleMovement();
  }

  handleMovement(): void {
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

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    this.disableBody(true, true);
  }

  getPlayerCenterX(): number {
    return (this.body as Phaser.Physics.Arcade.Body).width / 2;
  }

  getPlayerCenterY(): number {
    return (this.body as Phaser.Physics.Arcade.Body).height / 2;
  }
}


/**
 * Returns the default player properties
 */
export const getPlayerDefaults = (x: number, y:number): PlayerDefaults => ({
  id: "Player",
  x,
  y,
  texture: "player",
  frame: undefined,
  initialDamage: 5,
  initialSpeed: 450,
  initialHealth: 100,
  level: 0,
  name: "Bon bon",
});

/**
 * Creates a Player instance and its associated name tag.
 */
export const createPlayerWithTag = (scene: Phaser.Scene, x: number, y: number, overrides: PlayerOverrides = {}): {player: Player, playerNameTag: Phaser.GameObjects.Text} => {
  const defaults = getPlayerDefaults(x, y);
  const playerProps = { ...defaults, ...overrides };

  const player = new Player(
    scene,
    playerProps.texture,
    playerProps.frame,
    playerProps.id,
    playerProps.x,
    playerProps.y,
    playerProps.initialDamage,
    playerProps.initialSpeed,
    playerProps.initialHealth,
    playerProps.level,
    playerProps.name
  );

  const nameTagYOffset =
    (player.displayHeight || (player.body as Phaser.Physics.Arcade.Body).height) / 2 + 10;
  const playerNameTag = scene.add
    .text(player.x, player.y - nameTagYOffset, `|${playerProps.name}|`, {
      font: "26px Arial",
      color: "#ffffff",
      backgroundColor: "#00000080",
      padding: { x: 5, y: 2 },
      align: "center",
    })
    .setOrigin(0.5)
    .setScrollFactor(1);

  return { player, playerNameTag };
};