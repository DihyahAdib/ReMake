//gameScene.js

import { Enemy } from "../enemy.js";
import { gameWidth, gameHeight } from "../utils/screenUtils.js";
import { createPlayerWithTag } from "../utils/playerUtils.js";

const innerRoomCenterX = gameWidth / 2;
const innerRoomCenterY = gameHeight / 2;

const rmProps = {
  roomPaddingWidth: 160,
  roomPaddingHeight: 80,
  doorPaddingWidth: 400,
  doorPaddingHeight: 400,
  leftRightOffset: 180, //these are these values so it wont flash between rooms, remember to put doors IN the walls only a little bit of hit box sticking out
  topBottomOffset: 150,
  doorThickness: 50,
};

const rmDim = {
  innerRoomWidth: gameWidth - rmProps.roomPaddingWidth,
  innerRoomHeight: gameHeight - rmProps.roomPaddingHeight,
  roomOffsetX: rmProps.roomPaddingWidth / 2,
  roomOffsetY: rmProps.roomPaddingHeight / 2,
  doorWidth: innerRoomCenterX - rmProps.doorPaddingWidth,
  doorHeight: innerRoomCenterY - rmProps.doorPaddingHeight,
};

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
  debugGraphics = null;

  rooms = {
    room1: {
      background: "R1_bg",
      connections: {
        right: "room2",
      },
      playerSpawnPoints: {
        right: { x: gameWidth - rmProps.leftRightOffset, y: innerRoomCenterY },
        default: { x: innerRoomCenterX, y: innerRoomCenterY + 50 },
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
        up: "room3",
      },
      playerSpawnPoints: {
        left: { x: rmProps.leftRightOffset, y: innerRoomCenterY },
        up: { x: innerRoomCenterX, y: rmProps.topBottomOffset },
        default: { x: innerRoomCenterX, y: innerRoomCenterY + 50 },
      },
      enemies: [{ id: "chaser_03", xOffset: 200, yOffset: 50, speed: 100, damage: 15, health: 50 }],
      items: [],
    },

    room3: {
      background: "R2_bg",
      connections: {
        down: "room2",
      },
      playerSpawnPoints: {
        down: {
          x: innerRoomCenterX,
          y: gameHeight - rmProps.topBottomOffset,
        },
        default: { x: innerRoomCenterX, y: innerRoomCenterY + 50 },
      },
      enemies: [],
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
    this.load.image("door_trigger", "assets/door.png");
  }

  create() {
    this.cameras.main.fadeIn(400, 0, 0, 0);
    this.keys = this.input.keyboard.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.escText = this.add
      .text(innerRoomCenterX, innerRoomCenterY + 450, "Press Esc to pause the game", {
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

    this.playerHpText = this.add.text(128, 92, `HP: ${this.player.health}`, {
      font: "16px Arial",
      fill: "#ffffff",
    });
    this.playerHpText.setScrollFactor(0);
    this.fpsText = this.add.text(128, 72, "FPS:", {
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
    console.log(`Loading room: ${roomKey}, Entry direction: ${entryDirection}`);

    if (this.roomContentGroup) this.roomContentGroup.clear(true, true);
    if (this.doorGroup) this.doorGroup.clear(true, true);
    if (this.enemyGroup) this.enemyGroup.clear(true, true);
    this.roomContentGroup = this.add.group();
    this.doorGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.physics.add.group();

    const roomData = this.rooms[roomKey];
    if (!roomData) {
      console.error(`Room data not found for key: ${roomKey}`);
      return;
    }

    this.currentRoomKey = roomKey;

    const bg = this.add
      .image(rmDim.roomOffsetX, rmDim.roomOffsetY, roomData.background)
      .setOrigin(0, 0)
      .setDepth(-1);

    const scaleX = rmDim.innerRoomWidth / bg.width;
    const scaleY = rmDim.innerRoomHeight / bg.height;
    bg.setScale(scaleX, scaleY);

    this.roomContentGroup.add(bg);

    this.physics.world.setBounds(
      rmDim.roomOffsetX,
      rmDim.roomOffsetY,
      rmDim.innerRoomWidth,
      rmDim.innerRoomHeight
    );

    if (this.debugGraphics) {
      this.debugGraphics.destroy();
    }
    this.debugGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00, alpha: 1 } });
    this.debugGraphics.strokeRect(
      rmDim.roomOffsetX,
      rmDim.roomOffsetY,
      rmDim.innerRoomWidth,
      rmDim.innerRoomHeight
    );
    this.debugGraphics.setDepth(999);

    let spawnPoint = roomData.playerSpawnPoints[entryDirection];
    if (!spawnPoint) {
      spawnPoint = roomData.playerSpawnPoints.default || {
        x: innerRoomCenterX,
        y: innerRoomCenterY,
      };
    }

    const playerBodyWidthHalf = this.player.body.width / 2;
    const playerBodyHeightHalf = this.player.body.height / 2;

    spawnPoint.x = Phaser.Math.Clamp(
      spawnPoint.x,
      rmDim.roomOffsetX + playerBodyWidthHalf,
      rmDim.roomOffsetX + rmDim.innerRoomWidth - playerBodyWidthHalf
    );
    spawnPoint.y = Phaser.Math.Clamp(
      spawnPoint.y,
      rmDim.roomOffsetY + playerBodyHeightHalf,
      rmDim.roomOffsetY + rmDim.innerRoomHeight - playerBodyHeightHalf
    );

    this.player.setPosition(spawnPoint.x, spawnPoint.y);

    this.createRoomDoors(
      roomData.connections,
      rmDim.roomOffsetX,
      rmDim.roomOffsetY,
      rmDim.innerRoomWidth,
      rmDim.innerRoomHeight
    );

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
  // DONT FORGET TO MAKE ROOMS HITBOX ONLY SLIGHTLY OUTSIDE OF THE PLAYABLE AREA (i.e setBounds) |
  createRoomDoors(connections, roomOffsetX, roomOffsetY, innerRoomWidth, innerRoomHeight) {
    const roomLeftEdge = roomOffsetX;
    const roomRightEdge = roomOffsetX + innerRoomWidth;
    const roomTopEdge = roomOffsetY;
    const roomBottomEdge = roomOffsetY + innerRoomHeight;
    const roomCenterX = roomOffsetX + innerRoomWidth / 2;
    const roomCenterY = roomOffsetY + innerRoomHeight / 2;

    // Right Door
    if (connections.right) {
      const door = this.doorGroup.create(
        roomRightEdge - rmProps.doorThickness / 2,
        roomCenterY,
        "door_trigger"
      );
      door.setVisible(true);
      door.setOrigin(0.5);
      door.displayWidth = rmProps.doorThickness;
      door.displayHeight = rmDim.doorHeight;
      door.setData("targetRoom", connections.right);
      door.setData("entryDirection", "left");
      door.body.allowGravity = false;
      door.refreshBody();
    }
    // Left Door
    if (connections.left) {
      const door = this.doorGroup.create(
        roomLeftEdge + rmProps.doorThickness / 2,
        roomCenterY,
        "door_trigger"
      );
      door.setVisible(true);
      door.setOrigin(0.5);
      door.displayWidth = rmProps.doorThickness;
      door.displayHeight = rmDim.doorHeight;
      door.setData("targetRoom", connections.left);
      door.setData("entryDirection", "right");
      door.body.allowGravity = false;
      door.refreshBody();
    }
    // Up Door
    if (connections.up) {
      const door = this.doorGroup.create(
        roomCenterX,
        roomTopEdge + rmProps.doorThickness / 2,
        "door_trigger"
      );
      door.setVisible(true);
      door.setOrigin(0.5);
      door.displayWidth = rmDim.doorWidth;
      door.displayHeight = rmProps.doorThickness;
      door.setData("targetRoom", connections.up);
      door.setData("entryDirection", "down");
      door.body.allowGravity = false;
      door.refreshBody();
    }
    // Down Door
    if (connections.down) {
      const door = this.doorGroup.create(
        roomCenterX,
        roomBottomEdge - rmProps.doorThickness / 2,
        "door_trigger"
      );
      door.setVisible(true);
      door.setOrigin(0.5);
      door.displayWidth = rmDim.doorWidth;
      door.displayHeight = rmProps.doorThickness;
      door.setData("targetRoom", connections.down);
      door.setData("entryDirection", "up");
      door.body.allowGravity = false;
      door.refreshBody();
    }

    this.physics.add.overlap(this.player, this.doorGroup, this.handleRoomTransition, null, this);
  }

  handleRoomTransition(player, door) {
    const targetRoomKey = door.getData("targetRoom");
    const entryDirection = door.getData("entryDirection");

    if (targetRoomKey && this.currentRoomKey !== targetRoomKey) {
      console.log(`Entering to room: ${targetRoomKey} (entering from ${entryDirection})`);

      this.physics.world.disable(this.player);
      this.cameras.main.fadeOut(250, 220, 220, 220);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.loadRoom(targetRoomKey, entryDirection);
        this.cameras.main.fadeIn(250, 220, 220, 220);
        this.physics.world.enable(this.player);
      });
    }
  }

  handlePlayerEnemyOverlap(player, enemy) {
    player.takeDamage(enemy.damage);
  }
}
