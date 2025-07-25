import { Player } from "../player.ts";

interface PlayerDefaults {
  x: number;
  y: number;
  texture: string;
  frame: string | null;
  initialDamage: number;
  initialSpeed: number;
  initialHealth: number;
  level: number;
  name: string;
}

type PlayerOverrides = Partial<PlayerDefaults>;

/**
 * Returns the default player properties
 */
export const getPlayerDefaults = (x: number, y:number): PlayerDefaults => ({
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
 */
export const createPlayerWithTag = (scene: Phaser.Scene, x: number, y: number, overrides: PlayerOverrides = {}): {player: Player, playerNameTag: Phaser.GameObjects.Text} => {
  const defaults = getPlayerDefaults(x, y);
  const playerProps = { ...defaults, ...overrides };

  const playerFrame: string | number = playerProps.frame === null ? 0 : playerProps.frame;

  const player = new Player(
    scene,
    playerProps.x,
    playerProps.y,
    playerProps.texture,
    playerFrame,
    playerProps.initialDamage,
    playerProps.initialSpeed,
    playerProps.initialHealth,
    playerProps.level,
    playerProps.name
  );

   const nameTagYOffset =
    (player.displayHeight || (player.body as Phaser.Physics.Arcade.Body).height) / 2 + 10;
  const playerNameTag = scene.add
    .text(player.x, player.y - nameTagYOffset, `|${defaults.name}|`, {
      font: "26px Arial",
      color: "#ffffff",
      backgroundColor: "#00000080",
      padding: { x: 5, y: 2 },
      align: "center",
    })
    .setOrigin(0.5)
    .setScrollFactor(1);

  return { player, playerNameTag };
};
