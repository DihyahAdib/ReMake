//game.js

import {
  getPlayerDefaults,
  createPlayerWithTag,
} from "../src/utils/playerUtils.js";
import { Enemy } from "../src/enemy.js";
import { MenuScene } from "./scenes&menus/mainMenu.js";
import { PauseScene } from "./scenes&menus/pauseMenu.js";
import { SettingScene } from "./scenes&menus/settingsMenu.js";

export const gameWidth = window.myUniqueElectronAPI.screenSize.width;
export const gameHeight = window.myUniqueElectronAPI.screenSize.height;

class GameScene extends Phaser.Scene {
  enemyGroup = null;
  player = null;
  playerNameTag = null;
  playerHpText = null;
  fpsText = null;
  keys = null;
  escText = null;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
    this.load.image("enemy", "assets/Enemy.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#044");

    this.keys = this.input.keyboard.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.escText = this.add
      .text(
        gameWidth / 2,
        gameHeight / 2 + 450,
        "Press Esc to pause the game",
        {
          font: "16px Arial",
          fill: "rgba(0, 0, 0, 0.4)",
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0);

    const xPos = this.cameras.main.centerX;
    const yPos = this.cameras.main.centerY;
    const { player, playerNameTag } = createPlayerWithTag(this, xPos, yPos);
    this.player = player;
    this.playerNameTag = playerNameTag;

    this.enemyGroup = this.physics.add.group();

    const enemyDefinitions = [
      {
        id: "chaser_01",
        xOffset: 100,
        yOffset: -100,
        speed: 150,
        damage: 15,
        health: 50,
      },
      {
        id: "chaser_02",
        xOffset: -200,
        yOffset: 50,
        speed: 100,
        damage: 15,
        health: 40,
      },
      {
        id: "chaser_03",
        xOffset: 300,
        yOffset: 200,
        speed: 100,
        damage: 15,
        health: 70,
      },
    ];

    enemyDefinitions.forEach((enemyData) => {
      const enemyX = this.cameras.main.centerX + enemyData.xOffset;
      const enemyY = this.cameras.main.centerY + enemyData.yOffset;
      const newEnemy = new Enemy(
        this,
        enemyX,
        enemyY,
        "enemy",
        null,
        enemyData.id,
        enemyData.speed,
        enemyData.damage,
        enemyData.health
      );
      this.enemyGroup.add(newEnemy);
    });

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
    if (this.player && !this.player.isDead) {
      this.player.update(time, delta);
      this.playerHpText.setText(`HP: ${this.player.health}`);
      const nameTagYOffset = this.player.displayHeight / 2 + 10;
      this.playerNameTag.x = this.player.x;
      this.playerNameTag.y = this.player.y - nameTagYOffset;
    }

    if (this.enemyGroup) {
      this.enemyGroup.children.each(function (enemy) {
        if (enemy.active) {
          enemy.update(time, delta);
        }
      }, this);
    }

    if (this.keys.Esc.isDown && !this.scene.isActive("PauseScene")) {
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    }

    this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
  }

  handlePlayerEnemyOverlap(player, enemy) {
    player.takeDamage(enemy.damage);
  }
}

export class TutorialScene extends Phaser.Scene {
  player = null;
  playerNameTag = null;
  keys = null;

  constructor() {
    super({ key: "TutorialScene" });
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("rgb(192, 192, 192)");

    const xPos = this.cameras.main.centerX;
    const yPos = this.cameras.main.centerY;

    const { player, playerNameTag } = createPlayerWithTag(this, xPos, yPos, {
      initialSpeed: 150,
    });
    this.player = player;
    this.playerNameTag = playerNameTag;

    this.add
      .text(xPos, 100, "Welcome to the Tutorial!", {
        fontSize: "40px",
        fill: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(xPos, yPos + 150, "Use WASD to move", {
        fontSize: "24px",
        fill: "#000",
        align: "center",
      })
      .setOrigin(0.5);
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta);
      const nameTagYOffset = this.player.displayHeight / 2 + 10;
      this.playerNameTag.x = this.player.x;
      this.playerNameTag.y = this.player.y - nameTagYOffset;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "game-container",
    width: gameWidth,
    height: gameHeight,
  },
  scene: [MenuScene, TutorialScene, GameScene, SettingScene, PauseScene],
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
