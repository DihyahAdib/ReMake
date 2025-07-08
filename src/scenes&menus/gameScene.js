//gameScene.js

import { Enemy } from "../enemy.js";
import {
  gameWidth,
  gameHeight,
  windowCenterX,
  windowCenterY,
  rmProps,
} from "../utils/screenUtils.js";
import { createPlayerWithTag } from "../utils/playerUtils.js";
import { Weapons } from "../weapons.js";

const { roomPaddingWidth, roomPaddingHeight, doorPaddingWidth, doorPaddingHeight } = rmProps;

const rmDim = {
  innerRoomWidth: gameWidth - roomPaddingWidth,
  innerRoomHeight: gameHeight - roomPaddingHeight,
  roomOffsetX: roomPaddingWidth / 2,
  roomOffsetY: roomPaddingHeight / 2,
  doorWidth: windowCenterX - doorPaddingWidth,
  doorHeight: windowCenterY - doorPaddingHeight,
};

export class GameScene extends Phaser.Scene {
  enemyGroup = null;
  doorGroup = null;
  roomContentGroup = null;
  weaponGroup = null;
  player = null;
  playerNameTag = null;
  playerHpText = null;
  fpsText = null;
  escText = null;
  keys = null;
  currentRoomKey = null;
  debugGraphics = null;

  rooms = {
    StartingRoom: {
      background: "R1_bg",
      connections: {
        right: "room2",
      },
      playerSpawnPoints: {
        right: { x: gameWidth - rmProps.leftRightOffset, y: windowCenterY },
        default: { x: windowCenterX, y: windowCenterY + 50 },
      },
      enemies: [
        {
          id: "chaser_01",
          xOffset: 100,
          yOffset: -100,
          speed: 100,
          damage: 10,
          health: 50,
        },
        {
          id: "chaser_02",
          xOffset: 200,
          yOffset: 50,
          speed: 100,
          damage: 10,
          health: 50,
        },
      ],
      weapons: [
        { x: 200, y: 200, id: "Basic Shooter", damage: 15, Cooldown: 100, pickedUp: false },
      ],
      items: [],
    },

    room2: {
      background: "R2_bg",
      connections: {
        left: "StartingRoom",
        up: "room3",
      },
      playerSpawnPoints: {
        left: { x: rmProps.leftRightOffset, y: windowCenterY },
        up: { x: windowCenterX, y: rmProps.topBottomOffset },
        default: { x: windowCenterX, y: windowCenterY + 50 },
      },
      enemies: [
        {
          id: "chaser_03",
          xOffset: 200,
          yOffset: 50,
          speed: 100,
          damage: 15,
          health: 50,
        },
      ],
      weapons: [],
      items: [],
    },

    room3: {
      background: "R2_bg",
      connections: {
        down: "room2",
      },
      playerSpawnPoints: {
        down: {
          x: windowCenterX,
          y: gameHeight - rmProps.topBottomOffset,
        },
        default: { x: windowCenterX, y: windowCenterY + 50 },
      },
      enemies: [],
      weapons: [],
      items: [],
    },
  };

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
    this.load.image("enemy", "assets/Enemy.png");
    this.load.image("basicShooter", "assets/sword.png");
    this.load.image("R1_bg", "assets/room1_background.png");
    this.load.image("R2_bg", "assets/room2_background.png");
    this.load.image("door_trigger", "assets/door.png");
  }

  create() {
    this.cameras.main.fadeIn(400, 0, 0, 0);
    // window.myGameScene = this;
    this.keys = this.input.keyboard.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.escText = this.add
      .text(windowCenterX, windowCenterY + 450, "Press Esc to pause the game", {
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
    this.weaponGroup = this.physics.add.group();
    this.roomContentGroup = this.add.group();
    this.doorGroup = this.physics.add.staticGroup();

    // Load the initial room
    this.currentRoomKey = "StartingRoom";
    this.loadRoom(this.currentRoomKey);
    this.handleItemPickUp();

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

      if (this.player.equippedWeapon) {
        this.player.equippedWeapon.x = this.player.x;
        this.player.equippedWeapon.y = this.player.y;
      }
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

    // Clear gameObjects first
    if (this.roomContentGroup) this.roomContentGroup.clear(true, true);
    if (this.doorGroup) this.doorGroup.clear(true, true);
    if (this.enemyGroup) this.enemyGroup.clear(true, true);
    if (this.weaponGroup) this.weaponGroup.clear(true, true);

    // Add them back to the respective game groups
    this.roomContentGroup = this.add.group();
    this.weaponGroup = this.physics.add.group();
    this.doorGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.physics.add.group();

    const roomData = this.rooms[roomKey];

    // Error handling
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

    // Set playable area
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
        x: windowCenterX,
        y: windowCenterY,
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

    // Invoke the function when creating world/rooms
    this.createRoomDoors(
      roomData.connections,
      rmDim.roomOffsetX,
      rmDim.roomOffsetY,
      rmDim.innerRoomWidth,
      rmDim.innerRoomHeight
    );

    if (roomData.weapons && roomData.weapons.length > 0) {
      roomData.weapons.forEach((weaponDef) => {
        if (!weaponDef.pickedUp) {
          console.log(weaponDef.pickedUp);
          const weaponPosX = weaponDef.x || windowCenterX;
          const weaponPosY = weaponDef.y || windowCenterY;
          const newWeapon = new Weapons(
            this,
            weaponPosX,
            weaponPosY,
            "basicShooter",
            null,
            weaponDef.id,
            weaponDef.damage,
            weaponDef.Cooldown
          );
          newWeapon.setScale(0.15);
          this.weaponGroup.add(newWeapon);
        }
      });
    }

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

      this.physics.add.collider(
        this.player,
        this.enemyGroup,
        this.handlePlayerEnemyCollision,
        null,
        this
      );
      this.physics.add.overlap(
        this.player,
        this.enemyGroup,
        this.handlePlayerEnemyCollision,
        null,
        this
      );
      this.physics.add.collider(this.enemyGroup, this.enemyGroup);
    }
    console.log(`Loaded room: ${roomKey}`);
  }

  handlePlayerEnemyCollision(player, enemy) {
    player.takeDamage(enemy.damage);
  }

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

  handleItemPickUp() {
    this.physics.add.overlap(this.player, this.weaponGroup, this.onPlayerPickUpWeapon, null, this);
  }

  onPlayerPickUpWeapon(player, weapon) {
    player.inventory.push({
      id: weapon.id,
      damage: weapon.damage,
      Cooldown: weapon.Cooldown,
    });

    this.weaponGroup.remove(weapon, false, false);

    const currentRoomData = this.rooms[this.currentRoomKey];
    if (currentRoomData && currentRoomData.weapons) {
      const pickedUpWeaponDef = currentRoomData.weapons.find((def) => def.id === weapon.id);
      if (pickedUpWeaponDef) {
        pickedUpWeaponDef.pickedUp = true;
        console.log(
          `Weapon ${weapon.id} in ${this.currentRoomKey} permanently marked as picked up.`
        );
      }
    }

    weapon.x = player.x;
    weapon.y = player.y;
    weapon.setDepth(10);
    player.equippedWeapon = weapon;

    if (this.player && this.player.equippedWeapon) {
      this.player.equippedWeapon.x = this.player.x;
      this.player.equippedWeapon.y = this.player.y;
    }
  }
}
