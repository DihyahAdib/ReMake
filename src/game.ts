//game.js

import { gameHeight, gameWidth } from "./utils/screenUtils.ts";
import { MenuScene } from "./scenes&menus/mainMenu.ts";
import { TutorialScene } from "./scenes&menus/tutorialScene.ts";
import { GameScene } from "./scenes&menus/gameScene.ts";
import { PauseScene } from "./scenes&menus/pauseMenu.ts";
import { SettingScene } from "./scenes&menus/settingsMenu.ts";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
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
  },
  fps: {
    target: Infinity,
    forceSetTimeOut: false,
  },
};

const game = new Phaser.Game(config);

export default game;
