//screenUtils.js

/**
 * The width of the current game screen, retrieved from the Electron screen API.
 * @type {number}
 */
export const gameWidth = window.myUniqueElectronAPI.screenSize.width;

/**
 * The height of the current game screen, retrieved from the Electron screen API.
 * @type {number}
 */
export const gameHeight = window.myUniqueElectronAPI.screenSize.height;

/**
 *  The center of the playable area (X axis)
 * @type {number}
 */
export const innerRoomCenterX = gameWidth / 2;

/**
 *  The center of the playable area (Y axis)
 * @type {number}
 */
export const innerRoomCenterY = gameHeight / 2;

/**
 * @typedef {Object} RoomProperties
 * @property {number} roomPaddingWidth - Horizontal padding inside the room layout.
 * @property {number} roomPaddingHeight - Vertical padding inside the room layout.
 * @property {number} doorPaddingWidth - Extra width reserved for door placement.
 * @property {number} doorPaddingHeight - Extra height reserved for door placement.
 * @property {number} leftRightOffset - Offset from the left/right edges for positioning elements.
 * @property {number} topBottomOffset - Offset from the top/bottom edges for positioning elements.
 * @property {number} doorThickness - Thickness of the door in pixels.
 */

/** @type {RoomProperties} - Dimensions are in pixels. */
export const rmProps = {
  roomPaddingWidth: 160,
  roomPaddingHeight: 80,
  doorPaddingWidth: 400,
  doorPaddingHeight: 400,
  leftRightOffset: 180,
  topBottomOffset: 150,
  doorThickness: 50,
};
