//settingsScene.js

import { winProps } from "../utils/screenUtils";

const settingsButtonStyle: Phaser.Types.GameObjects.Text.TextStyle & {
  padding: { x: number; y: number };
} = {
  fontSize: "32px",
  color: "#FFFFFF",
  backgroundColor: "#444",
  padding: { x: 15, y: 10 },
  stroke: "#000000",
  strokeThickness: 2,
};

export class SettingScene extends Phaser.Scene {
  previousSceneKey: string | null = null;
  disableVSync: boolean = false;
  disableFullScreen: boolean = false;


  settingsMnBtnBack!: Phaser.GameObjects.Text;
  toggleVSyncButton!: Phaser.GameObjects.Text;
  toggleFullScreenButton!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "SettingScene" });
  }

  async create(): Promise<void> {
    this.cameras.main.setBackgroundColor("#000");

    this.settingsMnBtnBack = this.add
      .text(40, 40, "Back", settingsButtonStyle)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (this.previousSceneKey === "PauseScene") {
          this.scene.stop("SettingScene");
          this.scene.launch("PauseScene");
        } else {
          this.scene.switch("MenuScene");
        }
      });

    // --- VSync Toggle ---
    this.toggleVSyncButton = this.add
      .text(winProps.gameWidth / 2, winProps.gameHeight / 2, "", settingsButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.disableVSync = await window.myUniqueElectronAPI.getSetting("disableVSync") as boolean;
    this.updateVSyncButtonText();

    this.toggleVSyncButton.on("pointerdown", async () => {
      this.disableVSync = !this.disableVSync;
      this.updateVSyncButtonText();
      await window.myUniqueElectronAPI.setSetting("disableVSync", this.disableVSync);

      alert("VSync setting changed. The application will now restart for changes to take effect.");
    });

    // --- FullScreen Toggle ---
    this.toggleFullScreenButton = this.add
      .text(winProps.gameWidth / 2, 450, "", settingsButtonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.disableFullScreen = await window.myUniqueElectronAPI.getSetting("disableFullScreen") as boolean;
    this.updateFullScreenButtonText();

    this.toggleFullScreenButton.on("pointerdown", async () => {
      this.disableFullScreen = !this.disableFullScreen;
      this.updateFullScreenButtonText();
      await window.myUniqueElectronAPI.setSetting("disableFullScreen", this.disableFullScreen);
      window.myUniqueElectronAPI.toggleFullScreen(!this.disableFullScreen);
    });
  }

  updateVSyncButtonText(): void {
    this.toggleVSyncButton.setText(`VSync: ${this.disableVSync ? "Disabled" : "Enabled"}`);
  }
  updateFullScreenButtonText(): void {
    this.toggleFullScreenButton.setText(
      `FullScreen: ${this.disableFullScreen ? "Disabled" : "Enabled"}`
    );
  }
}
