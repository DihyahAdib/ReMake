//weapons.js

export class Weapons extends Phaser.GameObjects.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    frame,
    id,
    weaponAttackDamage,
    weaponAttackCooldown,
    projectileSpeed
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

  static createWeaponFromDef(scene, weaponDef) {
    const weapon = new Weapons(
      scene,
      weaponDef.x || scene.getCurrentGameCenterX(),
      weaponDef.y || scene.getCurrentGameCenterY(),
      "basicShooterImg",
      null,
      weaponDef.id,
      weaponDef.damage,
      weaponDef.cooldown,
      weaponDef.speed
    );
    weapon.setScale(0.15);
    return weapon;
  }

  shoot(originX, originY, pointer) {
    if (this.isOnCooldown) return;
    this.isOnCooldown = true;
    this.currentScene.time.delayedCall(this.cooldown, () => {
      this.isOnCooldown = false;
    });

    const projectile = this.currentScene.add.circle(originX, originY, 5, 0xff0000);
    this.currentScene.physics.add.existing(projectile);
    this.projectileGroup.add(projectile);

    const angle = Phaser.Math.Angle.Between(originX, originY, pointer.worldX, pointer.worldY);
    const velocity = this.currentScene.physics.velocityFromRotation(angle, this.speed);

    projectile.body.setVelocity(velocity.x, velocity.y);
    projectile.body.setCollideWorldBounds(true);
    projectile.body.onWorldBounds = true;
    projectile.body.world.on("worldbounds", (body) => {
      if (body.gameObject === projectile) {
        projectile.destroy();
      }
    });

    projectile.body.setAllowGravity(false);
  }
}
