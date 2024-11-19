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

// Bloco Foreach
Blockly.Blocks['controls_foreach_java'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('for (')
            .appendField(new Blockly.FieldTextInput("Type"), "ITEM_TYPE")
            .appendField(new Blockly.FieldTextInput("item"), "ITEM_NAME")
            .appendField(": ")
            .appendField(new Blockly.FieldTextInput("collection"), "COLLECTION_NAME")
            .appendField(")");
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('For each loop to iterate over a collection');
        this.setHelpUrl('');
    }
};

//News blocks
// Bloco Switch-Case
Blockly.Blocks['controls_switch_java'] = {
    init: function() {
        this.appendValueInput('SWITCH_VALUE')
            .appendField('switch');
        this.appendStatementInput('CASES')
            .appendField('cases');
        this.appendStatementInput('DEFAULT')
            .appendField('default');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Switch statement with cases');
    }
};

// Bloco Case
Blockly.Blocks['controls_case_java'] = {
    init: function() {
        this.appendValueInput('CASE_VALUE')
            .appendField('case');
        this.appendStatementInput('CASE_DO')
            .appendField('do');
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox("TRUE"), "ADD_BREAK")
            .appendField("add break");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Case statement for switch');
    }
};

// Bloco Do-While
Blockly.Blocks['controls_do_while_java'] = {
    init: function() {
        this.appendStatementInput('DO')
            .appendField('do');
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('while');
        this.appendDummyInput()
            .appendField(';');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Do-While loop');
    }
};

// Bloco Break com Label
Blockly.Blocks['controls_break_java'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('break')
            .appendField(new Blockly.FieldTextInput(''), 'LABEL');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Break statement with optional label');
    }
};

// Bloco Continue com Label
Blockly.Blocks['controls_continue_java'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('continue')
            .appendField(new Blockly.FieldTextInput(''), 'LABEL');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Continue statement with optional label');
    }
};

// Bloco Label
Blockly.Blocks['controls_label_java'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('label'), 'LABEL')
            .appendField(':');
        this.appendStatementInput('STATEMENTS')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Labeled statement block');
    }
};

// Bloco Synchronized
Blockly.Blocks['controls_synchronized_java'] = {
    init: function() {
        this.appendValueInput('LOCK_OBJECT')
            .appendField('synchronized');
        this.appendStatementInput('STATEMENTS')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Synchronized block for thread safety');
    }
};

// Bloco Assert
Blockly.Blocks['controls_assert_java'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .appendField('assert');
        this.appendValueInput('MESSAGE')
            .appendField('message');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#E53935");
        this.setTooltip('Assert statement with optional message');
    }
};

// Geradores de código
Blockly.JavaScript['controls_switch_java'] = function(block) {
    const switchValue = Blockly.JavaScript.valueToCode(block, 'SWITCH_VALUE', Blockly.JavaScript.ORDER_NONE) || '';
    const cases = Blockly.JavaScript.statementToCode(block, 'CASES');
    const defaultCase = Blockly.JavaScript.statementToCode(block, 'DEFAULT');
    
    return `switch (${switchValue}) {\n${cases}\ndefault:\n${defaultCase}}\n`;
};

Blockly.JavaScript['controls_case_java'] = function(block) {
    const caseValue = Blockly.JavaScript.valueToCode(block, 'CASE_VALUE', Blockly.JavaScript.ORDER_NONE) || '';
    const statements = Blockly.JavaScript.statementToCode(block, 'CASE_DO');
    const addBreak = block.getFieldValue('ADD_BREAK') === 'TRUE';
    
    return `case ${caseValue}:\n${statements}${addBreak ? 'break;\n' : ''}`;
};

Blockly.JavaScript['controls_do_while_java'] = function(block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    
    return `do {\n${branch}} while (${condition});\n`;
};

Blockly.JavaScript['controls_break_java'] = function(block) {
    const label = block.getFieldValue('LABEL');
    return `break${label ? ' ' + label : ''};\n`;
};

Blockly.JavaScript['controls_continue_java'] = function(block) {
    const label = block.getFieldValue('LABEL');
    return `continue${label ? ' ' + label : ''};\n`;
};

Blockly.JavaScript['controls_label_java'] = function(block) {
    const label = block.getFieldValue('LABEL');
    const statements = Blockly.JavaScript.statementToCode(block, 'STATEMENTS');
    return `${label}: {\n${statements}}\n`;
};

Blockly.JavaScript['controls_synchronized_java'] = function(block) {
    const lockObject = Blockly.JavaScript.valueToCode(block, 'LOCK_OBJECT', Blockly.JavaScript.ORDER_NONE) || 'this';
    const statements = Blockly.JavaScript.statementToCode(block, 'STATEMENTS');
    return `synchronized (${lockObject}) {\n${statements}}\n`;
};

Blockly.JavaScript['controls_assert_java'] = function(block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'true';
    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_NONE);
    return `assert ${condition}${message ? ' : ' + message : ''};\n`;
};

// Geradores de código para os blocos de controle
// Gerador de código para o bloco foreach
Blockly.JavaScript['controls_foreach_java'] = function(block) {
    const itemType = block.getFieldValue('ITEM_TYPE');
    const itemName = block.getFieldValue('ITEM_NAME');
    const collectionName = block.getFieldValue('COLLECTION_NAME');
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    
    return `for (${itemType} ${itemName} : ${collectionName}) {\n` +
           `${branch}` +
           `}\n`;
};

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