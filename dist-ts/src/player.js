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
exports.createPlayerWithTag = exports.getPlayerDefaults = exports.Player = void 0;
//player.js
const Phaser = __importStar(require("phaser"));
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture, frame, id, x, y, attackDamage, initialSpeed, initialHealth, level, nameTag) {
        super(scene, x, y, texture, frame);
        this.mxHealth = 100;
        this.isDead = false;
        this.canDealDamage = true;
        this.canTakeDamage = true;
        this.damageCooldown = 1000;
        this.inventory = [];
        this.currentScene = scene;
        this.playerImage = texture;
        this.playerFrame = frame;
        this.id = id;
        this.attackDamage = attackDamage;
        this.speed = initialSpeed;
        this.health = initialHealth;
        this.currentLevel = level;
        this.playerName = nameTag;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5);
        this.body.setDamping(true);
        this.body.setDrag(100);
        this.keys = this.currentScene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
        this.currentScene.input.on("pointerdown", () => {
            if (this.equippedWeapon) {
                this.equippedWeapon.shoot(this.x, this.y, this.currentScene.input.activePointer);
            }
        });
    }
    update(time, delta) {
        if (this.isDead)
            return;
        const deltaSec = delta / 1000;
        this.handleMovement();
    }
    handleMovement() {
        let moveX = 0;
        let moveY = 0;
        if (this.keys.up.isDown)
            moveY = -1;
        if (this.keys.down.isDown)
            moveY = 1;
        if (this.keys.left.isDown)
            moveX = -1;
        if (this.keys.right.isDown)
            moveX = 1;
        if (moveX !== 0 && moveY !== 0) {
            const factor = Math.SQRT1_2;
            moveX *= factor;
            moveY *= factor;
        }
        this.setVelocity(moveX * this.speed, moveY * this.speed);
    }
    takeDamage(amount) {
        if (!this.canTakeDamage || this.isDead)
            return;
        this.health -= amount;
        console.log(`Player health: ${this.health}`);
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        this.canTakeDamage = false;
        this.setTint(0xff0000);
        this.currentScene.time.delayedCall(this.damageCooldown, () => {
            this.canTakeDamage = true;
            this.clearTint();
        }, [], this);
    }
    die() {
        this.isDead = true;
        this.setVelocity(0, 0);
        this.disableBody(true, true);
    }
    getPlayerCenterX() {
        return this.body.width / 2;
    }
    getPlayerCenterY() {
        return this.body.height / 2;
    }
}
exports.Player = Player;
/**
 * Returns the default player properties
 */
const getPlayerDefaults = (x, y) => ({
    id: "Player",
    x,
    y,
    texture: "player",
    frame: undefined,
    initialDamage: 5,
    initialSpeed: 450,
    initialHealth: 100,
    level: 0,
    name: "Bon bon",
});
exports.getPlayerDefaults = getPlayerDefaults;
/**
 * Creates a Player instance and its associated name tag.
 */
const createPlayerWithTag = (scene, x, y, overrides = {}) => {
    const defaults = (0, exports.getPlayerDefaults)(x, y);
    const playerProps = { ...defaults, ...overrides };
    const player = new Player(scene, playerProps.texture, playerProps.frame, playerProps.id, playerProps.x, playerProps.y, playerProps.initialDamage, playerProps.initialSpeed, playerProps.initialHealth, playerProps.level, playerProps.name);
    const nameTagYOffset = (player.displayHeight || player.body.height) / 2 + 10;
    const playerNameTag = scene.add
        .text(player.x, player.y - nameTagYOffset, `|${playerProps.name}|`, {
        font: "26px Arial",
        color: "#ffffff",
        backgroundColor: "#00000080",
        padding: { x: 5, y: 2 },
        align: "center",
    })
        .setOrigin(0.5)
        .setScrollFactor(1);
    return { player, playerNameTag };
};
exports.createPlayerWithTag = createPlayerWithTag;
