//pauseMenu.js
import { gameHeight, gameWidth } from "../utils/screenUtils.js";

export class PauseScene extends Phaser.Scene {
  UiDim = {
    panelWidth: 700,
    panelHeight: 900,
    barHeight: 90,
  };

  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");

    this.dimBackground = this.add
      .rectangle(gameWidth / 2, gameHeight / 2, gameWidth, gameHeight, 0x000000)
      .setAlpha(0)
      .setDepth(0)
      .setVisible(false);

    this.topBar = this.add
      .rectangle(
        gameWidth / 2,
        -this.UiDim.barHeight / 2,
        gameWidth,
        this.UiDim.barHeight,
        0x774b2a,
        1
      )
      .setDepth(10);

    this.bottomBar = this.add
      .rectangle(
        gameWidth / 2,
        gameHeight + this.UiDim.barHeight / 2,
        gameWidth,
        this.UiDim.barHeight,
        0x774b2a,
        1
      )
      .setDepth(10);

    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.6);
    panel.fillRect(0, 0, this.UiDim.panelWidth, this.UiDim.panelHeight);

    this.uiContainer = this.add.container(gameWidth / 2, gameHeight / 2);
    this.uiContainer.add(panel);

    panel.setPosition(-this.UiDim.panelWidth / 2, -this.UiDim.panelHeight / 2);

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
    this.uiContainer.setDepth(4);
    this.uiContainer.setVisible(false);

    this.showUIPanel();
  }

  showUIPanel() {
    this.uiContainer.setVisible(true);

    this.dimBackground.setVisible(true);

    const topBarTargetY = gameHeight / 2 - this.UiDim.panelHeight / 2 - this.UiDim.barHeight / 2;
    const bottomBarTargetY = gameHeight / 2 + this.UiDim.panelHeight / 2 + this.UiDim.barHeight / 2;

    this.tweens.add({
      targets: this.topBar,
      y: topBarTargetY, // Target position for top bar
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.bottomBar,
      y: bottomBarTargetY, // Target position for bottom bar
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.uiContainer,
      scale: 1,
      alpha: 1,
      ease: "Back.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.dimBackground,
      alpha: 0.4,
      ease: "Linear",
      duration: 400,
      // onComplete: () => {
      //   this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0.4)");
      // },
    });
  }

  hideUIPanel() {
    const topBarHideY = -this.UiDim.barHeight / 2;
    const bottomBarHideY = gameHeight + this.UiDim.barHeight / 2;

    this.tweens.add({
      targets: this.topBar,
      y: topBarHideY, // Move top bar off-screen up
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.bottomBar,
      y: bottomBarHideY, // Move bottom bar off-screen down
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.uiContainer,
      scale: 0,
      alpha: 0,
      ease: "Back.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.dimBackground,
      alpha: 0, // Fade out
      ease: "Linear",
      duration: 300,
      onComplete: () => {
        this.uiContainer.setVisible(false);
        this.dimBackground.setVisible(false);
        this.scene.stop("PauseScene");
        this.scene.resume("GameScene");
      },
    });

    this.tweens.add({
      targets: this.cameras.main,
      backgroundColor: { start: 0x00000066, to: 0x00000000 },
      duration: 300,
      ease: "Linear",
    });
  }
}
