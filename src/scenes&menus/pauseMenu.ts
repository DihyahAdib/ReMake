//pauseMenu.js

export class PauseScene extends Phaser.Scene {
  canAccessPauseMenu: boolean = true;
  interactionCoolDown: number = 500;

  pauseMenuContainer: HTMLElement | null = null;
  resumeButton: HTMLElement | null = null;
  settingButton: HTMLElement | null = null;
  public keys: { Esc?: Phaser.Input.Keyboard.Key} = {};

  constructor() {
    super({ key: "PauseScene" });
  }

  create(): void {
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");

    this.keys = this.input.keyboard!.addKeys({
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    }) as { Esc: Phaser.Input.Keyboard.Key};

    this.pauseMenuContainer = document.getElementById("pause-menu-container");
    this.resumeButton = document.getElementById("resume-button");
    this.settingButton = document.getElementById("settings-button");

    if (this.resumeButton) {
      this.resumeButton.addEventListener("pointerdown", () => {
        if (this.canAccessPauseMenu) {
          this.hideUIPanel();
        }
      });
    }

    if (this.settingButton) {
      this.settingButton.addEventListener("pointerdown", () => {
        this.hideUIPanel();
        this.scene.stop("PauseScene");
        this.scene.launch("settingScene");
      });
    }

    if (this.pauseMenuContainer) {
      this.pauseMenuContainer.classList.remove("visible");
    }
    this.showUIPanel();
  }

  update(): void {
    if (this.canAccessPauseMenu && this.keys?.Esc && Phaser.Input.Keyboard.JustDown(this.keys.Esc)) {
      if (this.pauseMenuContainer?.classList.contains("visible")) {
        this.hideUIPanel();
      } else {
        this.showUIPanel();
      }
    }
  }

  public showUIPanel(): void {
    this.canAccessPauseMenu = false;

    if (this.pauseMenuContainer) {
      this.pauseMenuContainer.classList.add("visible");
    }

    this.time.delayedCall(
      300,
      () => {
        this.canAccessPauseMenu = true;
      },
      [],
      this
    );
  }

  hideUIPanel() {
    this.canAccessPauseMenu = false;

    if (this.pauseMenuContainer) {
      this.pauseMenuContainer.classList.remove("visible");
    }

    this.time.delayedCall(
      300,
      () => {
        this.scene.stop("PauseScene");
        this.scene.resume("GameScene");
        this.canAccessPauseMenu = true;
      },
      [],
      this
    );
  }
}
