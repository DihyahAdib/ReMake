//mainMenu.js

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  async create() {
    /**
     * Main camera
     */
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

    const hasSeenTutorial = await window.myUniqueElectronAPI.getSetting("hasSeenTutorial", false);

    startMnBtn.on("pointerdown", () => {
      if (!hasSeenTutorial) {
        mc.fadeOut(1000, 0, 0, 0);
        mc.once("camerafadeoutcomplete", () => {
          this.scene.start("TutorialScene");
        });
      } else {
        mc.fadeOut(1000, 0, 0, 0);
        mc.once("camerafadeoutcomplete", () => {
          this.scene.start("GameScene");
        });
      }
    });

    settingsMnBtn.on("pointerdown", () => {
      this.scene.switch("SettingScene");
    });
  }
}
