//weapons.js

export class Weapons extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, id, weaponAttackDamage, weaponAttackCooldown) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.currentScene = scene;
    this.weaponImage = texture;

    this.id = id;
    this.damage = weaponAttackDamage;
    this.Cooldown = weaponAttackCooldown;

    this.isPickedUp = false;
  }

  update(time, delta) {
    if (this.isPickedUp) return;
    const deltaSec = delta / 1000;
    this.dealAttackDamage(deltaSec);
  }
}
