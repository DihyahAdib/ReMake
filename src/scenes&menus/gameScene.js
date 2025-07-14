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
  keys = null;
  currentRoomKey = null;
  debugGraphics = null;

  enemyStructs = [
    {
      id: "beginner mob 1",
      xOffset: 200,
      yOffset: -200,
      speed: 100,
      damage: 10,
      health: 100,
      isDead: false,
      count: 2,
      rmkey: "StartingRoom",
    },
    {
      id: "beginner mob 2",
      xOffset: 400,
      yOffset: -300,
      speed: 120,
      damage: 10,
      health: 100,
      isDead: false,
      count: 4,
      rmkey: "room2",
    },
  ];

  weaponStructs = [
    {
      id: "Basic Shooter",
      x: 200,
      y: 200,
      damage: 15,
      cooldown: 500,
      speed: 400,
      pickedUp: false,
      rmkey: "StartingRoom",
    },
  ];

  rooms = {};

  constructor() {
    super({ key: "GameScene" });
    this.initializeRoomData();
  }

  initializeRoomData() {
    this.rooms = {
      StartingRoom: {
        background: "R1_bg",
        connections: {
          right: "room2",
        },
        playerSpawnPoints: {
          right: { x: gameWidth - rmProps.leftRightOffset, y: windowCenterY },
          default: { x: windowCenterX, y: windowCenterY + 50 },
        },
        enemies: [],
        weapons: [],
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
        enemies: [],
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
    // also figure out how to dynamically add then to different spots in the room

    for (const roomKey in this.rooms) {
      const room = this.rooms[roomKey];

      for (const enemyStruct of this.enemyStructs) {
        if (enemyStruct.rmkey === roomKey) {
          room.enemies.push({ ...enemyStruct });
        }
      }

      for (const weaponStruct of this.weaponStructs) {
        if (weaponStruct.rmkey === roomKey) {
          room.weapons.push({ ...weaponStruct });
        }
      }
    }
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
    this.load.image("enemy", "assets/Enemy.png");
    this.load.image("basicShooterImg", "assets/sword.png");
    this.load.image("R1_bg", "assets/room1_background.png");
    this.load.image("R2_bg", "assets/room2_background.png");
    this.load.image("door_trigger", "assets/door.png");
  }

  create() {
    this.cameras.main.fadeIn(400, 0, 0, 0);
    window.myGameScene = this;
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

    this.currentRoomKey = "StartingRoom";
    this.loadRoom(this.currentRoomKey);

    this.playerHpText = this.add
      .text(128, 92, `HP: ${this.player.health}`, {
        font: "16px Arial",
        fill: "#ffffff",
      })
      .setScrollFactor(0);
    this.fpsText = this.add
      .text(128, 72, "FPS:", {
        font: "16px Arial",
        fill: "#ffffff",
      })
      .setScrollFactor(0);
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
    if (this.roomContentGroup) this.roomContentGroup.clear(true, true);
    if (this.doorGroup) this.doorGroup.clear(true, true);
    if (this.enemyGroup) this.enemyGroup.clear(true, true);
    if (this.weaponGroup) this.weaponGroup.clear(true, true);

    this.roomContentGroup = this.add.group();
    this.weaponGroup = this.physics.add.group();
    this.doorGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.physics.add.group();

    this.handleItemPickUp();
    const roomData = this.rooms[roomKey];
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
          const newWeapon = Weapons.createWeaponFromDef(this, weaponDef);
          newWeapon.weaponDefinition = weaponDef;
          this.weaponGroup.add(newWeapon);
        }
      });
    }

    if (roomData.enemies && roomData.enemies.length > 0) {
      roomData.enemies.forEach((enemyDef) => {
        if (!enemyDef.isDead) {
          const newEnemy = Enemy.createEnemyFromDef(this, enemyDef);
          this.enemyGroup.add(newEnemy);
        }
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

    if (
      this.player.equippedWeapon &&
      this.player.equippedWeapon.projectileGroup &&
      this.enemyGroup
    ) {
      this.physics.add.overlap(
        this.player.equippedWeapon.projectileGroup,
        this.enemyGroup,
        (projectile, enemy) => {
          enemy.takeDamage(this.player.equippedWeapon.damage);
          projectile.destroy();
        }
      );
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
      cooldown: weapon.cooldown,
      speed: weapon.speed,
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

    if (this.player.equippedWeapon.projectileGroup) {
      this.physics.add.overlap(
        this.player.equippedWeapon.projectileGroup,
        this.enemyGroup,
        (projectile, enemy) => {
          enemy.takeDamage(this.player.equippedWeapon.damage);
          projectile.destroy();
        }
      );
    }
  }

  getCurrentGameWidth() {
    return this.scale.width;
  }

  getCurrentGameHeight() {
    return this.scale.height;
  }

  getCurrentGameCenterX() {
    return this.getCurrentGameWidth() / 2;
  }

  getCurrentGameCenterY() {
    return this.getCurrentGameHeight() / 2;
  }
}
