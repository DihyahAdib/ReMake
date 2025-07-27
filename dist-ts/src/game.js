//game.js
import { winProps } from "./utils/screenUtils";
import { MenuScene } from "./scenes&menus/mainMenu";
import { TutorialScene } from "./scenes&menus/tutorialScene";
import { GameScene } from "./scenes&menus/gameScene";
import { PauseScene } from "./scenes&menus/pauseMenu";
import { SettingScene } from "./scenes&menus/settingsMenu";
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
