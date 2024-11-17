const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const cors = require("cors");
const { execSync } = require("child_process");

const app = express();
const PORT = 8080;

// Determine the operating system and set the path for `fast.jar`
const SYSTEM = process.platform;
const FAST_JAR_PATH =
  SYSTEM === "win32"
    ? path.join(process.env.LOCALAPPDATA || "", "Fast", "fast.jar")
    : path.join(require("os").homedir(), ".local/share/Fast/fast.jar");

// Verify if `fast.jar` exists
if (!fs.existsSync(FAST_JAR_PATH)) {
  console.error(`Fast CLI not found at ${FAST_JAR_PATH}. Ensure it is installed.`);
  process.exit(1);
}

// Temporary directory for storing project files
const TEMP_DIR = path.join(__dirname, "temp");

// Ensure the temporary directory exists
const getOrCreateTempDir = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  return TEMP_DIR;
};

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  })
);

// Function to set up the directory structure for Fast CLI
const createFastStructure = (baseDir, packageName, className, code, androidManifest, fastYml) => {
  const assetsDir = path.join(baseDir, "assets");
  const depsDir = path.join(baseDir, "deps");
  const srcDir = path.join(baseDir, "src");
  const packageDir = path.join(srcDir, packageName.replace(/\./g, path.sep));

  // Create required directories
  [assetsDir, depsDir, packageDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Create `fast.yml`
  fs.writeFileSync(
    path.join(baseDir, "fast.yml"),
    fastYml ||
      `# Fast CLI Configuration
author: BosonsHiggs
auto_version: true
min_sdk: 7
desugar_sources: false
desugar_deps: false
desugar_dex: true
deannonate: true
filter_mit_classes: false
proguard: true
R8: false
`
  );

  // Create AndroidManifest.xml
  fs.writeFileSync(
    path.join(srcDir, "AndroidManifest.xml"),
    androidManifest ||
      `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="${packageName}">
  <application />
</manifest>
`
  );

  // Save the Java source file
  fs.writeFileSync(path.join(packageDir, `${className}.java`), code);

  // Create ProGuard rules
  fs.writeFileSync(
    path.join(srcDir, "proguard-rules.pro"),
    `-repackageclasses ${packageName}.repacked\n`
  );

  return baseDir;
};

// Endpoint to compile an extension
app.post("/compile", async (req, res) => {
  try {
    const { code, className = "TestExtension", packageName = "com.example.testextension", androidManifest, fastYml } =
      req.body;

    if (!code) return res.status(400).json({ error: "No code provided" });

    const tempDir = getOrCreateTempDir();
    const projectDir = path.join(tempDir, `${className}_project`);

    // Clean up existing directory
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true });
    }

    // Create project structure
    createFastStructure(projectDir, packageName, className, code, androidManifest, fastYml);

    // Run Fast CLI
    const command = `java -jar "${FAST_JAR_PATH}" build`;
    try {
      execSync(command, { cwd: projectDir, stdio: "inherit" });
    } catch (error) {
      return res.status(500).json({ error: "Compilation failed", details: error.message });
    }

    const aixFileName = `${packageName}.aix`;
    const aixFilePath = path.join(projectDir, "out", aixFileName);

    if (!fs.existsSync(aixFilePath)) {
      return res.status(500).json({ error: "AIX file not found" });
    }

    res.download(aixFilePath, `${className}.aix`);
  } catch (error) {
    console.error("Error during compilation:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to clean up the project directory
app.delete("/cleanup/:className", (req, res) => {
  try {
    const { className } = req.params;
    const tempDir = getOrCreateTempDir();
    const projectDir = path.join(tempDir, `${className}_project`);

    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true });
      res.json({ message: `Project directory for ${className} cleaned up successfully.` });
    } else {
      res.status(404).json({ error: "Project directory not found." });
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
    res.status(500).json({ error: error.message });
  }
});

// Load HTTPS certificates
const key = fs.readFileSync("localhost.key");
const cert = fs.readFileSync("localhost.crt");

// Start the HTTPS server
https.createServer({ key, cert }, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
