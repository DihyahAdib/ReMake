//interface.js

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }
  create() {
    this.cameras.main.setBackgroundColor("#222");
    const startMnBtn = this.add
      .text(400, 250, "Start Game", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

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
      .setInteractive();

    settingsMnBtn.on("pointerdown", () => {
      this.scene.switch("SettingScene");
    });
  }
}
