//blocks/list_blocks.js
'use strict';

// Create List
Blockly.Blocks['lists_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('new ArrayList<')
            .appendField(new Blockly.FieldDropdown([
                ['String', 'String'],
                ['Integer', 'Integer'],
                ['Boolean', 'Boolean'],
                ['Double', 'Double']
            ]), 'TYPE')
            .appendField('>');
        this.setOutput(true, 'ArrayList');
        this.setColour("#00ACC1");
        this.setTooltip('Creates a new ArrayList.');
    }
};

// List Operations
// List Operations with target list selection
Blockly.Blocks['lists_operation'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('Operate on list:');
        this.appendDummyInput()
            .appendField('Operation')
            .appendField(new Blockly.FieldDropdown([
                ['add', 'ADD'],
                ['remove', 'REMOVE'],
                ['get', 'GET'],
                ['size', 'SIZE'],
                ['clear', 'CLEAR']
            ]), 'OPERATION');
        this.appendValueInput('ITEM')
            .setCheck(null)
            .appendField('Item'); // Only relevant for operations like add/remove/get
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Perform operations on the specified ArrayList.');
    }
};

// Get Item from List
Blockly.Blocks['lists_get_index'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('get item from list');
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('at index');
        this.setOutput(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Gets an item from the list at the specified index.');
    }
};

// Set Item in List
Blockly.Blocks['lists_set_index'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('set item in list');
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('at index');
        this.appendValueInput('ITEM')
            .appendField('to value');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Sets an item in the list at the specified index.');
    }
};

// For Each Item in List
Blockly.Blocks['lists_forEach'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('for each item in');
        this.appendDummyInput()
            .appendField('as')
            .appendField(new Blockly.FieldTextInput('item'), 'VAR');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Performs actions for each item in the list.');
    }
};

// JavaScript Generators
Blockly.JavaScript['lists_create'] = function(block) {
    const type = block.getFieldValue('TYPE');
    return [`new ArrayList<${type}>()`, Blockly.JavaScript.ORDER_ATOMIC];
};

// Updated JavaScript generator
Blockly.JavaScript['lists_operation'] = function(block) {
    const list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    const item = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const operation = block.getFieldValue('OPERATION');
    
    switch (operation) {
        case 'ADD':
            return `${list}.add(${item});\n`;
        case 'REMOVE':
            return `${list}.remove(${item});\n`;
        case 'GET':
            return `const result = ${list}.get(${item});\n`;
        case 'SIZE':
            return `const size = ${list}.size();\n`;
        case 'CLEAR':
            return `${list}.clear();\n`;
        default:
            return '';
    }
};

Blockly.JavaScript['lists_get_index'] = function(block) {
    const list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`${list}.get(${index})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['lists_set_index'] = function(block) {
    const list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const item = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return `${list}.set(${index}, ${item});\n`;
};

Blockly.JavaScript['lists_forEach'] = function(block) {
    const list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    const varName = block.getFieldValue('VAR');
    const branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
    return `for (let ${varName} of ${list}) {\n${branch}}\n`;
};
