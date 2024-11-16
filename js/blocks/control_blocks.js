// Bloco If-Else
Blockly.Blocks['controls_if_java'] = {
    init: function() {
        this.appendValueInput('IF0')
            .setCheck('Boolean')
            .appendField('if');
        this.appendStatementInput('DO0')
            .appendField('do');
        this.appendStatementInput('ELSE')
            .appendField('else');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('If-else control statement');
    }
};

// Bloco For
Blockly.Blocks['controls_for_java'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('for')
            .appendField(new Blockly.FieldTextInput('i'), 'VAR')
            .appendField('from')
            .appendField(new Blockly.FieldNumber(0), 'FROM')
            .appendField('to')
            .appendField(new Blockly.FieldNumber(10), 'TO')
            .appendField('step')
            .appendField(new Blockly.FieldNumber(1), 'STEP');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('For loop with variable');
    }
};

// Bloco While
Blockly.Blocks['controls_while_java'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('while');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('While loop');
    }
};

// Geradores de código para os blocos de controle
Blockly.JavaScript['controls_if_java'] = function(block) {
    let condition = Blockly.JavaScript.valueToCode(block, 'IF0', Blockly.JavaScript.ORDER_NONE) || 'false';
    let thenBranch = Blockly.JavaScript.statementToCode(block, 'DO0');
    let elseBranch = Blockly.JavaScript.statementToCode(block, 'ELSE');
    
    return `if (${condition}) {
        ${thenBranch}
    } else {
        ${elseBranch}
    }\n`;
};

Blockly.JavaScript['controls_for_java'] = function(block) {
    let variable = block.getFieldValue('VAR');
    let from = block.getFieldValue('FROM');
    let to = block.getFieldValue('TO');
    let step = block.getFieldValue('STEP');
    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    
    return `for (int ${variable} = ${from}; ${variable} <= ${to}; ${variable} += ${step}) {
        ${branch}
    }\n`;
};

Blockly.JavaScript['controls_while_java'] = function(block) {
    let condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    
    return `while (${condition}) {
        ${branch}
    }\n`;
};

// Bloco If-Else
Blockly.Blocks['controls_if_java'] = {
    init: function() {
        this.appendValueInput('IF0')
            .setCheck('Boolean')
            .appendField('if');
        this.appendStatementInput('DO0')
            .appendField('do');
        this.appendStatementInput('ELSE')
            .appendField('else');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('If-else control statement');
    }
};

// Bloco For
Blockly.Blocks['controls_for_java'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('for')
            .appendField(new Blockly.FieldTextInput('i'), 'VAR')
            .appendField('from')
            .appendField(new Blockly.FieldNumber(0), 'FROM')
            .appendField('to')
            .appendField(new Blockly.FieldNumber(10), 'TO')
            .appendField('step')
            .appendField(new Blockly.FieldNumber(1), 'STEP');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('For loop with variable');
    }
};

// Bloco While
Blockly.Blocks['controls_while_java'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('while');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('While loop');
    }
};

// Try-Catch Block
Blockly.Blocks['controls_try_catch'] = {
    init: function() {
        this.appendStatementInput('TRY')
            .setCheck(null)
            .appendField('try');
        this.appendStatementInput('CATCH')
            .setCheck(null)
            .appendField('catch')
            .appendField(new Blockly.FieldTextInput('Exception'), 'EXCEPTION_TYPE')
            .appendField(new Blockly.FieldTextInput('e'), 'EXCEPTION_VAR');
        this.appendStatementInput('FINALLY')
            .setCheck(null)
            .appendField('finally');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Try-Catch-Finally block');
    }
};

// Return Block
Blockly.Blocks['controls_return'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('return');
        this.setPreviousStatement(true, null);
        this.setNextStatement(false, null); // Return geralmente é a última declaração
        this.setColour("#E53935");
        this.setTooltip('Return statement');
    }
};

// Geradores de código para os blocos de controle
Blockly.JavaScript['controls_if_java'] = function(block) {
    let condition = Blockly.JavaScript.valueToCode(block, 'IF0', Blockly.JavaScript.ORDER_NONE) || 'false';
    let thenBranch = Blockly.JavaScript.statementToCode(block, 'DO0');
    let elseBranch = Blockly.JavaScript.statementToCode(block, 'ELSE');
    
    return `if (${condition}) {
        ${thenBranch}
    } else {
        ${elseBranch}
    }\n`;
};

Blockly.JavaScript['controls_for_java'] = function(block) {
    let variable = block.getFieldValue('VAR');
    let from = block.getFieldValue('FROM');
    let to = block.getFieldValue('TO');
    let step = block.getFieldValue('STEP');
    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    
    return `for (int ${variable} = ${from}; ${variable} <= ${to}; ${variable} += ${step}) {
        ${branch}
    }\n`;
};

Blockly.JavaScript['controls_while_java'] = function(block) {
    let condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    let branch = Blockly.JavaScript.statementToCode(block, 'DO');
    
    return `while (${condition}) {
        ${branch}
    }\n`;
};

Blockly.JavaScript['controls_try_catch'] = function(block) {
    let tryCode = Blockly.JavaScript.statementToCode(block, 'TRY') || '';
    let catchCode = Blockly.JavaScript.statementToCode(block, 'CATCH') || '';
    let finallyCode = Blockly.JavaScript.statementToCode(block, 'FINALLY') || '';
    let exceptionType = block.getFieldValue('EXCEPTION_TYPE');
    let exceptionlet = block.getFieldValue('EXCEPTION_VAR');
    
    let code = 'try {\n' + 
        tryCode + 
        '} catch (' + exceptionType + ' ' + exceptionlet + ') {\n' +
        catchCode;

    if (finallyCode) {
        code += '} finally {\n' + finallyCode;
    }
    
    return code + '}\n';
};

Blockly.JavaScript['controls_return'] = function(block) {
    let value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '';
    return 'return ' + value + ';\n';
};