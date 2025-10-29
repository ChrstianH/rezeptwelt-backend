const fs = require("fs-extra");
const path = require("path");

// Zielordner für die Distribution
const DIST_DIR = path.resolve(__dirname, "dist");

async function buildProject() {
  try {
    console.log("--- Starte Build-Prozess ---");

    // 1. Alten dist-Ordner löschen (mit fs.remove von fs-extra)
    await fs.remove(DIST_DIR);
    console.log("-> Alter dist-Ordner erfolgreich gelöscht.");

    // 2. Notwendigen Ordner erstellen (mit fs.mkdirp von fs-extra, falls nicht vorhanden)
    await fs.mkdirp(DIST_DIR);

    // 3. Wichtige Root-Dateien kopieren (Einstiegspunkt und Dependencies-Definition)
    // path.resolve(filename) stellt sicher, dass wir den absoluten Pfad zur Datei im Root-Ordner haben
    await fs.copy(path.resolve("index.js"), path.join(DIST_DIR, "index.js"));
    await fs.copy(
      path.resolve("package.json"),
      path.join(DIST_DIR, "package.json")
    );
    await fs.copy(
      path.resolve("package-lock.json"),
      path.join(DIST_DIR, "package-lock.json")
    );
    console.log("-> Root-Dateien (index.js, package.json) kopiert.");

    // 4. Server-Code kopieren (z.B. src-Ordner nach dist/src)
    // fs.copy kümmert sich rekursiv um alle Unterordner
    // await fs.copy(path.resolve("src"), path.join(DIST_DIR, "src"));
    // console.log("-> Server-Quellcode (src/) kopiert.");

    // 5. Statische Assets kopieren (public-Ordner nach dist/public)
    // await fs.copy(path.resolve("public"), path.join(DIST_DIR, "public"));
    // console.log("-> Statische Assets (public/) kopiert.");

    console.log(
      "--- Build erfolgreich abgeschlossen! Der dist-Ordner ist bereit. ---"
    );
  } catch (err) {
    console.error("\n!!! BUILD-FEHLER aufgetreten !!!\n", err);
    process.exit(1); // Beendet den Prozess mit einem Fehlercode
  }
}

buildProject();
