//screenUtils.js

export interface RoomProperties {
  roomPaddingWidth: number;
  roomPaddingHeight: number;
  doorPaddingWidth: number;
  doorPaddingHeight: number;
  leftRightOffset: number;
  topBottomOffset: number;
  doorThickness: number;
};

export const gameWidth: number = window.myUniqueElectronAPI.screenSize.width;
export const gameHeight: number = window.myUniqueElectronAPI.screenSize.height;

export const windowCenterX: number = gameWidth / 2;
export const windowCenterY: number = gameHeight / 2;

export const rmProps: RoomProperties = {
  roomPaddingWidth: 160,
  roomPaddingHeight: 80,
  doorPaddingWidth: 400,
  doorPaddingHeight: 400,
  leftRightOffset: 180,
  topBottomOffset: 150,
  doorThickness: 50,
};

export function getCurrentGameWidth(scene: Phaser.Scene) {
  return scene.scale.width;
}
export function getCurrentGameHeight(scene: Phaser.Scene) {
  return scene.scale.height;
}

export function getCurrentGameCenterX(scene: Phaser.Scene) {
  return getCurrentGameWidth(scene) / 2;
}

export function getCurrentGameCenterY(scene: Phaser.Scene) {
  return getCurrentGameHeight(scene) / 2;
}
