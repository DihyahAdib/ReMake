//settingsScene.js

export class SettingScene extends Phaser.Scene {
  constructor() {
    super({ key: "SettingScene" });
    this.disableVSync = false;
  }

  async create() {
    this.cameras.main.setBackgroundColor("#000");

    const settingsMnBtnBack = this.add
      .text(40, 40, "Back", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setInteractive();

    settingsMnBtnBack.on("pointerdown", () => {
      this.scene.switch("MenuScene");
    });

    this.toggleVSyncButton = this.add
      .text(40, 100, "", {
        fontSize: "32px",
        backgroundColor: "#444",
        padding: { x: 10, y: 5 },
      })
      .setInteractive();

    this.disableVSync = await window.myUniqueElectronAPI.getSetting(
      "disableVSync"
    );
    this.updateVSyncButtonText();

    this.toggleVSyncButton.on("pointerdown", async () => {
      this.disableVSync = !this.disableVSync;
      this.updateVSyncButtonText();
      await window.myUniqueElectronAPI.setSetting(
        "disableVSync",
        this.disableVSync
      );

      alert(
        "VSync setting changed. The application will now restart for changes to take effect."
      );
    });
  }

  updateVSyncButtonText() {
    this.toggleVSyncButton.setText(
      `VSync: ${this.disableVSync ? "Disabled" : "Enabled"}`
    );
  }
}
