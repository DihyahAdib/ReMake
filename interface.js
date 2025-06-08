//interface.js
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class MenuScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor("#222");

    this.add
      .text(400, 400, "Main Menu", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    const startText = this.add
      .text(400, 250, "Start Game", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    startText.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
