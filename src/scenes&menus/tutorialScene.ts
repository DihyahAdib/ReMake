//tutorialScene
import { createPlayerWithTag } from "../player.js";
import { winProps } from "../utils/screenUtils.js";

export class TutorialScene extends Phaser.Scene {
  player: Phaser.Physics.Arcade.Sprite & {update: (time: number, delta: number) => void} | null = null;
  playerNameTag: Phaser.GameObjects.Text | null = null;
  keys: any = null;

  constructor() {
    super({ key: "TutorialScene" });
  }

  preload(): void {
    this.load.image("player", "assets/Cat.png");
  }

  create(): void {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.cameras.main.setBackgroundColor("rgb(192, 192, 192)");

    const xPos = this.cameras.main.centerX;
    const yPos = this.cameras.main.centerY;

    const { player, playerNameTag } = createPlayerWithTag(this, xPos, yPos, {
      initialSpeed: 150,
    });

    this.player = player;
    this.playerNameTag = playerNameTag;

    this.add
      .text(xPos, 100, "Welcome to the Tutorial!", {
        fontSize: "40px",
        color: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(xPos, yPos + 150, "Use WASD to move", {
        fontSize: "24px",
        color: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    const continueButton = this.add
      .text(xPos, winProps.gameHeight - 100, "Continue", {
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#007BFF",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    continueButton.on("pointerdown", async () => {
      await window.myUniqueElectronAPI.setSetting("hasSeenTutorial", true);
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.switch("GameScene");
      });
    });

    const skipTutorialButton = this.add
      .text(xPos, winProps.gameHeight - 50, "Skip Tutorial", {
        fontSize: "20px",
        color: "#999",
        backgroundColor: "#333",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    skipTutorialButton.on("pointerdown", async () => {
      await window.myUniqueElectronAPI.setSetting("hasSeenTutorial", true);
      this.scene.start("GameScene");
    });
  }

  update(time: number, delta: number) {
    if (this.player && this.playerNameTag) {
      this.player.update(time, delta);
      const nameTagYOffset = this.player.displayHeight / 2 + 10;
      this.playerNameTag.x = this.player.x;
      this.playerNameTag.y = this.player.y - nameTagYOffset;
    }
  }
}
