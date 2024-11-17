//blocks/text_blocks.js
'use strict';

// Simple Text Block
Blockly.Blocks['text_string'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('"')
            .appendField(new Blockly.FieldTextInput(''), 'TEXT')
            .appendField('"');
        this.setOutput(true, 'String');
        this.setColour("#3949AB");
        this.setTooltip('Text string');
    }
};

Blockly.Blocks['text_compare'] = {
    init: function() {
        this.appendValueInput('TEXT1')
            .setCheck('String')
            .appendField('compare text');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['is equal to', 'EQ'],
                ['is not equal to', 'NEQ'],
                ['contains', 'CONTAINS'],
                ['does not contain', 'NOT_CONTAINS']
            ]), 'OP');
        this.appendValueInput('TEXT2')
            .setCheck('String')
            .appendField('with text');
        this.setOutput(true, 'Boolean');
        this.setColour("#3949AB");
        this.setTooltip('Compares two texts or checks if one contains the other.');
        this.setHelpUrl('');
    }
};

// Concatenate Texts Block
Blockly.Blocks['text_join'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck(['String', 'Number']);
        this.appendValueInput('B')
            .setCheck(['String', 'Number'])
            .appendField('+');
        this.setOutput(true, 'String');
        this.setColour("#3949AB");
        this.setTooltip('Concatenates texts');
    }
};

// Text Operations Block
Blockly.Blocks['text_operation'] = {
    init: function() {
        this.appendValueInput('TEXT')
            .setCheck('String')
            .appendField(new Blockly.FieldDropdown([
                ['length', 'LENGTH'],
                ['to uppercase', 'UPPER'],
                ['to lowercase', 'LOWER'],
                ['trim', 'TRIM']
            ]), 'OP');
        this.setOutput(true, ['String', 'Number']);
        this.setColour("#3949AB");
        this.setTooltip('Text operations');
    }
};

// Character at index Block
Blockly.Blocks['text_charAt'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('character at');
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('position');
        this.setOutput(true, 'String');
        this.setColour("#3949AB");
        this.setTooltip('Returns the character at the specified position in the string');
    }
};

// Find Index of Substring Block
Blockly.Blocks['text_indexOf'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('find in');
        this.appendValueInput('SUBSTRING')
            .setCheck('String')
            .appendField('substring');
        this.setOutput(true, 'Number');
        this.setColour("#3949AB");
        this.setTooltip('Finds the position of a substring in the text');
    }
};

// Replace Text Block
Blockly.Blocks['text_replace'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('replace in');
        this.appendValueInput('TARGET')
            .setCheck('String')
            .appendField('target');
        this.appendValueInput('REPLACEMENT')
            .setCheck('String')
            .appendField('with');
        this.setOutput(true, 'String');
        this.setColour("#3949AB");
        this.setTooltip('Replaces occurrences of the target text with replacement text');
    }
};

// Split Text Block
Blockly.Blocks['text_split'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('split');
        this.appendValueInput('DELIMITER')
            .setCheck('String')
            .appendField('by');
        this.setOutput(true, 'Array');
        this.setColour("#3949AB");
        this.setTooltip('Splits the string into an array using a delimiter');
    }
};

// JavaScript Generators
Blockly.JavaScript['text_compare'] = function(block) {
    const text1 = Blockly.JavaScript.valueToCode(block, 'TEXT1', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const text2 = Blockly.JavaScript.valueToCode(block, 'TEXT2', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const operator = block.getFieldValue('OP');

    let code;
    switch (operator) {
        case 'EQ': // Igual a
            code = `${text1} === ${text2}`;
            break;
        case 'NEQ': // Diferente de
            code = `${text1} !== ${text2}`;
            break;
        case 'CONTAINS': // Contém
            code = `${text1}.includes(${text2})`;
            break;
        case 'NOT_CONTAINS': // Não contém
            code = `!${text1}.includes(${text2})`;
            break;
        default:
            code = 'false';
    }

    return [code, Blockly.JavaScript.ORDER_RELATIONAL];
};

Blockly.JavaScript['text_string'] = function(block) {
    const text = block.getFieldValue('TEXT');
    return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_join'] = function(block) {
    const a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${a} + ${b}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_operation'] = function(block) {
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const op = block.getFieldValue('OP');
    switch (op) {
        case 'LENGTH':
            return [`${text}.length()`, Blockly.JavaScript.ORDER_ATOMIC];
        case 'UPPER':
            return [`${text}.toUpperCase()`, Blockly.JavaScript.ORDER_ATOMIC];
        case 'LOWER':
            return [`${text}.toLowerCase()`, Blockly.JavaScript.ORDER_ATOMIC];
        case 'TRIM':
            return [`${text}.trim()`, Blockly.JavaScript.ORDER_ATOMIC];
        default:
            return ['""', Blockly.JavaScript.ORDER_ATOMIC];
    }
};

Blockly.JavaScript['text_charAt'] = function(block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`${string}.charAt(${index})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_indexOf'] = function(block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const substring = Blockly.JavaScript.valueToCode(block, 'SUBSTRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${string}.indexOf(${substring})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_replace'] = function(block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const target = Blockly.JavaScript.valueToCode(block, 'TARGET', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const replacement = Blockly.JavaScript.valueToCode(block, 'REPLACEMENT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${string}.replace(${target}, ${replacement})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_split'] = function(block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const delimiter = Blockly.JavaScript.valueToCode(block, 'DELIMITER', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${string}.split(${delimiter})`, Blockly.JavaScript.ORDER_ATOMIC];
};
