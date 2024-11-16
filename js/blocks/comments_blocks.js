'use strict';

/**
 * Define comment blocks for Blockly.
 */

/**
 * Single-Line Comment Block
 */
Blockly.Blocks['comment_single'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('//')
            .appendField(new Blockly.FieldTextInput('Your comment here'), 'COMMENT_TEXT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210); // Hue for comments (grey)
        this.setTooltip('Inserts a single-line comment.');
        this.setHelpUrl('https://docs.oracle.com/javase/tutorial/java/nutsandbolts/comments.html');
    }
};

Blockly.Blocks['comment_multi_text'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('')
            .appendField(new Blockly.FieldTextInput('Your comment here'), 'COMMENT_TEXT');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210); // Hue for comments (grey)
        this.setTooltip('Inserts a single-line comment.');
        this.setHelpUrl('https://docs.oracle.com/javase/tutorial/java/nutsandbolts/comments.html');
    }
};

/**
 * Multi-Line Comment Block
 */
Blockly.Blocks['comment_multi'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('/*');
        this.appendStatementInput('COMMENT_LINES')
            .setCheck('comment_line');
        this.appendDummyInput()
            .appendField('*/');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210); // Hue for comments (grey)
        this.setTooltip('Inserts a multi-line comment. Add comment lines below.');
        this.setHelpUrl('https://docs.oracle.com/javase/tutorial/java/nutsandbolts/comments.html');
    }
};

/**
 * JavaScript Code Generator for Single-Line Comment
 */
Blockly.JavaScript['comment_single'] = function(block) {
    const commentText = block.getFieldValue('COMMENT_TEXT');
    const escapedText = commentText.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `// ${escapedText}\n`;
};

/**
 * JavaScript Code Generator for Multi-Line Comment
 */
Blockly.JavaScript['comment_multi'] = function(block) {
    const commentLines = Blockly.JavaScript.statementToCode(block, 'COMMENT_LINES').trim().split('\n');
    const formattedLines = commentLines.map(line => ` * ${line.trim()}`).join('\n');
    return `/*\n${formattedLines}\n */\n`;
};

/**
 * JavaScript Code Generator for comment_multi_text
 */
Blockly.JavaScript['comment_multi_text'] = function(block) {
    const commentText = block.getFieldValue('COMMENT_TEXT');
    const escapedText = commentText.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return ` ${escapedText}\n`;
};