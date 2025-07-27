"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//game.js
const screenUtils_1 = require("./utils/screenUtils");
const mainMenu_1 = require("./scenes&menus/mainMenu");
const tutorialScene_1 = require("./scenes&menus/tutorialScene");
const gameScene_1 = require("./scenes&menus/gameScene");
const pauseMenu_1 = require("./scenes&menus/pauseMenu");
const settingsMenu_1 = require("./scenes&menus/settingsMenu");
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
        width: screenUtils_1.winProps.gameWidth,
        height: screenUtils_1.winProps.gameHeight,
    },
    scene: [mainMenu_1.MenuScene, tutorialScene_1.TutorialScene, gameScene_1.GameScene, settingsMenu_1.SettingScene, pauseMenu_1.PauseScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },
    fps: {
        target: Infinity,
        forceSetTimeOut: false,
    },
};
const game = new Phaser.Game(config);
exports.default = game;
