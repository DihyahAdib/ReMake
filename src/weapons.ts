//weapons.js
export interface WeaponDefinition {
  scene: Phaser.Scene;
  texture: string;
  frame: string | number | undefined;
  id: string;
  x: number;
  y: number;
  damage: number;
  cooldown: number;
  speed: number;
  pickedUp: boolean;
  rmkey: string;
}

export interface WeaponMethods {
  shoot: (originX: number, originY: number, pointer: Phaser.Input.Pointer) => void;
  createWeaponFromDefinition: (scene: Phaser.Scene, weaponDef: WeaponDefinition) => Weapons;
}

export class Weapons extends Phaser.GameObjects.Sprite {
  iWeaponData: WeaponDefinition;
  currentScene: Phaser.Scene;
  weaponTexture: string;
  weaponFrame: string | number | undefined;
  id: string;
  damage: number;
  cooldown: number;
  speed: number;
  rmkey: string;
  isOnCooldown: boolean = false;
  projectileGroup: Phaser.Physics.Arcade.Group;

  declare body: Phaser.Physics.Arcade.Body;

  private constructor(
    scene: Phaser.Scene,
    texture: string ,
    frame: string | number | undefined,
    id: string,
    x: number,
    y: number,
    weaponAttackDamage: number,
    weaponAttackCooldown: number,
    projectileSpeed: number,
    roomKeys: string,
    iWeaponData: WeaponDefinition
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.iWeaponData = iWeaponData;
    this.currentScene = scene;
    this.weaponTexture = texture;
    this.weaponFrame = frame;
    this.id = id;
    this.x = x;
    this.y = y;
    this.damage = weaponAttackDamage;
    this.cooldown = weaponAttackCooldown;
    this.speed = projectileSpeed;
    this.rmkey = roomKeys;
    this.projectileGroup = scene.physics.add.group();
  }

  /**
   * Static factory method to create a weapons instance from a definition object.
   * @param scene The Phaser.Scene instance.
   * @param weaponDef The WeaponDefinition object containing weapon properties.
   * @returns A new Weapons instance.
   */
  static createWeaponFromDefinition(scene: Phaser.Scene, weaponDef: WeaponDefinition): Weapons {
    const x = weaponDef.x ?? scene.cameras.main.centerX;
    const y = weaponDef.y ?? scene.cameras.main.centerY;
    const weapon = new Weapons(
      scene, 
      weaponDef.texture, 
      weaponDef.frame, 
      weaponDef.id, 
      x, 
      y, 
      weaponDef.damage, 
      weaponDef.cooldown, 
      weaponDef.speed, 
      weaponDef.rmkey, 
      weaponDef);
    return weapon;
  }

  shoot(originX: number, originY: number, pointer: Phaser.Input.Pointer): void {
    if (this.isOnCooldown) return;

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
