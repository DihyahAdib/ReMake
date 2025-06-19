//game.js

import { gameHeight, gameWidth } from "./utils/screenUtils.js";
import { MenuScene } from "./scenes&menus/mainMenu.js";
import { TutorialScene } from "./scenes&menus/tutorialScene.js";
import { Enemy } from "../src/enemy.js";
import { PauseScene } from "./scenes&menus/pauseMenu.js";
import { SettingScene } from "./scenes&menus/settingsMenu.js";
import { createPlayerWithTag } from "../src/utils/playerUtils.js";

// PUT THIS GAMESCENE CLASS IN ITS OWN FILE
class GameScene extends Phaser.Scene {
  enemyGroup = null;
  doorGroup = null;
  roomContentGroup = null;
  player = null;
  playerNameTag = null;
  playerHpText = null;
  fpsText = null;
  keys = null;
  escText = null;

  rooms = {
    room1: {
      background: "room1_bg",
      connections: {
        right: "room2",
      },
      playerSpawnPoints: {
        right: { x: 150, y: gameHeight / 2 },
        default: { x: gameWidth / 2, y: gameHeight / 2 + 50 },
      },
    },

    room2: {
      background: "room2_bg",
      connections: {
        left: "room1",
        right: "room3",
        up: "room4",
      },
      playerSpawnPoints: {
        left: { x: 700, y: 300 },
        right: { x: 100, y: 300 },
        down: { x: 400, y: 100 },
      },
    },
  };

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
    this.load.image("enemy", "assets/Enemy.png");
    this.load.image("room1_bg", "assets/room1_background.png");
    this.load.image("room2_bg", "assets/room2_background.png");
    this.load.image("door_trigger", "assets/door_trigger_placeholder.png");
  }

  create() {
    console.log("The Game Scene Has Been Instantiated");
    this.cameras.main.fadeIn(500, 0, 0, 0);
    // this.cameras.main.setBackgroundColor("rgb(0, 68, 68)");

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

    this.currentRoomKey = "room1";
    this.loadRoom(this.currentRoomKey);

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

  loadRoom(roomKey, entryDirection = null) {
    if (this.roomContentGroup) {
      this.roomContentGroup.clear(true, true);
    }
    if (this.doorGroup) {
      this.doorGroup.clear(true, true);
    }
    if (this.enemyGroup) {
      this.enemyGroup.clear(true, true);
    } else {
      this.enemyGroup = this.physics.add.group();
    }

    this.roomContentGroup = this.add.group();
    this.doorGroup = this.physics.add.staticGroup();

    const roomData = this.rooms[roomKey];
    if (!roomData) {
      console.error(`Room data not found for key: ${roomKey}`);
      return;
    }

    this.currentRoomKey = roomKey;

    const bg = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      roomData.background
    );
    bg.setOrigin(0.5);
    bg.setDepth(-1);
    this.roomContentGroup.add(bg);

    let spawnPoint = roomData.playerSpawnPoints[entryDirection];
    if (!spawnPoint) {
      spawnPoint = roomData.playerSpawnPoints.default || {
        x: this.cameras.main.centerX,
        y: this.cameras.main.centerY + 50,
      };
    }
    this.player.setPosition(spawnPoint.x, spawnPoint.y);

    this.createRoomDoors(roomData.connections);

    if (roomData.enemies && roomData.enemies.length > 0) {
      roomData.enemies.forEach((enemyDef) => {
        const enemyX = this.cameras.main.centerX + enemyDef.xOffset;
        const enemyY = this.cameras.main.centerY + enemyDef.yOffset;
        const newEnemy = new Enemy(
          this,
          enemyX,
          enemyY,
          "enemy",
          null,
          enemyDef.id,
          enemyDef.speed,
          enemyDef.damage,
          enemyDef.health
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
    }
    // (Later: Add logic here to spawn enemies, items based on roomData)
    console.log(`Loaded room: ${roomKey}`);
  }

  createRoomDoors(connections) {
    const doorThickness = 20; // How thick the invisible door trigger is
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // Right Door
    if (connections.right) {
      const door = this.doorGroup.create(
        screenWidth - doorThickness / 2,
        screenHeight / 2,
        "door_trigger"
      );
      door.setVisible(false);
      door.setOrigin(0.5);
      door.displayWidth = doorThickness;
      door.displayHeight = screenHeight;
      door.setData("targetRoom", connections.right);
      door.setData("entryDirection", "left");
      door.body.allowGravity = false;
      door.body.setImmovable(true);
    }
    // Left Door
    if (connections.left) {
      const door = this.doorGroup.create(
        doorThickness / 2,
        screenHeight / 2,
        "door_trigger"
      );
      door.setVisible(false);
      door.setOrigin(0.5);
      door.displayWidth = doorThickness;
      door.displayHeight = screenHeight;
      door.setData("targetRoom", connections.left);
      door.setData("entryDirection", "right");
      door.body.allowGravity = false;
      door.body.setImmovable(true);
    }
    // Up Door
    if (connections.up) {
      const door = this.doorGroup.create(
        screenWidth / 2,
        doorThickness / 2,
        "door_trigger"
      );
      door.setVisible(false);
      door.setOrigin(0.5);
      door.displayWidth = screenWidth;
      door.displayHeight = doorThickness;
      door.setData("targetRoom", connections.up);
      door.setData("entryDirection", "down");
      door.body.allowGravity = false;
      door.body.setImmovable(true);
    }
    // Down Door
    if (connections.down) {
      const door = this.doorGroup.create(
        screenWidth / 2,
        screenHeight - doorThickness / 2,
        "door_trigger"
      );
      door.setVisible(false);
      door.setOrigin(0.5);
      door.displayWidth = screenWidth;
      door.displayHeight = doorThickness;
      door.setData("targetRoom", connections.down);
      door.setData("entryDirection", "up");
      door.body.allowGravity = false;
      door.body.setImmovable(true);
    }

    // Set up overlap detection between the player and any door in the doorGroup
    // The `handleRoomTransition` method will be called when an overlap occurs.
    this.physics.add.overlap(
      this.player,
      this.doorGroup,
      this.handleRoomTransition,
      null,
      this
    );
  }

  handleRoomTransition(player, door) {
    const targetRoomKey = door.getData("targetRoom");
    const entryDirection = door.getData("entryDirection");

    // Prevent rapid transitions if player is still in the overlap zone
    // You might want a cooldown or check if player is "moving" into the door
    // For simplicity, we'll just transition.
    if (targetRoomKey) {
      console.log(
        `Transitioning to room: ${targetRoomKey} (entering from ${entryDirection})`
      );
      this.loadRoom(targetRoomKey, entryDirection);
    }
  }

  handlePlayerEnemyOverlap(player, enemy) {
    player.takeDamage(enemy.damage);
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
