//blocks/dictionary_blocks.js
'use strict';

// Create a new HashMap
Blockly.Blocks['dict_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('new HashMap<')
            .appendField(new Blockly.FieldDropdown([
                ['String', 'String'],
                ['Integer', 'Integer'],
                ['Boolean', 'Boolean'],
                ['Object', 'Object']
            ]), 'KEY_TYPE')
            .appendField(',')
            .appendField(new Blockly.FieldDropdown([
                ['String', 'String'],
                ['Integer', 'Integer'],
                ['Boolean', 'Boolean'],
                ['Object', 'Object']
            ]), 'VALUE_TYPE')
            .appendField('>');
        this.setOutput(true, 'HashMap');
        this.setColour("#43A047");
        this.setTooltip('Creates a new HashMap');
    }
};

// Get value from HashMap
Blockly.Blocks['dict_get'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('get value from');
        this.appendValueInput('KEY')
            .setCheck(null)
            .appendField('with key');
        this.setOutput(true, null);
        this.setColour("#43A047");
        this.setTooltip('Gets a value from the HashMap by key');
    }
};

// Set value in HashMap
Blockly.Blocks['dict_set'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('set in');
        this.appendValueInput('KEY')
            .setCheck(null)
            .appendField('key');
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('value');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#43A047");
        this.setTooltip('Sets a value in the HashMap by key');
    }
};

// Remove value from HashMap
Blockly.Blocks['dict_remove'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('remove from');
        this.appendValueInput('KEY')
            .setCheck(null)
            .appendField('key');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#43A047");
        this.setTooltip('Removes a value from the HashMap by key');
    }
};

// Check if HashMap contains key
Blockly.Blocks['dict_containsKey'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('contains key');
        this.appendValueInput('KEY')
            .setCheck(null);
        this.setOutput(true, 'Boolean');
        this.setColour("#43A047");
        this.setTooltip('Checks if the HashMap contains the specified key');
    }
};

// Get all keys
Blockly.Blocks['dict_keys'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('get all keys from');
        this.setOutput(true, 'Set');
        this.setColour("#43A047");
        this.setTooltip('Gets all keys from the HashMap');
    }
};

// Get all values
Blockly.Blocks['dict_values'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('get all values from');
        this.setOutput(true, 'Collection');
        this.setColour("#43A047");
        this.setTooltip('Gets all values from the HashMap');
    }
};

// Code Generators
Blockly.JavaScript['dict_create'] = function(block) {
    const keyType = block.getFieldValue('KEY_TYPE');
    const valueType = block.getFieldValue('VALUE_TYPE');
    return [`new HashMap<${keyType}, ${valueType}>()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_get'] = function(block) {
    const dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    const key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${dict}.get(${key})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_set'] = function(block) {
    const dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    const key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `${dict}.put(${key}, ${value});\n`;
};

Blockly.JavaScript['dict_remove'] = function(block) {
    const dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    const key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `${dict}.remove(${key});\n`;
};

Blockly.JavaScript['dict_containsKey'] = function(block) {
    const dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    const key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${dict}.containsKey(${key})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_keys'] = function(block) {
    const dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    return [`${dict}.keySet()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_values'] = function(block) {
    const dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    return [`${dict}.values()`, Blockly.JavaScript.ORDER_ATOMIC];
};
