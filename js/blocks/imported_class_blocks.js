// Bloco para chamar método estático
Blockly.Blocks['imported_static_method'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('Class'), 'CLASS_NAME')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('staticMethod'), 'METHOD_NAME')
            .appendField('(');
        this.appendStatementInput('ARGS')
            .setCheck('method_arg');
        this.appendDummyInput()
            .appendField(')');
        this.setOutput(true, null);
        this.setColour("#6D4C41");
        this.setTooltip('Chama um método estático de uma classe importada');
    }
};

// Bloco para acessar campo estático
Blockly.Blocks['imported_static_field'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('Class'), 'CLASS_NAME')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('CONSTANT'), 'FIELD_NAME');
        this.setOutput(true, null);
        this.setColour("#6D4C41");
        this.setTooltip('Acessa um campo estático de uma classe importada');
    }
};

// Bloco para declarar tipo
Blockly.Blocks['imported_type_declaration'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField(new Blockly.FieldTextInput('Type'), 'TYPE_NAME')
            .appendField(new Blockly.FieldTextInput('varName'), 'VAR_NAME')
            .appendField('=');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip('Declara uma variável com tipo importado');
    }
};

// Bloco para interface
Blockly.Blocks['imported_interface'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('implement interface')
            .appendField(new Blockly.FieldTextInput('Interface'), 'INTERFACE_NAME');
        this.appendStatementInput('METHODS')
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6D4C41");
        this.setTooltip('Implementa uma interface importada');
    }
};

// Geradores de código
Blockly.JavaScript['imported_static_method'] = function(block) {
    var className = block.getFieldValue('CLASS_NAME');
    var methodName = block.getFieldValue('METHOD_NAME');
    var args = Blockly.JavaScript.statementToCode(block, 'ARGS');
    args = args.trim().replace(/,\s*$/, '');
    return [`${className}.${methodName}(${args})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['imported_static_field'] = function(block) {
    var className = block.getFieldValue('CLASS_NAME');
    var fieldName = block.getFieldValue('FIELD_NAME');
    return [`${className}.${fieldName}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['imported_type_declaration'] = function(block) {
    var typeName = block.getFieldValue('TYPE_NAME');
    var varName = block.getFieldValue('VAR_NAME');
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return `${typeName} ${varName} = ${value};\n`;
};

Blockly.JavaScript['imported_interface'] = function(block) {
    var interfaceName = block.getFieldValue('INTERFACE_NAME');
    var methods = Blockly.JavaScript.statementToCode(block, 'METHODS');
    return `implements ${interfaceName} {\n${methods}}\n`;
};