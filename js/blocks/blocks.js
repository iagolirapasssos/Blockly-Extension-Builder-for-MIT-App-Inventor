// Define custom blocks
Blockly.Blocks['extension_class'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Create Extension")
            .appendField(new Blockly.FieldTextInput("MyExtension"), "CLASS_NAME");
        this.appendStatementInput("MEMBERS")
            .setCheck(null);
        this.setColour(210);
        this.setTooltip("Defines the main class of the extension");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['package_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Package")
            .appendField(new Blockly.FieldTextInput("com.example.extension"), "PACKAGE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("Declares the extension package");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['import_basic'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Import")
            .appendField(new Blockly.FieldDropdown([
                ["com.google.appinventor.components.annotations.*", "ANNOTATIONS"],
                ["com.google.appinventor.components.common.*", "COMMON"],
                ["com.google.appinventor.components.runtime.*", "RUNTIME"],
                ["android.content.Context", "CONTEXT"]
            ]), "IMPORT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("Imports necessary libraries");
        this.setHelpUrl("");
    }
};

// Manual Import
Blockly.Blocks['import_manual'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import')
            .appendField(new Blockly.FieldTextInput('java.util.ArrayList'), 'IMPORT_PATH');
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox('FALSE'), 'IS_STATIC')
            .appendField('static')
            .appendField(new Blockly.FieldCheckbox('FALSE'), 'IS_WILDCARD')
            .appendField('.*');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('Manual class or package import');
    }
};

// Import Specific Package
Blockly.Blocks['import_package'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import package')
            .appendField(new Blockly.FieldTextInput('com.example'), 'PACKAGE')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('util'), 'SUB_PACKAGE')
            .appendField('.*');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('Imports all classes from a package');
    }
};

// Import Specific Class
Blockly.Blocks['import_class'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import class')
            .appendField(new Blockly.FieldTextInput('java.util.List'), 'CLASS_PATH');
        this.appendDummyInput()
            .appendField('as')
            .appendField(new Blockly.FieldTextInput(''), 'ALIAS')
            .appendField('(optional)');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('Imports a specific class with optional alias');
    }
};

// Import Static Method
Blockly.Blocks['import_static'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import static')
            .appendField(new Blockly.FieldTextInput('java.lang.Math'), 'CLASS')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('*'), 'METHOD');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip('Imports static method from a class');
    }
};


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
        this.appendStatementInput("PROPERTY_CONTENT")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Declares a property");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['designer_property'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("designerProperty"), "PROPERTY_NAME")
            .appendField("type")
            .appendField(new Blockly.FieldDropdown([
                ["string", "PropertyTypeConstants.PROPERTY_TYPE_STRING"],
                ["boolean", "PropertyTypeConstants.PROPERTY_TYPE_BOOLEAN"],
                ["integer", "PropertyTypeConstants.PROPERTY_TYPE_INTEGER"],
                ["color", "PropertyTypeConstants.PROPERTY_TYPE_COLOR"]
            ]), "TYPE");
        this.appendStatementInput("DESIGNER_PROPERTY_CONTENT")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Declares a designer property");
        this.setHelpUrl("");
    }
};

// Function return block for methods
Blockly.Blocks['method_return'] = {
    init: function() {
        this.appendValueInput('RETURN_VALUE')
            .setCheck(null)
            .appendField('return');
        this.setPreviousStatement(true, null);
        this.setNextStatement(false, null); // Does not allow following block
        this.setColour(290); // Same color as methods
        this.setTooltip('Returns a value from the method');
    }
};

// Updated method block with content field
Blockly.Blocks['method_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("myMethod"), "METHOD_NAME")
            .appendField("return")
            .appendField(new Blockly.FieldDropdown([
                ["void", "void"],
                ["String", "String"],
                ["int", "int"],
                ["boolean", "boolean"]
            ]), "RETURN_TYPE");
        this.appendStatementInput("METHOD_CONTENT")
            .setCheck(null)
            .appendField("content");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("Declares a method with return value");
    }
};

Blockly.Blocks['event_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("MyEvent"), "EVENT_NAME");
        this.appendStatementInput("EVENT_CONTENT")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("Declares an event");
        this.setHelpUrl("");
    }
};

//Generators
// Java code generator
Blockly.JavaScript['extension_class'] = function(block) {
    var className = block.getFieldValue('CLASS_NAME');
    var members = Blockly.JavaScript.statementToCode(block, 'MEMBERS');
    
    var code = `@DesignerComponent(version = 1,
    description = "A custom extension",
    category = ComponentCategory.EXTENSION,
    nonVisible = true,
    iconName = "images/extension.png")
@SimpleObject(external = true)
public class ${className} extends AndroidNonvisibleComponent {
${members}}`;
    return code;
};

Blockly.JavaScript['package_declaration'] = function(block) {
    var package = block.getFieldValue('PACKAGE');
    return `package ${package};\n\n`;
};

Blockly.JavaScript['import_basic'] = function(block) {
    var importType = block.getFieldValue('IMPORT');
    var imports = {
        'ANNOTATIONS': 'com.google.appinventor.components.annotations.*',
        'COMMON': 'com.google.appinventor.components.common.*',
        'RUNTIME': 'com.google.appinventor.components.runtime.*',
        'CONTEXT': 'android.content.Context'
    };
    return `import ${imports[importType]};\n`;
};

Blockly.JavaScript['property_declaration'] = function(block) {
    var propertyName = block.getFieldValue('PROPERTY_NAME');
    var type = block.getFieldValue('TYPE');
    var content = Blockly.JavaScript.statementToCode(block, 'PROPERTY_CONTENT');
    
    return `    private ${type} ${propertyName};
    
    public ${type} get${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}() {
        return ${propertyName};
    }
    
    public void set${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}(${type} value) {
        this.${propertyName} = value;
    }${content}\n`;
};

Blockly.JavaScript['designer_property'] = function(block) {
    var propertyName = block.getFieldValue('PROPERTY_NAME');
    var type = block.getFieldValue('TYPE');
    var content = Blockly.JavaScript.statementToCode(block, 'DESIGNER_PROPERTY_CONTENT');
    
    return `    @DesignerProperty(editorType = ${type})
    @SimpleProperty(description = "A designer property")
    public void ${propertyName}(String value) {
        // Implementation
        ${content}
    }
    
    @SimpleProperty(category = PropertyCategory.BEHAVIOR)
    public String ${propertyName}() {
        // Implementation
        return "";
    }\n`;
};

// Updated code generators
Blockly.JavaScript['method_return'] = function(block) {
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN_VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '';
    return `        return ${returnValue};\n`;
};

Blockly.JavaScript['method_declaration'] = function(block) {
    var methodName = block.getFieldValue('METHOD_NAME');
    var returnType = block.getFieldValue('RETURN_TYPE');
    var content = Blockly.JavaScript.statementToCode(block, 'METHOD_CONTENT');
    
    return `    @SimpleFunction(description = "A custom method")
    public ${returnType} ${methodName}() {
${content}    }\n`;
};

Blockly.JavaScript['event_declaration'] = function(block) {
    var eventName = block.getFieldValue('EVENT_NAME');
    return `    @SimpleEvent(description = "A custom event")
    public void ${eventName}() {
        EventDispatcher.dispatchEvent(this, "${eventName}");
    }\n`;
};

// Code generators
Blockly.JavaScript['import_manual'] = function(block) {
    var path = block.getFieldValue('IMPORT_PATH');
    var isStatic = block.getFieldValue('IS_STATIC') === 'TRUE';
    var isWildcard = block.getFieldValue('IS_WILDCARD') === 'TRUE';
    
    var code = 'import ';
    if (isStatic) code += 'static ';
    code += path;
    if (isWildcard) code += '.*';
    return code + ';\n';
};

Blockly.JavaScript['import_package'] = function(block) {
    var pkg = block.getFieldValue('PACKAGE');
    var subPkg = block.getFieldValue('SUB_PACKAGE');
    return `import ${pkg}.${subPkg}.*;\n`;
};

Blockly.JavaScript['import_class'] = function(block) {
    var classPath = block.getFieldValue('CLASS_PATH');
    var alias = block.getFieldValue('ALIAS');
    var code = `import ${classPath}`;
    if (alias) {
        code += ` as ${alias}`;
    }
    return code + ';\n';
};

Blockly.JavaScript['import_static'] = function(block) {
    var className = block.getFieldValue('CLASS');
    var method = block.getFieldValue('METHOD');
    return `import static ${className}.${method};\n`;
};
