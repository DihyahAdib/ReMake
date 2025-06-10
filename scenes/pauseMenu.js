//pauseMenu.js
import { gameWidth, gameHeight } from "../game.js";

const pauseButtonStyle = {
  font: "30px Arial",
  fill: "#FFFFFF",
  backgroundColor: "#444",
  padding: { x: 15, y: 10 },
  strokeThickness: 0.5,
};

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0.4)");

    this.resumeGameBtn = this.add
      .text(gameWidth / 2, gameHeight / 2, "Resume", pauseButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.stop("PauseScene");
        this.scene.resume("GameScene");
      });
  }
}
