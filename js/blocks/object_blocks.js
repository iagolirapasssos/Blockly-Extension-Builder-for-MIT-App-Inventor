// Criar Objeto
Blockly.Blocks['object_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('new')
            .appendField(new Blockly.FieldTextInput('Object'), 'CLASS_NAME');
        this.appendStatementInput('CONSTRUCTOR_ARGS')
            .setCheck('constructor_arg')
            .appendField('argumentos');
        this.setOutput(true, 'Object');
        this.setColour("#F4511E");;
        this.setTooltip('Cria uma nova instância de objeto');
    }
};

// Argumento do Construtor
Blockly.Blocks['constructor_arg'] = {
    init: function() {
        this.appendValueInput('ARG_VALUE')
            .setCheck(null)
            .appendField(new Blockly.FieldTextInput('arg'), 'ARG_NAME');
        this.setPreviousStatement(true, 'constructor_arg');
        this.setNextStatement(true, 'constructor_arg');
        this.setColour("#F4511E");;
        this.setTooltip('Argumento para construtor');
    }
};

// Acessar Campo
Blockly.Blocks['object_get_field'] = {
    init: function() {
        this.appendValueInput('OBJECT')
            .setCheck('Object');
        this.appendDummyInput()
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('field'), 'FIELD_NAME');
        this.setOutput(true, null);
        this.setColour("#F4511E");;
        this.setTooltip('Acessa um campo do objeto');
    }
};

// Definir Campo
Blockly.Blocks['object_set_field'] = {
    init: function() {
        this.appendValueInput('OBJECT')
            .setCheck('Object');
        this.appendDummyInput()
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('field'), 'FIELD_NAME')
            .appendField('=');
        this.appendValueInput('VALUE')
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#F4511E");;
        this.setTooltip('Define o valor de um campo do objeto');
    }
};

// Chamar Método
Blockly.Blocks['object_call_method'] = {
    init: function() {
        this.appendValueInput('OBJECT')
            .setCheck('Object');
        this.appendDummyInput()
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('method'), 'METHOD_NAME')
            .appendField('(');
        this.appendStatementInput('ARGS')
            .setCheck('method_arg');
        this.appendDummyInput()
            .appendField(')');
        this.setOutput(true, null);
        this.setColour("#F4511E");;
        this.setTooltip('Chama um método do objeto');
    }
};

// Argumento de Método
Blockly.Blocks['method_arg'] = {
    init: function() {
        this.appendValueInput('ARG_VALUE')
            .setCheck(null);
        this.setPreviousStatement(true, 'method_arg');
        this.setNextStatement(true, 'method_arg');
        this.setColour("#F4511E");;
        this.setTooltip('Argumento para método');
    }
};

// Instanceof
Blockly.Blocks['object_instance_of'] = {
    init: function() {
        this.appendValueInput('OBJECT')
            .setCheck('Object');
        this.appendDummyInput()
            .appendField('instanceof')
            .appendField(new Blockly.FieldTextInput('Type'), 'TYPE');
        this.setOutput(true, 'Boolean');
        this.setColour("#F4511E");;
        this.setTooltip('Verifica se o objeto é instância de um tipo');
    }
};

// Cast
Blockly.Blocks['object_cast'] = {
    init: function() {
        this.appendValueInput('OBJECT')
            .setCheck('Object')
            .appendField('(')
            .appendField(new Blockly.FieldTextInput('Type'), 'TYPE')
            .appendField(')');
        this.setOutput(true, 'Object');
        this.setColour("#F4511E");;
        this.setTooltip('Converte o objeto para outro tipo');
    }
};

// Geradores de código
Blockly.JavaScript['object_create'] = function(block) {
    let className = block.getFieldValue('CLASS_NAME');
    let args = Blockly.JavaScript.statementToCode(block, 'CONSTRUCTOR_ARGS');
    args = args.trim().replace(/,\s*$/, ''); // Remove última vírgula
    return [`new ${className}(${args})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['constructor_arg'] = function(block) {
    let value = Blockly.JavaScript.valueToCode(block, 'ARG_VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return value + ', ';
};

Blockly.JavaScript['object_get_field'] = function(block) {
    let object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
    let field = block.getFieldValue('FIELD_NAME');
    return [`${object}.${field}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['object_set_field'] = function(block) {
    let object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
    let field = block.getFieldValue('FIELD_NAME');
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return `${object}.${field} = ${value};\n`;
};

Blockly.JavaScript['object_call_method'] = function(block) {
    let object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
    let method = block.getFieldValue('METHOD_NAME');
    let args = Blockly.JavaScript.statementToCode(block, 'ARGS');
    args = args.trim().replace(/,\s*$/, ''); // Remove última vírgula
    return [`${object}.${method}(${args})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['method_arg'] = function(block) {
    let value = Blockly.JavaScript.valueToCode(block, 'ARG_VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return value + ', ';
};

Blockly.JavaScript['object_instance_of'] = function(block) {
    let object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
    let type = block.getFieldValue('TYPE');
    return [`${object} instanceof ${type}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['object_cast'] = function(block) {
    let object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    let type = block.getFieldValue('TYPE');
    return [`(${type}) ${object}`, Blockly.JavaScript.ORDER_ATOMIC];
};