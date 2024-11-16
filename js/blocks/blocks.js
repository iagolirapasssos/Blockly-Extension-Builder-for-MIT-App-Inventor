// Define custom blocks



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

// Import Static Method

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
        this.appendDummyInput()
            .appendField("Description")
            .appendField(new Blockly.FieldTextInput("A designer property"), "DESCRIPTION");
        this.appendDummyInput()
            .appendField("Category")
            .appendField(new Blockly.FieldDropdown([
                ["BEHAVIOR", "PropertyCategory.BEHAVIOR"],
                ["APPEARANCE", "PropertyCategory.APPEARANCE"]
            ]), "CATEGORY");
        this.appendStatementInput("DESIGNER_PROPERTY_SETTER")
            .setCheck(null)
            .appendField("Setter");
        this.appendStatementInput("DESIGNER_PROPERTY_GETTER")
            .setCheck(null)
            .appendField("Getter");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Declares a designer property");
        this.setHelpUrl("");
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
        this.setHelpUrl("");
    }
};

Blockly.Blocks['set_property'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("set")
        .appendField(new Blockly.FieldTextInput("myProperty"), "PROPERTY");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("Set property value");
    this.setHelpUrl("");
  }
};


Blockly.Blocks['get_property'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get")
        .appendField(new Blockly.FieldTextInput("myProperty"), "PROPERTY");
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip("Get property value");
    this.setHelpUrl("");
  }
};




//Generators
// Java code generator
Blockly.JavaScript['set_property'] = function(block) {
  var property = block.getFieldValue('PROPERTY');
  var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `set${property.charAt(0).toUpperCase() + property.slice(1)}(${value});\n`;
  return code;
};

Blockly.JavaScript['get_property'] = function(block) {
  var property = block.getFieldValue('PROPERTY');
  var code = `get${property.charAt(0).toUpperCase() + property.slice(1)}()`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['property_declaration'] = function(block) {
    var propertyName = block.getFieldValue('PROPERTY_NAME');
    var type = block.getFieldValue('TYPE');
    var setterContent = Blockly.JavaScript.statementToCode(block, 'PROPERTY_SETTER');
    var getterContent = Blockly.JavaScript.statementToCode(block, 'PROPERTY_GETTER');
    
    return `    private ${type} ${propertyName};
    
    public void set${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}(${type} value) {
        ${setterContent}
    }
    
    public ${type} get${propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}() {
        ${getterContent}
    }\n`;
};

Blockly.JavaScript['designer_property'] = function(block) {
    var propertyName = block.getFieldValue('PROPERTY_NAME');
    var type = block.getFieldValue('TYPE');
    var description = block.getFieldValue('DESCRIPTION');
    var category = block.getFieldValue('CATEGORY');
    var setterContent = Blockly.JavaScript.statementToCode(block, 'DESIGNER_PROPERTY_SETTER');
    var getterContent = Blockly.JavaScript.statementToCode(block, 'DESIGNER_PROPERTY_GETTER');
    
    return `    @DesignerProperty(editorType = ${type}, defaultValue = "")
    @SimpleProperty(description = "${description}")
    public void ${propertyName}(String value) {
        ${setterContent}
    }
    
    @SimpleProperty(category = ${category})
    public String ${propertyName}() {
        ${getterContent}
    }\n`;
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



