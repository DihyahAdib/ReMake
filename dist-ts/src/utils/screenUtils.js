"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rmProps = exports.winProps = void 0;
exports.getRoomDimensions = getRoomDimensions;
//screenUtils.js
exports.winProps = {
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
exports.rmProps = {
    roomPaddingWidth: 160,
    roomPaddingHeight: 80,
    doorPaddingWidth: 400,
    doorPaddingHeight: 400,
    leftRightOffset: 180,
    topBottomOffset: 150,
    doorThickness: 50,
};
function getRoomDimensions() {
    return {
        innerRoomWidth: exports.winProps.gameWidth - exports.rmProps.roomPaddingWidth,
        innerRoomHeight: exports.winProps.gameHeight - exports.rmProps.roomPaddingHeight,
        roomOffsetX: exports.rmProps.roomPaddingWidth / 2,
        roomOffsetY: exports.rmProps.roomPaddingHeight / 2,
        doorWidth: exports.winProps.windowCenterX - exports.rmProps.doorPaddingWidth,
        doorHeight: exports.winProps.windowCenterY - exports.rmProps.doorPaddingHeight,
    };
}
;
