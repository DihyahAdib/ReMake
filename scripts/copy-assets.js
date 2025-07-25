const fs = require("fs-extra");
const path = require("path");

const sourceDir = path.resolve(__dirname, "..", "src");
const destDir = path.resolve(__dirname, "..", "dist-ts", "src");
const nodeModuleDir = path.resolve(__dirname, "..", "node_modules");

try {
  fs.ensureDirSync(destDir);

  fs.copySync(path.join(sourceDir, "index.html"), path.join(destDir, "index.html"));
  console.log("Copied index.html");

  const cssSource = path.join(sourceDir, "css");
  const cssDest = path.join(destDir, "css");
  if (fs.existsSync(cssSource)) {
    fs.copySync(cssSource, cssDest, { overwrite: true });
    console.log("Copied css folder");
  }

  const assetsSource = path.join(sourceDir, "assets");
  const assetsDest = path.join(destDir, "assets");
  if (fs.existsSync(assetsSource)) {
    fs.copySync(assetsSource, assetsDest, { overwrite: true });
    console.log("Copied assets folder");
  }

  const phaserSource = path.join(nodeModuleDir, "phaser", "dist", "phaser.min.js");
  const phaserDestDir = path.join(destDir, "lib");
  const phaserDest = path.join(phaserDestDir, "phaser.min.js");

  fs.ensureDirSync(phaserDestDir);
  fs.copySync(phaserSource, phaserDest, { overwrite: true });
  console.log("Copied phaser.min.js");

  console.log("Assets copied successfully!");
} catch (er) {
  console.error("Error copying assets:", er);
  process.exit(1);
}
