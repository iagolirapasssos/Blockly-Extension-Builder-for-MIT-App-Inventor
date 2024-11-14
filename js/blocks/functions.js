// Função sem retorno
Blockly.Blocks['procedures_defnoreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('procedimento')
            .appendField(new Blockly.FieldTextInput('nome'), 'NAME');
        this.appendStatementInput('STACK')
            .appendField('faça');
        this.setColour('#827717');
        this.setTooltip('Cria uma função sem valor de retorno');
        this.setHelpUrl('');
    }
};

// Função com retorno
Blockly.Blocks['procedures_defreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('função')
            .appendField(new Blockly.FieldTextInput('nome'), 'NAME');
        this.appendStatementInput('STACK')
            .appendField('faça');
        this.appendValueInput('RETURN')
            .appendField('retornar');
        this.setColour('#827717');
        this.setTooltip('Cria uma função que retorna um valor');
        this.setHelpUrl('');
    }
};

// Retorno condicional
Blockly.Blocks['procedures_ifreturn'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('se');
        this.appendValueInput('VALUE')
            .appendField('retornar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#827717');
        this.setTooltip('Retorna um valor se a condição for verdadeira');
    }
};

// Chamar procedimento sem retorno
Blockly.Blocks['procedures_callnoreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('chamar')
            .appendField(new Blockly.FieldTextInput('procedimento'), 'NAME');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#827717');
        this.setTooltip('Chama um procedimento sem retorno');
    }
};

// Chamar função com retorno
Blockly.Blocks['procedures_callreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('chamar função')
            .appendField(new Blockly.FieldTextInput('função'), 'NAME');
        this.setOutput(true, null);
        this.setColour('#827717');
        this.setTooltip('Chama uma função que retorna um valor');
    }
};

// Bloco de retorno simples
Blockly.Blocks['function_return'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('retornar');
        this.setPreviousStatement(true, null);
        this.setNextStatement(false, null);
        this.setColour('#827717');
        this.setTooltip('Retorna um valor da função');
    }
};

// Geradores de código
Blockly.JavaScript['procedures_defnoreturn'] = function(block) {
    var funcName = block.getFieldValue('NAME');
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK') || '';
    return `public void ${funcName}() {\n${branch}}\n`;
};

Blockly.JavaScript['procedures_defreturn'] = function(block) {
    var funcName = block.getFieldValue('NAME');
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK') || '';
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_ATOMIC) || '';
    return `public Object ${funcName}() {\n${branch}return ${returnValue};\n}\n`;
};

Blockly.JavaScript['procedures_ifreturn'] = function(block) {
    var condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '';
    return `if (${condition}) {\n    return ${value};\n}\n`;
};

Blockly.JavaScript['procedures_callnoreturn'] = function(block) {
    var funcName = block.getFieldValue('NAME');
    return `${funcName}();\n`;
};

Blockly.JavaScript['procedures_callreturn'] = function(block) {
    var funcName = block.getFieldValue('NAME');
    return [`${funcName}()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['function_return'] = function(block) {
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '';
    return `return ${value};\n`;
};