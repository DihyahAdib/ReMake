//weapons.js

interface WeaponDefinition {
  id: string;
  x?: number;
  y?: number;
  damage: number;
  cooldown: number;
  speed: number;
  pickedUp?: boolean;
}

export class Weapons extends Phaser.GameObjects.Sprite {
  public currentScene: Phaser.Scene; 
  public weaponImage: string;
  public id: string;
  public damage: number;
  public cooldown: number;
  public speed: number;
  public projectileGroup: Phaser.Physics.Arcade.Group;
  public isOnCooldown: boolean = false;

  declare body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string ,
    frame: string | number | undefined,
    id: string,
    weaponAttackDamage: number,
    weaponAttackCooldown: number,
    projectileSpeed: number
  ) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.currentScene = scene;
    this.weaponImage = texture;
    this.id = id;
    this.damage = weaponAttackDamage;
    this.cooldown = weaponAttackCooldown;
    this.speed = projectileSpeed;

    this.projectileGroup = scene.physics.add.group();
  }

  /**
   * Static factory method to create a weapons instance from a definition object.
   * @param scene The Phaser.Scene instance.
   * @param weaponDef The WeaponDefinition object containing weapon properties.
   * @returns A new Weapons instance.
   */

  static createWeaponFromDef(scene: Phaser.Scene, weaponDef: WeaponDefinition) {
    const x = weaponDef.x ?? scene.cameras.main.centerX;
    const y = weaponDef.y ?? scene.cameras.main.centerY;
    const weapon = new Weapons(
      scene,
      x,
      y,
      "basicShooterImg",
      undefined,
      weaponDef.id,
      weaponDef.damage,
      weaponDef.cooldown,
      weaponDef.speed
    );
    weapon.setScale(0.15);
    return weapon;
  }

  shoot(originX: number, originY: number, pointer: Phaser.Input.Pointer): void {
    if (this.isOnCooldown) {
      return;
    }
    this.isOnCooldown = true;

    this.currentScene.time.delayedCall(this.cooldown, () => {
      this.isOnCooldown = false;
    });

    const projectile = this.currentScene.add.circle(originX, originY, 5, 0xff0000);
    this.currentScene.physics.add.existing(projectile);
    this.projectileGroup.add(projectile);

    const projectileBody = projectile.body as Phaser.Physics.Arcade.Body;

    const angle = Phaser.Math.Angle.Between(originX, originY, pointer.worldX, pointer.worldY);

    const velocity = this.currentScene.physics.velocityFromRotation(angle, this.speed);

    projectileBody.setVelocity(velocity.x, velocity.y);
    projectileBody.setCollideWorldBounds(true);
    projectileBody.onWorldBounds = true;

    projectileBody.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      if (body.gameObject === projectile) {
        projectile.destroy();
      }
    });

    projectileBody.setAllowGravity(false);
  }
}
