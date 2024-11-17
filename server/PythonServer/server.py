from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import subprocess
import shutil
import platform

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable Cross-Origin Resource Sharing

# Determine the operating system and set the path for `fast.jar`
SYSTEM = platform.system().lower()
if SYSTEM == "windows":
    # On Windows, Fast CLI is installed in %LOCALAPPDATA%\Fast
    FAST_JAR_PATH = os.path.join(os.environ.get("LOCALAPPDATA", ""), "Fast", "fast.jar")
else:
    # On Linux/MacOS, Fast CLI is installed in ~/.local/share/Fast
    FAST_JAR_PATH = os.path.expanduser("~/.local/share/Fast/fast.jar")

# Check if `fast.jar` exists
if not os.path.isfile(FAST_JAR_PATH):
    raise FileNotFoundError(f"Fast CLI not found at {FAST_JAR_PATH}. Ensure it is installed correctly.")

# Temporary directory for storing project files
TEMP_DIR = os.path.join(os.getcwd(), "temp")

# Create or return the temporary directory
def get_or_create_temp_dir():
    """
    Ensures the temporary directory exists or creates it if missing.
    Returns:
        str: Path to the temporary directory.
    """
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR, exist_ok=True)
    return TEMP_DIR

# Function to set up the directory structure for Fast CLI
def create_fast_structure(base_dir, package_name, class_name, code):
    """
    Creates the necessary directory and file structure for Fast CLI.
    
    Args:
        base_dir (str): Base directory for the project.
        package_name (str): Java package name for the extension.
        class_name (str): Main class name for the extension.
        code (str): Java code to be saved in the project.
    
    Returns:
        str: The base directory path.
    """
    assets_dir = os.path.join(base_dir, "assets")
    deps_dir = os.path.join(base_dir, "deps")
    src_dir = os.path.join(base_dir, "src")
    package_dir = os.path.join(src_dir, package_name.replace(".", os.sep))

    # Create required directories
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(deps_dir, exist_ok=True)
    os.makedirs(package_dir, exist_ok=True)

    # Create `fast.yml` configuration file
    with open(os.path.join(base_dir, "fast.yml"), "w") as f:
        f.write("""\
# The name of the extension developer
author: BosonsHiggs

# If enabled, the version number of every component will be increased automatically.
auto_version: true

# The minimum Android SDK level your extension supports. Minimum SDK defined in
# AndroidManifest.xml or @DesignerComponent are ignored, you should always define it here.
min_sdk: 7

# If enabled, Kotlin Standard Libraries (V1.9.24) will be included with the extension.
# If you want to add specific Kotlin Standard Libraries so disable it.
kotlin: false

# If enabled, you will be able to use Java 8 language features in your extension source code.
# When you use .kt classes, by default Fast will desugar sources.
desugar_sources: false

# Enable it, if any of your dependencies use Java 8 language features.
# If kotlin is enabled, by default Fast will desugar dependencies.
desugar_deps: false

# If enabled, the D8 tool will generate desugared (classes.jar) classes.dex
desugar_dex: true

# If enabled, @annotations will be not present in built extension.
deannonate: true

# If enabled, matching classes provided by MIT will not be included in the built extension.
filter_mit_classes: false

# If enabled, it will optimizes the extension with ProGuard.
proguard: true

# If enabled, R8 will be used instead of ProGuard and D8 dexer.
# NOTE: It's an experimental feature.
R8: false

# Extension dependencies (JAR) [Should be present into deps directory]
# dependencies:
# - mylibrary.jar

# Extension assets. [Should be present into assets directory]
#assets:
#- my-awesome-asset.anything

""")

    # Create AndroidManifest.xml
    with open(os.path.join(src_dir, "AndroidManifest.xml"), "w") as f:
        f.write(f'''\
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="{package_name}">

  <application>
    <!-- You can use any manifest tag that goes inside the <application> tag -->
    <!-- <service android:name="com.example.MyService"> ... </service> -->
  </application>

  <!-- Other than <application> level tags, you can use <uses-permission> & <queries> tags -->
  <!-- <uses-permission android:name="android.permission.INTERNET"/> -->
  <!-- <queries> ... </queries> -->

</manifest>
''')

    # Save the Java source file
    with open(os.path.join(package_dir, f"{class_name}.java"), "w") as f:
        f.write(code)

    # Create ProGuard rules file
    with open(os.path.join(src_dir, "proguard-rules.pro"), "w") as f:
        f.write(f"""\
-repackageclasses {package_name}.repacked
""")

    return base_dir

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    response.headers["Access-Control-Allow-Origin"] = "*"  # Ajuste conforme necessário
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# Endpoint to compile an extension
@app.route("/compile", methods=["POST"])
def compile_extension():
    try:
        data = request.json
        code = data.get("code", "")
        class_name = data.get("className", "TestExtension")
        package_name = data.get("packageName", "com.example.testextension")
        android_manifest = data.get("androidManifest", "")
        fast_yml = data.get("fastYml", "")

        if not code:
            return jsonify({"error": "No code provided"}), 400

        temp_dir = get_or_create_temp_dir()
        project_dir = os.path.join(temp_dir, f"{class_name}_project")
        if os.path.exists(project_dir):
            shutil.rmtree(project_dir)
        os.makedirs(project_dir, exist_ok=True)

        # Save the files
        create_fast_structure(project_dir, package_name, class_name, code)
        with open(os.path.join(project_dir, "src", "AndroidManifest.xml"), "w") as f:
            f.write(android_manifest)
        with open(os.path.join(project_dir, "fast.yml"), "w") as f:
            f.write(fast_yml)

        command = ["java", "-jar", FAST_JAR_PATH, "build"]
        result = subprocess.run(
            command,
            cwd=project_dir,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            return jsonify({"error": "Compilation failed", "details": result.stderr}), 500

        aix_file_name = f"{package_name}.aix"
        aix_file_path = os.path.join(project_dir, "out", aix_file_name)
        print(f'aix_file_name: {aix_file_name} and aix_file_path: {aix_file_path}')
        if not os.path.exists(aix_file_path):
            return jsonify({"error": "AIX file not found"}), 500

        return send_file(aix_file_path, as_attachment=True, download_name=f"{class_name}.aix")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/cleanup/<class_name>", methods=["DELETE"])
def cleanup_project_directory(class_name):
    """
    Deletes the project directory for a given class name.
    """
    try:
        temp_dir = get_or_create_temp_dir()
        project_dir = os.path.join(temp_dir, f"{class_name}_project")

        if os.path.exists(project_dir):
            shutil.rmtree(project_dir)
            print(f"Deleted project directory: {project_dir}")
            return jsonify({"message": f"Project directory for {class_name} cleaned up successfully."}), 200
        else:
            return jsonify({"error": "Project directory not found."}), 404
    except Exception as e:
        print("Error during project directory cleanup:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run the server with HTTPS
    app.run(host="0.0.0.0", port=8080, ssl_context=("localhost.crt", "localhost.key"))
