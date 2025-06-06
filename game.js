//game.js

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("player", "assets/cat.webp");
  }

  create() {
    const xPos = this.cameras.main.centerX;
    const yPos = this.cameras.main.centerY;
    this.player = new Player(this, xPos, yPos + 50, "player");
  }

  update(time, delta) {
    if (this.player) {
      this.player.update(time, delta);
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: 1420,
  height: 800,
  backgroundColor: "#000000",
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);
