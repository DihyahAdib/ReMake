//gameScene.js

import { Player } from "../player.js";
import { Enemy } from "../enemy.js";
import { gameWidth, gameHeight } from "../utils/screenUtils.js";
import { createPlayerWithTag } from "../utils/playerUtils.js";

export class GameScene extends Phaser.Scene {
  enemyGroup = null;
  doorGroup = null;
  roomContentGroup = null;
  player = null;
  playerNameTag = null;
  playerHpText = null;
  fpsText = null;
  keys = null;
  escText = null;
  currentRoomKey = null;

  rooms = {
    room1: {
      background: "R1_bg",
      connections: {
        right: "room2",
      },
      playerSpawnPoints: {
        right: { x: gameWidth - 150, y: gameHeight / 2 },
        default: { x: gameWidth / 2, y: gameHeight / 2 + 50 },
      },
      enemies: [
        {
          id: "chaser_01",
          xOffset: 100,
          yOffset: -100,
          speed: 100,
          damage: 15,
          health: 50,
        },
        {
          id: "chaser_02",
          xOffset: 200,
          yOffset: 50,
          speed: 100,
          damage: 15,
          health: 50,
        },
      ],
      items: [],
    },

    room2: {
      background: "R2_bg",
      connections: {
        left: "room1",
      },
      playerSpawnPoints: {
        left: { x: 150, y: gameHeight / 2 },
        default: { x: gameWidth / 2, y: gameHeight / 2 + 50 },
      },
      enemies: [{ id: "chaser_03", xOffset: 200, yOffset: 50, speed: 100, damage: 15, health: 50 }],
      items: [],
    },
  };

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
    this.load.image("enemy", "assets/Enemy.png");

    this.load.image("R1_bg", "assets/room1_background.png");
    this.load.image("R2_bg", "assets/room2_background.png");

    this.load.image("door_trigger", "assets/door_trigger_placeholder.png");
  }

  create() {
    console.log("The Game Scene Has Been Instantiated");

    this.cameras.main.setBackgroundColor("#044");
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.keys = this.input.keyboard.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.escText = this.add
      .text(gameWidth / 2, gameHeight / 2 + 450, "Press Esc to pause the game", {
        font: "16px Arial",
        fill: "rgba(0, 0, 0, 0.4)",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const xPos = this.cameras.main.centerX;
    const yPos = this.cameras.main.centerY;

    const { player, playerNameTag } = createPlayerWithTag(this, xPos, yPos);
    this.player = player;
    this.playerNameTag = playerNameTag;

    this.enemyGroup = this.physics.add.group();
    this.roomContentGroup = this.add.group();
    this.doorGroup = this.physics.add.staticGroup();

    // Load the initial room
    this.currentRoomKey = "room1";
    this.loadRoom(this.currentRoomKey);

    // Player HP text
    this.playerHpText = this.add.text(10, 30, `HP: ${this.player.health}`, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.playerHpText.setScrollFactor(0);

    // FPS text
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

  /**
   * Loads the specified room, clearing previous room content and setting up new elements.
   * @param {string} roomKey
   * @param {string} [entryDirection=null]
   */
  loadRoom(roomKey, entryDirection = null) {
    console.log(`Loading room: ${roomKey}, Entry direction: ${entryDirection}`);

    if (this.roomContentGroup) {
      this.roomContentGroup.clear(true, true);
    }
    if (this.doorGroup) {
      this.doorGroup.clear(true, true);
    }
    if (this.enemyGroup) {
      this.enemyGroup.clear(true, true);
    }

    this.roomContentGroup = this.add.group();
    this.doorGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.physics.add.group();

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
    console.log(`Loaded room: ${roomKey}`);
  }

  /**
   * Creates invisible door trigger zones based on room connections.
   * @param {object} connections
   */

  createRoomDoors(connections) {
    const doorThickness = 50; // How thick the invisible door trigger is
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
      door.refreshBody();
    }
    // Left Door
    if (connections.left) {
      const door = this.doorGroup.create(doorThickness / 2, screenHeight / 2, "door_trigger");
      door.setVisible(false);
      door.setOrigin(0.5);
      door.displayWidth = doorThickness;
      door.displayHeight = screenHeight;
      door.setData("targetRoom", connections.left);
      door.setData("entryDirection", "right");
      door.body.allowGravity = false;
      door.refreshBody();
    }
    // Up Door
    if (connections.up) {
      const door = this.doorGroup.create(screenWidth / 2, doorThickness / 2, "door_trigger");
      door.setVisible(false);
      door.setOrigin(0.5);
      door.displayWidth = screenWidth;
      door.displayHeight = doorThickness;
      door.setData("targetRoom", connections.up);
      door.setData("entryDirection", "down");
      door.body.allowGravity = false;
      door.refreshBody();
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
      door.refreshBody();
    }

    this.physics.add.overlap(this.player, this.doorGroup, this.handleRoomTransition, null, this);
  }

  /**
   * Handles the player overlapping with a door trigger, initiating a room transition.
   * @param {Phaser.GameObjects.GameObject} player
   * @param {Phaser.GameObjects.GameObject} door
   */

  handleRoomTransition(player, door) {
    const targetRoomKey = door.getData("targetRoom");
    const entryDirection = door.getData("entryDirection");

    if (targetRoomKey && this.currentRoomKey !== targetRoomKey) {
      console.log(`Transitioning to room: ${targetRoomKey} (entering from ${entryDirection})`);
      this.loadRoom(targetRoomKey, entryDirection);
    }
  }

  /**
   * Handles collision/overlap between the player and an enemy.
   * @param {Phaser.GameObjects.GameObject} player
   * @param {Phaser.GameObjects.GameObject} enemy
   */

  handlePlayerEnemyOverlap(player, enemy) {
    player.takeDamage(enemy.damage);
  }
}
