//screenUtils.js
export const winProps = {
    gameWidth: window.myUniqueElectronAPI.screenSize.width,
    gameHeight: window.myUniqueElectronAPI.screenSize.height,
    get windowCenterX() {
        return this.gameWidth / 2;
    },
    get windowCenterY() {
        return this.gameHeight / 2;
    },
    getCurrentGameWidth(scene) {
        return scene.scale.width;
    },
    getCurrentGameHeight(scene) {
        return scene.scale.height;
    },
    getCurrentGameCenterX(scene) {
        return this.getCurrentGameWidth(scene) / 2;
    },
    getCurrentGameCenterY(scene) {
        return this.getCurrentGameHeight(scene) / 2;
    },
};
;
;
export const rmProps = {
    roomPaddingWidth: 160,
    roomPaddingHeight: 80,
    doorPaddingWidth: 400,
    doorPaddingHeight: 400,
    leftRightOffset: 180,
    topBottomOffset: 150,
    doorThickness: 50,
};
export function getRoomDimensions() {
    return {
        innerRoomWidth: winProps.gameWidth - rmProps.roomPaddingWidth,
        innerRoomHeight: winProps.gameHeight - rmProps.roomPaddingHeight,
        roomOffsetX: rmProps.roomPaddingWidth / 2,
        roomOffsetY: rmProps.roomPaddingHeight / 2,
        doorWidth: winProps.windowCenterX - rmProps.doorPaddingWidth,
        doorHeight: winProps.windowCenterY - rmProps.doorPaddingHeight,
    };
}
;
