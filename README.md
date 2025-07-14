# ReMake Game

A top-down, room-based adventure game built with Phaser 3 and designed for desktop platforms using Electron. Explore interconnected rooms, battle enemies, pick up new weapons, and customize your experience through a soon to be dynamic combat system.

## Features

* **Dynamic Room System:** Navigate seamlessly between different rooms, each with unique layouts and challenges.

* **Player Combat & Inventory:** Engage in combat with enemies, manage player health, and collect weapons that enhance your abilities. Weapons are added to the player's inventory and visually equipped.

* **Responsive UI:** Menu with animated bars and a central panel provides access to game controls and settings.

* **Enemy AI:** Enemy AI for engaging combat encounters.

* **Physics & Collision:** Utilizes Phaser's Arcade Physics for robust collision detection and world bounds.

## Technologies Used

* **Phaser 3:** The fast, free, and fun HTML5 Game Framework.

* **JavaScript (ES6+)**: The core programming language.

* **Electron:** For wrapping the web game into a cross-platform desktop application.

* **Electron-Builder:** For creating distributable executables (`.exe`, `.dmg`, `.AppImage`).

## Getting Started

To run this game locally for development or to build a distributable version, follow these steps:

### Prerequisites

* Node.js (LTS version recommended)

* npm (comes with Node.js)

### Installation

1. **Clone the repository:**

```
git clone https://github.com/DihyahAdib/ReMake.git
cd ReMake
```

2. **Install dependencies:**

```
npm install
```

This will install Phaser, Electron, and Electron-Builder.

### Running in Development Mode

To run the game in a development Electron window (developer tools are already enabled, you can disable it in `main.js`):

```
npm start
```

### Building Executables

To package your game into a distributable executable for Windows, macOS, or Linux:

1. **Ensure you have your application icons** in the `build/` directory (e.g., `build/icon.ico`, `build/icon.icns`, `build/icon.png`) as configured in `package.json`.

2. **Run the build command:**
   ```
   npm run build
   ```
   The compiled executables and installers will be generated in the `dist/` directory.

## Project Structure
```
REMAKE/
├── node_modules/             # Project dependencies
├── src/                      # source code
│   ├── game.js               # Phaser game instance
│   ├── scenes&menus/         # Game scenes (MainMenu, GameScene, PauseMenu, SettingsMenu, TutorialScene)
│   ├── utils/                # Utility functions (screenUtils, playerUtils)
│   ├── enemy.js              # Enemy class
│   └── weapons.js            # Weapon class
├── assets/                   # Game assets (images, sounds, etc.)
├── index.html                # Main HTML file for the game
├── main.js                   # Electron main process script
├── preload.js                # Electron preload script for IPC
└── package.json              # Project configuration and build settings
```

## Roadmap / Future Plans
* More diverse enemies and boss battles.

* Additional weapon types and abilities.

* Player leveling and skill trees.

* More complex room layouts and environmental puzzles.

* Sound effects and background music.

* Save/load game functionality.

## Contributing
If you want to be a bug tester or give me feedback, you're free to make an ‘issues’ post or contact me by email/discord.\
Email: muhanddis4ever@gmail.com\
Discord username: ultimatescripted

## License

I might use the [MIT License](https://opensource.org/license/mit). I havent deployed this project yet.

## Credits

* **Game Development:** \[SeamlessError / Dihyah Adib\]

* **Assets:** \[All assets are original and created by me, or they’re placeholder images until I make them.\]

* **Phaser Community:** For excellent documentation.

* **Electron & Electron-Builder:** ole reliable.
