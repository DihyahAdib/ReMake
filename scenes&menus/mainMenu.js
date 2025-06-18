//mainMenu.js

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#222");

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const startMnBtn = this.add
      .text(centerX, centerY, "Start Game", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startMnBtn.on("pointerdown", () => {
      this.scene.start("GameScene");
    });

    const settingsMnBtn = this.add
      .text(400, 400, "Settings", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    settingsMnBtn.on("pointerdown", () => {
      this.scene.switch("SettingScene");
    });
  }
}
