// Bloco principal para declaração do Enum
Blockly.Blocks['enum_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("public enum")
            .appendField(new Blockly.FieldTextInput("EnumName"), "ENUM_NAME")
            .appendField("implements")
            .appendField("OptionList<")
            .appendField(new Blockly.FieldTextInput("Type"), "TYPE_NAME")
            .appendField(">");
        this.appendStatementInput('CONSTANTS')
            .setCheck('enum_constant')
            .appendField("Constants:");
        this.appendDummyInput()
            .appendField("Value Type:")
            .appendField(new Blockly.FieldTextInput("Type"), "VALUE_TYPE");
        this.appendStatementInput('METHODS')
            .setCheck(null)
            .appendField("Methods:");
        this.setColour("#6D4C41");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip("Creates an enum that implements OptionList");
    }
};

// Bloco para constantes do enum
Blockly.Blocks['enum_constant'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("CONSTANT"), "NAME")
            .appendField("(")
            .appendField(new Blockly.FieldTextInput("value"), "VALUE")
            .appendField(")");
        this.setPreviousStatement(true, 'enum_constant');
        this.setNextStatement(true, 'enum_constant');
        this.setColour("#6D4C41");
        this.setTooltip("Adds a constant to the enum");
    }
};

// Bloco para campo privado do valor
Blockly.Blocks['enum_value_field'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("private")
            .appendField(new Blockly.FieldTextInput("Type"), "TYPE")
            .appendField("value;");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Declares the private value field");
    }
};

// Bloco para construtor do enum
Blockly.Blocks['enum_constructor'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("EnumName"), "ENUM_NAME")
            .appendField("(")
            .appendField(new Blockly.FieldTextInput("Type"), "TYPE")
            .appendField("value) {");
        this.appendStatementInput('CONSTRUCTOR_BODY')
            .appendField("constructor body");
        this.appendDummyInput()
            .appendField("}");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Creates the enum constructor");
    }
};

// Bloco para método toUnderlyingValue
Blockly.Blocks['enum_to_underlying'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("public")
            .appendField(new Blockly.FieldTextInput("Type"), "TYPE")
            .appendField("toUnderlyingValue() {");
        this.appendStatementInput('METHOD_BODY')
            .appendField("method body");
        this.appendDummyInput()
            .appendField("}");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Implements toUnderlyingValue method");
    }
};

// Bloco para lookup map
Blockly.Blocks['enum_lookup_map'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("private static final Map<")
            .appendField(new Blockly.FieldTextInput("Type"), "TYPE")
            .appendField(",")
            .appendField(new Blockly.FieldTextInput("EnumName"), "ENUM_NAME")
            .appendField("> lookup = new HashMap<>();");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Creates the lookup map");
    }
};

// Bloco para static initializer
Blockly.Blocks['enum_static_init'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("static {")
            .appendField(new Blockly.FieldTextInput("EnumName"), "ENUM_NAME");
        this.appendStatementInput('INIT_BLOCK')
            .appendField("for-each initialization");
        this.appendDummyInput()
            .appendField("}");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Creates the static initializer block");
    }
};

// Bloco para fromUnderlyingValue
Blockly.Blocks['enum_from_underlying'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("public static")
            .appendField(new Blockly.FieldTextInput("EnumName"), "ENUM_NAME")
            .appendField("fromUnderlyingValue(")
            .appendField(new Blockly.FieldTextInput("Type"), "TYPE")
            .appendField("value) {");
        this.appendStatementInput('RETURN')
            .setCheck(null);
        this.appendDummyInput()
            .appendField("}");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Creates fromUnderlyingValue method");
    }
};

// 2. Novo bloco para retorno do valor no toUnderlyingValue
Blockly.Blocks['enum_return_value'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("return")
            .appendField(new Blockly.FieldTextInput("value"), "RETURN_VALUE")
            .appendField(";");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Returns a value");
    }
};

Blockly.Blocks['enum_constructor_assignment'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("this.")
            .appendField(new Blockly.FieldTextInput("value"), "FIELD_NAME")
            .appendField(" = ")
            .appendField(new Blockly.FieldTextInput("value"), "PARAM_NAME")
            .appendField(";");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip("Assigns the parameter to a field");
    }
};

// Geradores de código
Blockly.JavaScript['enum_constructor_assignment'] = function(block) {
    const fieldName = block.getFieldValue('FIELD_NAME');
    const paramName = block.getFieldValue('PARAM_NAME');
    return `this.${fieldName} = ${paramName};\n`;
};

// Gerador do novo bloco enum_return_value
Blockly.JavaScript['enum_return_value'] = function(block) {
    const returnValue = block.getFieldValue('RETURN_VALUE');
    return `return ${returnValue};\n`;
};

Blockly.JavaScript['enum_declaration'] = function(block) {
    const enumName = block.getFieldValue('ENUM_NAME');
    const typeName = block.getFieldValue('TYPE_NAME');
    const valueType = block.getFieldValue('VALUE_TYPE');
    const constants = Blockly.JavaScript.statementToCode(block, 'CONSTANTS');
    const methods = Blockly.JavaScript.statementToCode(block, 'METHODS');
    
    return `public enum ${enumName} implements OptionList<${typeName}> {\n` +
           `${constants}\n` +
           `${methods}}\n`;
};

Blockly.JavaScript['enum_constant'] = function(block) {
    const name = block.getFieldValue('NAME');
    const value = block.getFieldValue('VALUE');
    const nextBlock = block.getNextBlock();
    
    return `${name}(${value})${nextBlock ? ',' : ';'}\n`;
};

Blockly.JavaScript['enum_value_field'] = function(block) {
    const type = block.getFieldValue('TYPE');
    return `private ${type} value;\n`;
};

Blockly.JavaScript['enum_constructor'] = function(block) {
    const enumName = block.getFieldValue('ENUM_NAME');
    const type = block.getFieldValue('TYPE');
    const body = Blockly.JavaScript.statementToCode(block, 'CONSTRUCTOR_BODY');
    
    return `${enumName}(${type} value) {\n` +
           body +
           `}\n`;
};

Blockly.JavaScript['enum_to_underlying'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const body = Blockly.JavaScript.statementToCode(block, 'METHOD_BODY');
    
    return `public ${type} toUnderlyingValue() {\n` +
           body +
           `}\n`;
};


Blockly.JavaScript['enum_lookup_map'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const enumName = block.getFieldValue('ENUM_NAME');
    
    return `private static final Map<${type}, ${enumName}> lookup = new HashMap<>();\n`;
};

Blockly.JavaScript['enum_static_init'] = function(block) {
    const enumName = block.getFieldValue('ENUM_NAME');
    return `static {\n` +
           `    for (${enumName} val : ${enumName}.values()) {\n` +
           `        lookup.put(val.toUnderlyingValue(), val);\n` +
           `    }\n` +
           `}\n`;
};

Blockly.JavaScript['enum_from_underlying'] = function(block) {
    const enumName = block.getFieldValue('ENUM_NAME');
    const type = block.getFieldValue('TYPE');
    const returnCode = Blockly.JavaScript.statementToCode(block, 'RETURN');
    
    return `public static ${enumName} fromUnderlyingValue(${type} value) {\n` +
           `    return lookup.get(value);\n` +
           `}\n`;
};