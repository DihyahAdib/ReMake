//screenUtils.js

// Global Variables

/**
 * Returns the initial width of the user's game screen (from Electron API).
 * @returns {number}
 */
export const gameWidth = window.myUniqueElectronAPI.screenSize.width;

/**
 * Returns the initial height of the user's game screen (from Electron API).
 * @returns {number}
 */
export const gameHeight = window.myUniqueElectronAPI.screenSize.height;

/**
 * Returns the center X position of the initial window area.
 * @returns {number}
 */
export const windowCenterX = gameWidth / 2;

/**
 * Returns the center Y position of the initial window area.
 * @returns {number}
 */
export const windowCenterY = gameHeight / 2;

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
