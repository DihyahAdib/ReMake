//game.js
import { winProps } from "./utils/screenUtils.js";
import { MenuScene } from "./scenes&menus/mainMenu.js";
import { TutorialScene } from "./scenes&menus/tutorialScene.js";
import { GameScene } from "./scenes&menus/gameScene.js";
import { PauseScene } from "./scenes&menus/pauseMenu.js";
import { SettingScene } from "./scenes&menus/settingsMenu.js";
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game-container",
        width: winProps.gameWidth,
        height: winProps.gameHeight,
    },
    scene: [MenuScene, TutorialScene, GameScene, SettingScene, PauseScene],
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
export default game;
