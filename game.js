//game.js
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

class GameScene extends Phaser.Scene {
  enemyGroup = null;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("player", "assets/cat.webp");
    this.load.image("enemy", "assets/enemy.webp");
  }

  create() {
    const xPos = this.cameras.main.centerX;
    const yPos = this.cameras.main.centerY;
    const playerFrame = null;
    const playerInitialDamage = 5;
    const playerInitialHealth = 100;
    const playerInitialSpeed = 260;

    this.player = new Player(
      this,
      xPos,
      yPos,
      "player",
      playerFrame,
      playerInitialDamage,
      playerInitialSpeed,
      playerInitialHealth
    );

    this.enemyGroup = this.physics.add.group();

    const enemyX = this.cameras.main.centerX + 100;
    const enemyY = this.cameras.main.centerY - 100;
    const enemyTexture = "enemy";
    const enemyFrame = null;
    const enemyId = "chaser_01";
    const enemySpeed = 150;
    const enemyDamage = 15;
    const enemyHealth = 50;

    const newEnemy = new Enemy(
      this,
      enemyX,
      enemyY,
      enemyTexture,
      enemyFrame,
      enemyId,
      enemySpeed,
      enemyDamage,
      enemyHealth
    );

    const enemy2X = this.cameras.main.centerX - 200;
    const enemy2Y = this.cameras.main.centerY + 50;
    const enemy2Texture = "enemy";
    const enemy2Frame = null;
    const enemy2Id = "chaser_02";
    const enemy2Speed = 100;
    const enemy2Damage = 15;
    const enemy2Health = 40;

    const newEnemy2 = new Enemy(
      this,
      enemy2X,
      enemy2Y,
      enemy2Texture,
      enemy2Frame,
      enemy2Id,
      enemy2Speed,
      enemy2Damage,
      enemy2Health
    );

    const enemy3X = this.cameras.main.centerX + 300;
    const enemy3Y = this.cameras.main.centerY + 200;
    const enemy3Texture = "enemy";
    const enemy3Frame = null;
    const enemy3Id = "chaser_03";
    const enemy3Speed = 100;
    const enemy3Damage = 15;
    const enemy3Health = 70;

    const newEnemy3 = new Enemy(
      this,
      enemy3X,
      enemy3Y,
      enemy3Texture,
      enemy3Frame,
      enemy3Id,
      enemy3Speed,
      enemy3Damage,
      enemy3Health
    );

    this.enemyGroup.add(newEnemy);
    this.enemyGroup.add(newEnemy2);
    this.enemyGroup.add(newEnemy3);

    this.physics.add.collider(this.player, this.enemyGroup);

    this.physics.add.overlap(
      this.player,
      this.enemyGroup,
      this.handlePlayerEnemyOverlap,
      null,
      this
    );

    this.playerHpText = this.add.text(10, 30, `HP: ${this.player.health}`, {
      font: "16px Arial",
      fill: "#ffffff",
    });

    this.playerHpText.setScrollFactor(0);

    this.fpsText = this.add.text(10, 10, "FPS:", {
      font: "16px Arial",
      fill: "#ffffff",
    });

    this.fpsText.setScrollFactor(0);
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta);
      this.playerHpText.setText(`HP: ${this.player.health}`);
    }

    if (this.enemyGroup) {
      this.enemyGroup.children.each(function (enemy) {
        if (enemy.active) {
          enemy.update(time, delta);
        }
      }, this);
    }

    this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
  }

  handlePlayerEnemyOverlap(player, enemy) {
    player.takeDamage(enemy.damage);
  }
}

const sizes = {
  width: 1420,
  height: 800,
};

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  backgroundColor: "#000000",
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
    fps: {
      target: Infinity,
      forceSetTimeOut: false,
    },
  },
};

const game = new Phaser.Game(config);
