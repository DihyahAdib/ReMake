//pauseMenu.js
import { gameHeight, gameWidth } from "../utils/screenUtils.js";

export class PauseScene extends Phaser.Scene {
  UiDim = {
    panelWidth: 700,
    panelHeight: 900,
    barWidth: 200,
    barHeight: 140,
    lineThickness: 8,
  };

  canAccessPauseMenu = true;
  interactionCoolDown = 500;

  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");

    this.dimBackground = this.add
      .rectangle(
        this.getCurrentGameCenterX(),
        this.getCurrentGameCenterY(),
        this.getCurrentGameWidth(),
        this.getCurrentGameHeight(),
        0x000000
      )
      .setAlpha(0)
      .setDepth(0)
      .setVisible(false);

    // Top Bar
    this.topBar = this.add
      .rectangle(
        this.getCurrentGameCenterY(),
        -this.UiDim.barHeight / 2,
        this.getCurrentGameWidth(),
        this.UiDim.barHeight,
        0x774b2a,
        1
      )
      .setDepth(10);

    // REPLACE ALL STAGNANT GAMEWIDTHS WITH THE CURRENT NEW FUNCTIONS this.getCurrentGameWidth() ETC.
    this.topBarInnerLine = this.add
      .rectangle(
        gameWidth / 2,
        -this.UiDim.barHeight + this.UiDim.lineThickness / 2,
        gameWidth,
        this.UiDim.lineThickness,
        0x000000,
        1
      )
      .setDepth(11);
    this.topBarInnerLine.setOrigin(0.5, 0);
    this.topBarInnerLine.setVisible(false);

    // Bottom Bar
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

    this.bottomBarInnerLine = this.add
      .rectangle(
        gameWidth / 2,
        gameHeight + this.UiDim.barHeight / 2 - this.UiDim.lineThickness / 2,
        gameWidth,
        this.UiDim.lineThickness,
        0x000000,
        1
      )
      .setDepth(11);
    this.bottomBarInnerLine.setOrigin(0.5, 1);
    this.bottomBarInnerLine.setVisible(false);

    // Left Bar
    this.leftBar = this.add
      .rectangle(
        -this.UiDim.barWidth / 2,
        gameHeight / 2,
        this.UiDim.barWidth,
        gameHeight,
        0x774b2a,
        1
      )
      .setDepth(10);

    this.leftBarInnerLine = this.add
      .rectangle(
        -this.UiDim.barWidth + this.UiDim.lineThickness / 2,
        gameHeight / 2,
        this.UiDim.lineThickness,
        gameHeight,
        0x000000,
        1
      )
      .setDepth(11);
    this.leftBarInnerLine.setOrigin(0, 0.5);
    this.leftBarInnerLine.setVisible(false);

    // Right Bar
    this.rightBar = this.add
      .rectangle(
        gameWidth + this.UiDim.barWidth / 2,
        gameHeight / 2,
        this.UiDim.barWidth,
        gameHeight,
        0x774b2a,
        1
      )
      .setDepth(10);

    this.rightBarInnerLine = this.add
      .rectangle(
        gameWidth + this.UiDim.barWidth / 2 - this.UiDim.lineThickness / 2,
        gameHeight / 2,
        this.UiDim.lineThickness,
        gameHeight,
        0x000000,
        1
      )
      .setDepth(11);
    this.rightBarInnerLine.setOrigin(1, 0.5);
    this.rightBarInnerLine.setVisible(false);

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
      if (this.canAccessPauseMenu) {
        this.hideUIPanel();
      }
    });

    this.uiContainer.add(resumeBtn);

    const settingsBtn = this.add
      .text(0, 0, "Settings", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#ffffff",
        backgroundColor: "#555",
        padding: { x: 20, y: 10 },
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    settingsBtn.on("pointerdown", () => {
      this.scene.stop("PauseScene");
      this.scene.launch("SettingScene", { from: "PauseScene" });
    });

    // const restartBtn = this.add.text(0, 0, "Restart", {})

    this.uiContainer.add(settingsBtn);

    this.uiContainer.setScale(0);
    this.uiContainer.setAlpha(0);
    this.uiContainer.setDepth(4);
    this.uiContainer.setVisible(false);

    this.keys = this.input.keyboard.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.showUIPanel();
  }

  update() {
    if (this.canAccessPauseMenu && this.keys && Phaser.Input.Keyboard.JustDown(this.keys.Esc)) {
      if (this.uiContainer.visible) {
        this.hideUIPanel();
      }
    }
  }

  showUIPanel() {
    this.canAccessPauseMenu = false;

    this.uiContainer.setVisible(true);
    this.dimBackground.setVisible(true);
    this.topBarInnerLine.setVisible(true);
    this.bottomBarInnerLine.setVisible(true);
    this.leftBarInnerLine.setVisible(true);
    this.rightBarInnerLine.setVisible(true);

    // Animate top bar in
    const topBarTargetY = this.UiDim.barHeight / 2;
    const bottomBarTargetY = gameHeight - this.UiDim.barHeight / 2;

    const topBarLineTargetY = this.UiDim.barHeight - this.UiDim.lineThickness / 2;
    const bottomBarLineTargetY = gameHeight - this.UiDim.barHeight + this.UiDim.lineThickness / 2;

    this.tweens.add({
      targets: this.topBar,
      y: topBarTargetY,
      ease: "Cubic.Out",
      duration: 400,
    });
    // Animate top bar inner line
    this.tweens.add({
      targets: this.topBarInnerLine,
      y: topBarLineTargetY,
      ease: "Cubic.Out",
      duration: 300,
    });

    // Animate bottom bar in
    this.tweens.add({
      targets: this.bottomBar,
      y: bottomBarTargetY,
      ease: "Cubic.Out",
      duration: 400,
    });

    // Animate bottom bar inner line
    this.tweens.add({
      targets: this.bottomBarInnerLine,
      y: bottomBarLineTargetY,
      ease: "Cubic.Out",
      duration: 300,
    });

    // Animate left bar in
    const leftBarTargetX = 90 - this.UiDim.barWidth / 2;
    this.tweens.add({
      targets: this.leftBar,
      x: leftBarTargetX,
      ease: "Cubic.Out",
      duration: 400,
    });
    // Animate left bar inner line
    const leftBarLineTargetX =
      leftBarTargetX + this.UiDim.barWidth / 2 - this.UiDim.lineThickness / 2;
    this.tweens.add({
      targets: this.leftBarInnerLine,
      x: leftBarLineTargetX,
      ease: "Cubic.Out",
      duration: 300,
    });

    // Animate right bar in
    const rightBarTargetX = gameWidth - 90 + this.UiDim.barWidth / 2;
    this.tweens.add({
      targets: this.rightBar,
      x: rightBarTargetX,
      ease: "Cubic.Out",
      duration: 400,
    });
    // Animate right bar inner line
    const rightBarLineTargetX =
      rightBarTargetX - this.UiDim.barWidth / 2 + this.UiDim.lineThickness / 2;
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

    // Animate top bar out
    const topBarHideY = -this.UiDim.barHeight / 2;
    this.tweens.add({
      targets: this.topBar,
      y: topBarHideY,
      ease: "Cubic.In",
      duration: 300,
    });
    // Animate top bar inner line out
    const topBarLineHideY = -this.UiDim.barHeight + this.UiDim.lineThickness / 2;
    this.tweens.add({
      targets: this.topBarInnerLine,
      y: topBarLineHideY,
      ease: "Cubic.In",
      duration: 300,
    });

    // Animate bottom bar out
    const bottomBarHideY = gameHeight + this.UiDim.barHeight / 2;
    this.tweens.add({
      targets: this.bottomBar,
      y: bottomBarHideY,
      ease: "Cubic.In",
      duration: 300,
    });
    // Animate bottom bar inner line out
    const bottomBarLineHideY = gameHeight + this.UiDim.barHeight / 2 - this.UiDim.lineThickness / 2;
    this.tweens.add({
      targets: this.bottomBarInnerLine,
      y: bottomBarLineHideY,
      ease: "Cubic.In",
      duration: 300,
    });

    // Animate left bar out
    const leftBarHideX = -this.UiDim.barWidth / 2;
    this.tweens.add({
      targets: this.leftBar,
      x: leftBarHideX,
      ease: "Cubic.In",
      duration: 300,
    });
    // Animate left bar inner line out
    const leftBarLineHideX = -this.UiDim.barWidth + this.UiDim.lineThickness / 2;
    this.tweens.add({
      targets: this.leftBarInnerLine,
      x: leftBarLineHideX,
      ease: "Cubic.In",
      duration: 300,
    });

    // Animate right bar out
    const rightBarHideX = gameWidth + this.UiDim.barWidth / 2;
    this.tweens.add({
      targets: this.rightBar,
      x: rightBarHideX,
      ease: "Cubic.In",
      duration: 300,
    });
    // Animate right bar inner line out
    const rightBarLineHideX = gameWidth + this.UiDim.barWidth / 2 - this.UiDim.lineThickness / 2;
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
  /**
   * Returns the current game width (fullscreen or windowed) from a Phaser Scene.
   * @returns {Phaser.Scene.scale.width}
   */
  getCurrentGameWidth() {
    return this.scale.width;
  }

  /**
   * Returns the current game height (fullscreen or windowed) from a Phaser Scene.
   * @returns {Phaser.Scene.scale.height}
   */
  getCurrentGameHeight() {
    return this.scale.height;
  }

  /**
   * Returns the center of the X axis, of the current game area (fullscreen or windowed) from a Phaser Scene.
   */
  getCurrentGameCenterX() {
    return this.getCurrentGameWidth() / 2;
  }

  /**
   * Returns the center of the Y axis, of the current game area (fullscreen or windowed) from a Phaser Scene.
   */
  getCurrentGameCenterY() {
    return this.getCurrentGameHeight() / 2;
  }
}
