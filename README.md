## CodeCrafter AIX - Blockly Extension Builder for MIT App Inventor

### Welcome to the CodeCrafter AIX!
This repository offers an interactive IDE for creating Java extensions for MIT App Inventor using a drag-and-drop interface powered by Blockly ([Website](https://iagolirapasssos.github.io/CodeCrafterAIX/)). It provides tools to generate Java code from visual blocks, making it suitable for both beginners and advanced developers.

---

### Key Features:
1. **Drag-and-Drop Interface**: Build extensions visually using Blockly blocks.
2. **Code Generation**: Automatically generate Java code from designed blocks.
3. **Custom Blocks**: Create and use custom blocks for extension-specific logic.
4. **Theming and Translation**: Supports multiple themes and languages.
5. **Save and Load**: Save your projects and reload them anytime.

---

## Prerequisites

- **Java Runtime**:
  - Install the latest Java JDK for your operating system.
  - Ensure `java` is available in your PATH.

- **Fast CLI**:
  - Download Fast CLI from [Fast CLI GitHub](https://github.com/jewelshkjony/fast-cli).
  - Place the `fast.jar` in the following directory:
    - **Linux/MacOS**: `~/.local/share/Fast/fast.jar`
    - **Windows**: `%USERPROFILE%\.local\share\Fast\fast.jar`

- **Python**:
  - Python 3.8+ is required to run the Flask server.

- **SSL Certificates**:
  - Generate `localhost.crt` and `localhost.key` in the same directory as `server.py` or `server.js`.

---

## Setup Instructions

### 1. Clone the Repository
git clone https://github.com/iagolirapasssos/CodeCrafterAIX.git
cd Blockly-Extension-Builder-for-MIT-App-Inventor

---

### Instructions for Developers

#### 1. **Setting Up the Project**
   - Clone the repository:
     
bash
     git clone https://github.com/iagolirapasssos/CodeCrafterAIX.git

   - Open index.html in your browser to start using the IDE.

#### 2. **Custom Blocks for Extensions**
The IDE supports predefined and custom blocks to generate Java code for:
   - **Properties**
   - **Methods**
   - **Events**
   - **Control Structures**
   - **Math Operations**
   - **Logic**
   - **Text Manipulation**
   - **Dictionaries and Lists**
   - **Colors**

#### 3. **Supported Blocks and Code Generators**
##### **Example Block**: Creating a Property ([See Docs](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html) and [new doc](https://google.github.io/blockly-samples/examples/developer-tools/index.html))

```javascript
Blockly.Blocks['property_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("myProperty"), "PROPERTY_NAME")
            .appendField("type")
            .appendField(new Blockly.FieldDropdown([
                ["String", "String"],
                ["int", "int"],
                ["boolean", "boolean"],
                ["double", "double"]
            ]), "TYPE");
        this.appendStatementInput("PROPERTY_SETTER")
            .setCheck(null)
            .appendField("Setter");
        this.appendStatementInput("PROPERTY_GETTER")
            .setCheck(null)
            .appendField("Getter");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Declares a property");
    }
};
```

**Generated Code**:
```java
private String myProperty;

public void setMyProperty(String value) {
    this.myProperty = value;
}

public String getMyProperty() {
    return this.myProperty;
}
```

---

#### 4. **How to Contribute**
We are actively looking for:
- **Frontend Developers**: Enhance the UI/UX, add new themes, and improve drag-and-drop functionalities.
- **Backend Developers**: Integrate with Fast CLI for seamless code compilation and manage cloud storage for user projects.
- **Designers**: Create modern, intuitive designs and block themes.

**Contributing Guide**:
1. Fork the repository.
2. Create a branch:
   
```bash
   git checkout -b feature-name
```
3. Make changes and commit:
   
```bash
   git commit -m "Added new feature"
```
4. Push to your branch:
   
```bash
   git push origin feature-name
```
5. Open a pull request.

---

#### 5. **Learning Java with Blocks**
This project is ideal for beginners who want to learn Java by experimenting with visual programming:
- Start with simple math or logic blocks.
- Gradually build your first Java methods and classes.
- Explore the generated Java code to understand its structure and syntax.

---

#### 6. **Call for Contributors**
Join us in enhancing this project to empower developers worldwide. Whether you're a beginner or an experienced programmer, your contributions will make a difference!

- [Submit Issues](https://github.com/iagolirapasssos/Blockly-Extension-Builder-for-MIT-App-Inventor/issues) for bugs or feature requests.
- [Telegram Group](https://t.me/+BnKWdasvIuE5N2Y5) for brainstorming and sharing ideas.

---

## License
This project is licensed under the MIT License. See the LICENSE file for more details.