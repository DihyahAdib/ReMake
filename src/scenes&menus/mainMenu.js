//mainMenu.js

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  async create() {
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

    const hasSeenTutorial = await window.myUniqueElectronAPI.getSetting(
      "hasSeenTutorial",
      false
    );

    startMnBtn.on("pointerdown", () => {
      if (!hasSeenTutorial) {
        this.scene.start("TutorialScene");
        console.log("Starting TutorialScene");
      } else {
        this.scene.start("GameScene");
        console.log("Starting GameScene (tutorial already seen)");
      }
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
      if (!hasSeenTutorial) {
        this.scene.switch("SettingScene");
      }
    });
  }
}
