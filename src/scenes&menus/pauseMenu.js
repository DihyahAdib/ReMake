//pauseMenu.js
import {
  windowCenterX,
  windowCenterY,
  getCurrentGameWidth,
  getCurrentGameHeight,
  getCurrentGameCenterX,
  getCurrentGameCenterY,
} from "../utils/screenUtils.js";

export class PauseScene extends Phaser.Scene {
  canAccessPauseMenu = true;
  interactionCoolDown = 500;

  // Reference to the HTML element
  pauseMenuContainer = null;
  resumeButton = null;
  settingButton = null;

  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");

    this.pauseMenuContainer = document.getElementById("pause-menu-container");
    this.resumeButton = document.getElementById("resume-button");
    this.settingsButton = document.getElementById("settings-button");

    this.keys = this.input.keyboard.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.resumeButton.addEventListener("pointerdown", () => {
      if (this.canAccessPauseMenu) {
        this.hideUIPanel();
      }
    });

    this.settingsButton.addEventListener("pointerdown", () => {
      this.hideUIPanel();
      this.scene.stop("PauseScene");
      this.scene.launch("settingScene", { from: "PauseScene" });
    });

    this.pauseMenuContainer.classList.remove("visible");
    this.showUIPanel();
  }

  update() {
    if (this.canAccessPauseMenu && this.keys && Phaser.Input.Keyboard.JustDown(this.keys.Esc)) {
      if (this.pauseMenuContainer.classList.contains("visible")) {
        this.hideUIPanel();
      }
    }
  }
  //something
  showUIPanel() {
    this.canAccessPauseMenu = false;

    const topBarTargetY = this.UiDim.barHeight / 2;
    const bottomBarTargetY = getCurrentGameHeight(this) - this.UiDim.barHeight / 2;

    const topBarLineTargetY = this.UiDim.barHeight - this.UiDim.lineThickness / 2;
    const bottomBarLineTargetY =
      getCurrentGameHeight(this) - this.UiDim.barHeight + this.UiDim.lineThickness / 2;

    const leftBarTargetX = 90 - this.UiDim.barWidth / 2;
    const leftBarLineTargetX =
      leftBarTargetX + this.UiDim.barWidth / 2 - this.UiDim.lineThickness / 2;

    const rightBarTargetX = getCurrentGameWidth(this) - 90 + this.UiDim.barWidth / 2;
    const rightBarLineTargetX =
      rightBarTargetX - this.UiDim.barWidth / 2 + this.UiDim.lineThickness / 2;

    this.tweens.add({
      targets: this.topBar,
      y: topBarTargetY,
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.topBarInnerLine,
      y: topBarLineTargetY,
      ease: "Cubic.Out",
      duration: 300,
    });

    this.tweens.add({
      targets: this.bottomBar,
      y: bottomBarTargetY,
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.bottomBarInnerLine,
      y: bottomBarLineTargetY,
      ease: "Cubic.Out",
      duration: 300,
    });

    this.tweens.add({
      targets: this.leftBar,
      x: leftBarTargetX,
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.leftBarInnerLine,
      x: leftBarLineTargetX,
      ease: "Cubic.Out",
      duration: 300,
    });

    this.tweens.add({
      targets: this.rightBar,
      x: rightBarTargetX,
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.rightBarInnerLine,
      x: rightBarLineTargetX,
      ease: "Cubic.Out",
      duration: 300,
    });

    this.tweens.add({
      targets: this.uiContainer,
      scale: 1,
      alpha: 1,
      ease: "Cubic.Out",
      duration: 400,
    });

    this.tweens.add({
      targets: this.dimBackground,
      alpha: 0.4,
      ease: "Linear",
      duration: 400,
      onComplete: () => {
        this.canAccessPauseMenu = true;
      },
    });
  }

  hideUIPanel() {
    this.canAccessPauseMenu = false;

    const topBarHideY = -this.UiDim.barHeight / 2;
    const topBarLineHideY = -this.UiDim.barHeight + this.UiDim.lineThickness / 2;

    const bottomBarHideY = getCurrentGameHeight(this) + this.UiDim.barHeight / 2;
    const bottomBarLineHideY =
      getCurrentGameHeight(this) + this.UiDim.barHeight / 2 - this.UiDim.lineThickness / 2;

    const leftBarHideX = -this.UiDim.barWidth / 2;
    const leftBarLineHideX = -this.UiDim.barWidth + this.UiDim.lineThickness / 2;

    const rightBarHideX = getCurrentGameWidth(this) + this.UiDim.barWidth / 2;
    const rightBarLineHideX =
      getCurrentGameWidth(this) + this.UiDim.barWidth / 2 - this.UiDim.lineThickness / 2;

    this.tweens.add({
      targets: this.topBar,
      y: topBarHideY,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.topBarInnerLine,
      y: topBarLineHideY,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.bottomBar,
      y: bottomBarHideY,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.bottomBarInnerLine,
      y: bottomBarLineHideY,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.leftBar,
      x: leftBarHideX,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.leftBarInnerLine,
      x: leftBarLineHideX,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.rightBar,
      x: rightBarHideX,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.rightBarInnerLine,
      x: rightBarLineHideX,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.uiContainer,
      scale: 0,
      alpha: 0,
      ease: "Cubic.In",
      duration: 300,
    });

    this.tweens.add({
      targets: this.dimBackground,
      alpha: 0,
      ease: "Linear",
      duration: 300,
      onComplete: () => {
        this.uiContainer.setVisible(false);
        this.dimBackground.setVisible(false);
        this.topBarInnerLine.setVisible(false);
        this.bottomBarInnerLine.setVisible(false);
        this.leftBarInnerLine.setVisible(false);
        this.rightBarInnerLine.setVisible(false);

        this.scene.stop("PauseScene");
        this.scene.resume("GameScene");
        this.canAccessPauseMenu = true;
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
