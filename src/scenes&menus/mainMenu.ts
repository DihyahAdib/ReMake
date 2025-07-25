//mainMenu.js

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  async create(): Promise<void> {
    const mc = this.cameras.main;
    const mainMenuCenterX = mc.centerX;
    const mainMenuCenterY = mc.centerY;
    mc.setBackgroundColor("#222");

    const startMnBtn = this.add
      .text(mainMenuCenterX, mainMenuCenterY, "Start Game", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const settingsMnBtn = this.add
      .text(400, 400, "Settings", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const hasSeenTutorial = (await window.myUniqueElectronAPI.getSetting("hasSeenTutorial")) as boolean;

    startMnBtn.on("pointerdown", () => {
        mc.fadeOut(1000, 0, 0, 0);
        mc.once("camerafadeoutcomplete", () => {
          const targetScene = hasSeenTutorial ? "GameScene" : "TutorialScene";
          this.scene.start("TutorialScene");
        });
    });

    settingsMnBtn.on("pointerdown", () => {
      this.scene.switch("SettingScene");
    });
  }
}
