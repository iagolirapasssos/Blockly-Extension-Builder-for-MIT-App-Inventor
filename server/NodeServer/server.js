const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const axios = require("axios");
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
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

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

// Function to download dependencies
const handleDependencies = async (depsDir, dependencies) => {
  if (!Array.isArray(dependencies)) {
    throw new Error("Invalid dependencies format. Must be an array of URLs.");
  }

  for (const url of dependencies) {
    if (!url || typeof url !== "string") {
      throw new Error(`Invalid dependency URL: ${url}`);
    }

    const name = path.basename(new URL(url).pathname); // Extrai o nome do arquivo da URL
    const filePath = path.join(depsDir, name);

    if (!fs.existsSync(filePath)) {
      console.log(`Downloading dependency: ${name}`);
      try {
        const response = await axios.get(url, { responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        console.log(`✔ Downloaded dependency: ${name}`);
      } catch (error) {
        console.error(`Failed to download dependency: ${name} from ${url}`);
        throw new Error(`Failed to download dependency: ${name} from ${url}`);
      }
    } else {
      console.log(`Dependency already exists: ${name}`);
    }
  }
};


// Endpoint to compile an extension
app.post("/compile", async (req, res) => {
  try {
    const {
      code,
      className = "TestExtension",
      packageName = "com.example.testextension",
      androidManifest,
      fastYml,
      dependencies = [], // Assume lista de URLs simples
    } = req.body;

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    const tempDir = getOrCreateTempDir();
    const projectDir = path.join(tempDir, `${className}_project`);

    // Remove diretório existente
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true });
    }

    // Cria estrutura do projeto
    createFastStructure(projectDir, packageName, className, code, androidManifest, fastYml);

    // Processa dependências
    const depsDir = path.join(projectDir, "deps");
    if (dependencies.length > 0) {
      await handleDependencies(depsDir, dependencies);
    }

    // Executa o Fast CLI
    const command = `java -jar "${FAST_JAR_PATH}" build`;
    try {
      execSync(command, { cwd: projectDir, stdio: "inherit" });
    } catch (error) {
      return res.status(500).json({ error: "Compilation failed", details: error.message });
    }

    // Verifica se o arquivo .aix foi gerado
    const aixFileName = `${packageName}.aix`;
    const aixFilePath = path.join(projectDir, "out", aixFileName);

    if (!fs.existsSync(aixFilePath)) {
      return res.status(500).json({ error: "AIX file not found" });
    }

    // Envia o arquivo gerado
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
