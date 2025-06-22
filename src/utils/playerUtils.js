import { Player } from "../player.js";
/**
 * @param {number} x
 * @param {number} y
 * @returns {object}
 */

export const getPlayerDefaults = (x, y) => ({
  x,
  y,
  texture: "player",
  frame: null,
  initialDamage: 5,
  initialSpeed: 450,
  initialHealth: 100,
  level: 0,
  name: "Bon bon",
});

/**
 * Creates a Player instance and its associated name tag.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {object} [overrides={}]
 * @returns {{player: Player, playerNameTag: Phaser.GameObjects.Text}}
 */

export const createPlayerWithTag = (scene, x, y, overrides = {}) => {
  const defaults = getPlayerDefaults(x, y);
  const playerProps = { ...defaults, ...overrides };

  const player = new Player(
    scene,
    defaults.x,
    defaults.y,
    defaults.texture,
    defaults.frame,
    defaults.initialDamage,
    defaults.initialSpeed,
    defaults.initialHealth,
    defaults.level,
    defaults.name
  );

  const nameTagYOffset = (player.displayHeight || player.body.height) / 2 + 10;
  const playerNameTag = scene.add
    .text(player.x, player.y - nameTagYOffset, `|${defaults.name}|`, {
      font: "26px Arial",
      fill: "#ffffff",
      backgroundColor: "#00000080",
      padding: { x: 5, y: 2 },
      align: "center",
    })
    .setOrigin(0.5)
    .setScrollFactor(1);

  return { player, playerNameTag };
};
