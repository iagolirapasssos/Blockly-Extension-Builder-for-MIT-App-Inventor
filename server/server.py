from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import subprocess
import shutil
import platform

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

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
# Fast CLI Configuration
author: DeveloperName
auto_version: true
min_sdk: 7
desugar_sources: true
desugar_deps: true
desugar_dex: true
proguard: true
R8: false
deannonate: true
filter_mit_classes: false
""")

    # Create AndroidManifest.xml
    with open(os.path.join(src_dir, "AndroidManifest.xml"), "w") as f:
        f.write(f"""\
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="{package_name}">
  <application />
</manifest>
""")

    # Save the Java source file
    with open(os.path.join(package_dir, f"{class_name}.java"), "w") as f:
        f.write(code)

    # Create ProGuard rules file
    with open(os.path.join(src_dir, "proguard-rules.pro"), "w") as f:
        f.write(f"""\
-repackageclasses {package_name}.repacked
""")

    return base_dir

# Endpoint to compile an extension
@app.route("/compile", methods=["POST"])
def compile_extension():
    """
    Handles the compilation of an MIT App Inventor extension.
    Accepts JSON input with `code`, `className`, and `packageName` fields.
    Returns the compiled .aix file or an error message.
    """
    try:
        # Parse the JSON request
        data = request.json
        code = data.get("code", "")
        class_name = data.get("className", "TestExtension")
        package_name = data.get("packageName", "com.example.testextension")

        # Validate input
        if not code:
            return jsonify({"error": "No code provided"}), 400

        # Prepare the project directory
        temp_dir = get_or_create_temp_dir()
        project_dir = os.path.join(temp_dir, f"{class_name}_project")
        if os.path.exists(project_dir):
            shutil.rmtree(project_dir)  # Clean up existing directory
        os.makedirs(project_dir, exist_ok=True)

        # Create the project structure
        create_fast_structure(project_dir, package_name, class_name, code)

        # Run the Fast CLI build command
        command = ["java", "-jar", FAST_JAR_PATH, "build"]
        print(f"Running command: {' '.join(command)} in {project_dir}")
        result = subprocess.run(
            command,
            cwd=project_dir,
            capture_output=True,
            text=True,
        )

        # Log the Fast CLI output
        print("Fast CLI stdout:", result.stdout)
        print("Fast CLI stderr:", result.stderr)

        # Check for build errors
        if result.returncode != 0:
            return jsonify({"error": "Compilation failed", "details": result.stderr}), 500

        # Construct the expected .aix file path
        aix_file_name = f"{package_name}.aix"
        aix_file_path = os.path.join(project_dir, "out", aix_file_name)

        # Verify the .aix file exists
        if not os.path.exists(aix_file_path):
            print(f"AIX file not found: {aix_file_path}")
            return jsonify({"error": "AIX file not found"}), 500

        # Serve the .aix file for download
        return send_file(aix_file_path, as_attachment=True, download_name=f"{class_name}.aix")

    except Exception as e:
        print("Internal server error:", str(e))
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
