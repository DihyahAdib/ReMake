//pauseMenu.js
import { gameWidth, gameHeight } from "../game.js";

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0.4)");

    const UiDim = {
      panelWidth: 600,
      panelHeight: 800,
    };

    this.dimBackground = this.add
      .rectangle(
        this.gameWidth / 2,
        this.gameHeight / 2,
        this.gameWidth,
        this.gameHeight,
        0x000000,
        0.4
      )
      .setVisible(false);

    const panel = this.add.graphics();
    const topPanel = this.add.graphics();
    const btmPanel = this.add.graphics();

    panel.fillStyle(0x000000, 0.6);
    topPanel.fillStyle(0x000000, 1);
    btmPanel.fillStyle(0x000000, 1);

    panel.fillRoundedRect(0, 0, UiDim.panelWidth, UiDim.panelHeight, 20);
    topPanel.fillRect(0, 0); // finish top and bottom black bars here

    this.uiContainer = this.add.container(gameWidth / 2, gameHeight / 2);
    this.uiContainer.add(panel);

    panel.setPosition(-UiDim.panelWidth / 2, -UiDim.panelHeight / 2);

    const resumeBtn = this.add
      .text(0, -100, "Resume", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#555",
        padding: { x: 20, y: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    resumeBtn.on("pointerdown", () => {
      this.hideUIPanel();
    });

    this.uiContainer.add(resumeBtn);

    this.uiContainer.setScale(0);
    this.uiContainer.setAlpha(0);
    this.uiContainer.setVisible(false);

    this.showUIPanel();
  }

  showUIPanel() {
    this.uiContainer.setVisible(true);
    this.dimBackground.setVisible(true);

    this.tweens.add({
      targets: this.uiContainer,
      scale: 1,
      alpha: 1,
      ease: "Back.Out",
      duration: 400,
    });
  }

  hideUIPanel() {
    this.tweens.add({
      targets: this.uiContainer,
      scale: 0,
      alpha: 0,
      ease: "Back.In",
      duration: 300,
      onComplete: () => {
        this.uiContainer.setVisible(false);
        this.dimBackground.setVisible(false);
        this.scene.stop("PauseScene");
        this.scene.resume("GameScene");
      },
    });
  }
}
