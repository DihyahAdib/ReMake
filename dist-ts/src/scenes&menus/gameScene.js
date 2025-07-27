"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameScene = void 0;
//gameScene.js
const Phaser = __importStar(require("phaser"));
const screenUtils_js_1 = require("../utils/screenUtils.js");
const enemy_1 = require("../enemy");
const weapons_1 = require("../weapons");
const player_1 = require("../player");
const roomDim = (0, screenUtils_js_1.getRoomDimensions)();
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
        this.currentRoomKey = null;
        this.debugGraphics = null;
        this.isDevelopmentMode = false;
        this.enemyStructs = [
            {
                id: "beginner mob 1",
                position: { x: 200, y: 200 },
                speed: 100,
                damage: 10,
                health: 100,
                isDead: false,
                count: 2,
                rmkey: "StartingRoom",
            },
            {
                id: "beginner mob 2",
                position: { x: 400, y: -300 },
                speed: 120,
                damage: 10,
                health: 100,
                isDead: false,
                count: 4,
                rmkey: "room2",
            },
        ];
        this.weaponStructs = [
            {
                scene: this,
                texture: "basicShooterImg",
                frame: undefined,
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
        this.rooms = {};
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
                    right: { x: screenUtils_js_1.winProps.gameWidth - screenUtils_js_1.rmProps.leftRightOffset, y: screenUtils_js_1.winProps.windowCenterY },
                    default: { x: screenUtils_js_1.winProps.windowCenterX, y: screenUtils_js_1.winProps.windowCenterY + 50 },
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
                    left: { x: screenUtils_js_1.rmProps.leftRightOffset, y: screenUtils_js_1.winProps.windowCenterY },
                    up: { x: screenUtils_js_1.winProps.windowCenterX, y: screenUtils_js_1.rmProps.topBottomOffset },
                    default: { x: screenUtils_js_1.winProps.windowCenterX, y: screenUtils_js_1.winProps.windowCenterY + 50 },
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
                        x: screenUtils_js_1.winProps.windowCenterX,
                        y: screenUtils_js_1.winProps.gameHeight - screenUtils_js_1.rmProps.topBottomOffset,
                    },
                    default: { x: screenUtils_js_1.winProps.windowCenterX, y: screenUtils_js_1.winProps.windowCenterY + 50 },
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
    async create() {
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.isDevelopmentMode = await window.myUniqueElectronAPI.isDevelopment();
        console.log("GameScene isDevelopmentMode:", this.isDevelopmentMode);
        this.keys = this.input.keyboard.addKeys({
            Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
        });
        this.escText = this.add
            .text(screenUtils_js_1.winProps.windowCenterX, screenUtils_js_1.winProps.windowCenterY + 450, "Press Esc to pause the game", {
            font: "16px Arial",
            color: "rgba(0, 0, 0, 0.4)",
        })
            .setOrigin(0.5)
            .setScrollFactor(0);
        const xPos = this.cameras.main.centerX;
        const yPos = this.cameras.main.centerY;
        const { player, playerNameTag } = (0, player_1.createPlayerWithTag)(this, xPos, yPos);
        this.player = player;
        this.playerNameTag = playerNameTag;
        this.enemyGroup = this.physics.add.group();
        this.weaponGroup = this.physics.add.group();
        this.roomContentGroup = this.add.group();
        this.doorGroup = this.physics.add.staticGroup();
        this.playerHpText = this.add
            .text(128, 92, `HP: ${this.player.health}`, {
            font: "16px Arial",
            color: "#ffffff",
        })
            .setScrollFactor(0);
        this.fpsText = this.add
            .text(128, 72, "FPS:", {
            font: "16px Arial",
            color: "#ffffff",
        })
            .setScrollFactor(0);
        this.currentRoomKey = "StartingRoom";
        this.loadRoom(this.currentRoomKey);
        this.handleItemPickUp();
        this.updateDebugVisuals();
    }
    update(time, delta) {
        if (!this.keys || !this.player || !this.playerHpText || !this.fpsText || !this.playerNameTag) {
            return;
        }
        if (!this.player.isDead) {
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
                if (enemy instanceof enemy_1.Enemy && enemy.active) {
                    enemy.update(time, delta);
                }
                return true;
            }, this);
        }
        if (this.keys.Esc.isDown && !this.scene.isActive("PauseScene")) {
            this.scene.pause("GameScene");
            this.scene.launch("PauseScene");
        }
        this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
    }
    updateDebugVisuals() {
        if (this.isDevelopmentMode) {
            if (!this.debugGraphics) {
                this.debugGraphics = this.add.graphics({
                    lineStyle: { width: 2, color: 0x00ff00, alpha: 1 },
                });
                this.debugGraphics.setDepth(100);
            }
            this.debugGraphics.clear();
            this.debugGraphics.strokeRect(roomDim.roomOffsetX, roomDim.roomOffsetY, roomDim.innerRoomWidth, roomDim.innerRoomHeight);
            this.debugGraphics.setVisible(true);
        }
        else {
            if (this.debugGraphics) {
                this.debugGraphics.destroy();
                this.debugGraphics = null;
            }
        }
        if (this.player?.body instanceof Phaser.Physics.Arcade.Body) {
            this.player.body.debugShowBody = this.isDevelopmentMode;
            this.player.body.debugShowVelocity = this.isDevelopmentMode;
        }
        this.physics.world.drawDebug = this.isDevelopmentMode;
        if (this.physics.world.debugGraphic) {
            this.physics.world.debugGraphic.visible = this.isDevelopmentMode;
            if (!this.isDevelopmentMode) {
                this.physics.world.debugGraphic.clear();
            }
        }
        if (this.enemyGroup) {
            this.enemyGroup.children.each((enemy) => {
                if (enemy instanceof enemy_1.Enemy && enemy.body instanceof Phaser.Physics.Arcade.Body) {
                    enemy.body.debugShowBody = this.isDevelopmentMode;
                    enemy.body.debugShowVelocity = this.isDevelopmentMode;
                }
                return true;
            });
        }
    }
    loadRoom(roomKey, entryDirection = null) {
        if (this.roomContentGroup)
            this.roomContentGroup.clear(true, true);
        if (this.doorGroup)
            this.doorGroup.clear(true, true);
        if (this.enemyGroup)
            this.enemyGroup.clear(true, true);
        if (this.weaponGroup)
            this.weaponGroup.clear(true, true);
        this.roomContentGroup = this.add.group();
        this.weaponGroup = this.physics.add.group();
        this.doorGroup = this.physics.add.staticGroup();
        this.enemyGroup = this.physics.add.group();
        this.handleItemPickUp();
        const roomData = this.rooms[roomKey];
        if (!roomData) {
            console.error(`Room data not found for key: ${roomKey}`);
            return;
        }
        this.currentRoomKey = roomKey;
        const bg = this.add
            .image(roomDim.roomOffsetX, roomDim.roomOffsetY, roomData.background)
            .setOrigin(0, 0)
            .setDepth(-1);
        const scaleX = roomDim.innerRoomWidth / bg.width;
        const scaleY = roomDim.innerRoomHeight / bg.height;
        bg.setScale(scaleX, scaleY);
        this.roomContentGroup.add(bg);
        this.physics.world.setBounds(roomDim.roomOffsetX, roomDim.roomOffsetY, roomDim.innerRoomWidth, roomDim.innerRoomHeight);
        this.updateDebugVisuals();
        let spawnPoint = roomData.playerSpawnPoints[entryDirection] || roomData.playerSpawnPoints.default;
        if (!spawnPoint) {
            spawnPoint = roomData.playerSpawnPoints.default || {
                x: screenUtils_js_1.winProps.windowCenterX,
                y: screenUtils_js_1.winProps.windowCenterY,
            };
        }
        spawnPoint.x = Phaser.Math.Clamp(spawnPoint.x, roomDim.roomOffsetX + this.player.getPlayerCenterX(), roomDim.roomOffsetX + roomDim.innerRoomWidth - this.player.getPlayerCenterX());
        spawnPoint.y = Phaser.Math.Clamp(spawnPoint.y, roomDim.roomOffsetY + this.player.getPlayerCenterY(), roomDim.roomOffsetY + roomDim.innerRoomHeight - this.player.getPlayerCenterY());
        this.player.setPosition(spawnPoint.x, spawnPoint.y);
        this.createRoomDoors(roomData.connections, roomDim.roomOffsetX, roomDim.roomOffsetY, roomDim.innerRoomWidth, roomDim.innerRoomHeight);
        if (roomData.weapons && roomData.weapons.length > 0) {
            roomData.weapons.forEach((weaponDef) => {
                if (!weaponDef.pickedUp &&
                    !(this.player.equippedWeapon && this.player.equippedWeapon.id === weaponDef.id)) {
                    const newWeapon = weapons_1.Weapons.createWeaponFromDefinition(this, weaponDef);
                    newWeapon.setScale(0.15);
                    newWeapon.setDepth(0);
                    this.weaponGroup.add(newWeapon);
                }
            });
        }
        if (roomData.enemies && roomData.enemies.length > 0) {
            roomData.enemies.forEach((enemyDef) => {
                if (!enemyDef.isDead) {
                    const newEnemy = enemy_1.Enemy.createEnemyFromDef(this, { ...enemyDef });
                    newEnemy.enemyDefinition = enemyDef;
                    this.enemyGroup.add(newEnemy);
                }
            });
            this.physics.add.collider(this.player, this.enemyGroup, this.handlePlayerEnemyCollision, undefined, this);
            this.physics.add.overlap(this.player, this.enemyGroup, this.handlePlayerEnemyCollision, undefined, this);
            this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        }
        if (this.player.equippedWeapon &&
            this.player.equippedWeapon.projectileGroup &&
            this.enemyGroup) {
            this.physics.add.overlap(this.player.equippedWeapon.projectileGroup, this.enemyGroup, (projectile, enemy) => {
                if (enemy instanceof enemy_1.Enemy) {
                    enemy.takeDamage(this.player.equippedWeapon.damage);
                }
                projectile.destroy();
            });
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
        const createDoor = (x, y, displayWidth, displayHeight, targetRoom, entryDirection) => {
            const door = this.doorGroup.create(x, y, "door_trigger");
            door.setVisible(true);
            door.setOrigin(0.5);
            door.displayWidth = displayWidth;
            door.displayHeight = displayHeight;
            door.setData("targetRoom", targetRoom);
            door.setData("entryDirection", entryDirection);
            door.setGravity(0, 0);
            door.refreshBody();
            return door;
        };
        if (connections.right) {
            createDoor(roomRightEdge - screenUtils_js_1.rmProps.doorThickness / 2, roomCenterY, screenUtils_js_1.rmProps.doorThickness, roomDim.doorHeight, connections.right, "left");
        }
        // Left Door
        if (connections.left) {
            createDoor(roomLeftEdge + screenUtils_js_1.rmProps.doorThickness / 2, roomCenterY, screenUtils_js_1.rmProps.doorThickness, roomDim.doorHeight, connections.left, "right");
        }
        // Up Door
        if (connections.up) {
            createDoor(roomCenterX, roomTopEdge + screenUtils_js_1.rmProps.doorThickness / 2, roomDim.doorWidth, screenUtils_js_1.rmProps.doorThickness, connections.up, "down");
        }
        // Down Door
        if (connections.down) {
            createDoor(roomCenterX, roomBottomEdge - screenUtils_js_1.rmProps.doorThickness / 2, roomDim.doorWidth, screenUtils_js_1.rmProps.doorThickness, connections.down, "up");
        }
        this.physics.add.overlap(this.player, this.doorGroup, this.handleRoomTransition, undefined, this);
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
        this.physics.add.overlap(this.player, this.weaponGroup, this.onPlayerPickUpWeapon, undefined, this);
    }
    //add items to be picked up later
    onPlayerPickUpWeapon(player, weapon, items) {
        const currentRoomData = this.rooms[this.currentRoomKey];
        const itemWasPickedUp = currentRoomData?.weapons?.find((def) => def.id === weapon.id);
        if (itemWasPickedUp) {
            player.inventory.push({ ...itemWasPickedUp, pickedUp: true });
        }
        this.weaponGroup.remove(weapon, false, false);
        if (currentRoomData && currentRoomData.weapons) {
            const pickedUpWeaponDef = currentRoomData.weapons.find((def) => def.id === weapon.id);
            if (itemWasPickedUp) {
                itemWasPickedUp.pickedUp = true;
                console.log(`Weapon ${weapon.id} in ${this.currentRoomKey} permanently marked as picked up.`);
            }
        }
        weapon.x = player.x;
        weapon.y = player.y;
        weapon.setDepth(0);
        player.equippedWeapon = weapon;
        if (this.player && this.player.equippedWeapon) {
            this.player.equippedWeapon.x = this.player.x;
            this.player.equippedWeapon.y = this.player.y;
        }
        if (this.player.equippedWeapon && this.player.equippedWeapon.projectileGroup) {
            this.physics.add.overlap(this.player.equippedWeapon.projectileGroup, this.enemyGroup, (projectile, enemy) => {
                if (enemy instanceof enemy_1.Enemy) {
                    enemy.takeDamage(this.player.equippedWeapon.damage);
                }
                projectile.destroy();
            });
        }
    }
}
exports.GameScene = GameScene;
