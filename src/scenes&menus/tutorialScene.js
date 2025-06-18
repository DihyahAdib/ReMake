//tutorialScene
import { createPlayerWithTag } from "../utils/playerUtils.js";
import { gameHeight, gameWidth } from "../game.js";
export class TutorialScene extends Phaser.Scene {
  player = null;
  playerNameTag = null;
  keys = null;

  constructor() {
    super({ key: "TutorialScene" });
  }

  preload() {
    this.load.image("player", "assets/Cat.png");
  }

  create() {
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
        fill: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(xPos, yPos + 150, "Use WASD to move", {
        fontSize: "24px",
        fill: "#000",
        align: "center",
      })
      .setOrigin(0.5);

    const continueButton = this.add
      .text(xPos, gameHeight - 100, "Continue", {
        fontSize: "32px",
        fill: "#fff",
        backgroundColor: "#007BFF",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    continueButton.on("pointerdown", async () => {
      await window.myUniqueElectronAPI.setSetting("hasSeenTutorial", true);
      this.cameras.main.fadeOut(1000, 0, 0, 0); // Fade to black
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.switch("GameScene");
      });
    });

    const skipTutorialButton = this.add
      .text(xPos, gameHeight - 50, "Skip Tutorial", {
        fontSize: "20px",
        fill: "#999",
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

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta);
      const nameTagYOffset = this.player.displayHeight / 2 + 10;
      this.playerNameTag.x = this.player.x;
      this.playerNameTag.y = this.player.y - nameTagYOffset;
    }
  }
}

// export class TutorialScene2 extends Phaser.Scene {
//   player = null;
//   playerNameTag = null;
//   keys = null;

//   constructor() {
//     super({ key: "TScene2" });
//   }

//   preload() {
//     this.load.image("player", "assets/Cat.png");
//   }

//   create() {
//     this.cameras.main.fadeIn(1000, 0, 0, 0);
//     this.cameras.main.setBackgroundColor("rgb(192, 192, 192)");

//     const xPos = this.cameras.main.centerX;
//     const yPos = this.cameras.main.centerY;

//     const { player, playerNameTag } = createPlayerWithTag(this, xPos, yPos, {
//       initialSpeed: 150,
//     });
//     this.player = player;
//     this.playerNameTag = playerNameTag;
//   }

//   update(time, delta) {
//     if (this.player) {
//       this.player.update(time, delta);
//       const nameTagYOffset = this.player.displayHeight / 2 + 10;
//       this.playerNameTag.x = this.player.x;
//       this.playerNameTag.y = this.player.y - nameTagYOffset;
//     }
//   }
// }
