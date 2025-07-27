const fs = require("fs-extra");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(projectRoot, "src"); // Original source (e.g., src/index.html, src/css)
const distTsDir = path.join(projectRoot, "dist-ts"); // The root of your compiled output
const distTsSrcDir = path.join(distTsDir, "src"); // Where index.html and its local assets should reside in dist-ts
const nodeModuleDir = path.join(projectRoot, "node_modules");

try {
  // Ensure target directories exist
  fs.ensureDirSync(distTsDir);
  fs.ensureDirSync(distTsSrcDir); // Ensure dist-ts/src exists for copied content

  // --- Copying static assets and HTML from src to dist-ts/src ---
  // These files are NOT processed by tsc, so they need to be explicitly copied.
  fs.copySync(path.join(sourceDir, "index.html"), path.join(distTsSrcDir, "index.html"));
  console.log("Copied index.html");

  const cssSource = path.join(sourceDir, "css");
  const cssDest = path.join(distTsSrcDir, "css");
  if (fs.existsSync(cssSource)) {
    fs.copySync(cssSource, cssDest, { overwrite: true });
    console.log("Copied css folder");
  }

  const assetsSource = path.join(sourceDir, "assets");
  const assetsDest = path.join(distTsSrcDir, "assets");
  if (fs.existsSync(assetsSource)) {
    fs.copySync(assetsSource, assetsDest, { overwrite: true });
    console.log("Copied assets folder");
  }
  const phaserSource = path.join(nodeModuleDir, "phaser", "dist", "phaser.min.js");
  const phaserDestDir = path.join(distTsSrcDir, "lib"); // Phaser goes into dist-ts/src/lib
  const phaserDest = path.join(phaserDestDir, "phaser.min.js");

  fs.ensureDirSync(phaserDestDir);
  fs.copySync(phaserSource, phaserDest, { overwrite: true });
  console.log("Copied phaser.min.js");

  console.log("Static assets copied successfully! Compiled JS handled by tsc.");
} catch (er) {
  console.error("Error copying assets:", er);
  process.exit(1);
}
