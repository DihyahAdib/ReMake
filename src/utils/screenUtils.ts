//screenUtils.js
export const winProps = {
  gameWidth: window.myUniqueElectronAPI.screenSize.width as number,
  gameHeight: window.myUniqueElectronAPI.screenSize.height as number,
  get windowCenterX() {
    return this.gameWidth / 2;
  },
  get windowCenterY() {
    return this.gameHeight / 2;
  },
  getCurrentGameWidth(scene: Phaser.Scene) {
  return scene.scale.width;
  },
  getCurrentGameHeight(scene: Phaser.Scene) {
    return scene.scale.height;
  },
  getCurrentGameCenterX(scene: Phaser.Scene) {
    return this.getCurrentGameWidth(scene) / 2;
  },
  getCurrentGameCenterY(scene: Phaser.Scene) {
    return this.getCurrentGameHeight(scene) / 2;
  },
};

export interface RoomProperties {
  roomPaddingWidth: number;
  roomPaddingHeight: number;
  doorPaddingWidth: number;
  doorPaddingHeight: number;
  leftRightOffset: number;
  topBottomOffset: number;
  doorThickness: number;
};

export interface RoomDimensions {
  innerRoomWidth: number;
  innerRoomHeight: number;
  roomOffsetX: number;
  roomOffsetY: number;
  doorWidth: number;
  doorHeight: number;
};

export const rmProps: RoomProperties = {
  roomPaddingWidth: 160,
  roomPaddingHeight: 80,
  doorPaddingWidth: 400,
  doorPaddingHeight: 400,
  leftRightOffset: 180,
  topBottomOffset: 150,
  doorThickness: 50,
};

export function getRoomDimensions(): RoomDimensions {
  return {
    innerRoomWidth: winProps.gameWidth - rmProps.roomPaddingWidth,
    innerRoomHeight: winProps.gameHeight - rmProps.roomPaddingHeight,
    roomOffsetX: rmProps.roomPaddingWidth / 2,
    roomOffsetY: rmProps.roomPaddingHeight / 2,
    doorWidth: winProps.windowCenterX - rmProps.doorPaddingWidth,
    doorHeight: winProps.windowCenterY - rmProps.doorPaddingHeight,
  }
};