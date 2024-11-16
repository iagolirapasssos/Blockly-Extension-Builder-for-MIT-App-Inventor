//blocks/method_inserts.js
'use strict';
Blockly.Blocks['post_runnable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
            .appendField(".post new Runnable");
        this.appendStatementInput("CONTENT")
            .setCheck(null)
            .appendField("content");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Executes code inside a Runnable using post with a prefix.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['post_runnable'] = function(block) {
    const prefix = block.getFieldValue('PREFIX');
    const content = Blockly.JavaScript.statementToCode(block, 'CONTENT');
    return `${prefix}.post(new Runnable() {\n    @Override\n    public void run() {\n${content}    }\n});\n`;
};

Blockly.Blocks['run_on_ui_thread'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
            .appendField(".$form().runOnUiThread");
        this.appendStatementInput("CONTENT")
            .setCheck(null)
            .appendField("content");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Runs code on the UI thread with a prefix.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['run_on_ui_thread'] = function(block) {
    const prefix = block.getFieldValue('PREFIX');
    const content = Blockly.JavaScript.statementToCode(block, 'CONTENT');
    return `${prefix}.runOnUiThread(new Runnable() {\n    @Override\n    public void run() {\n${content}    }\n});\n`;
};


Blockly.Blocks['set_on_click_listener'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
            .appendField(".setOnClickListener");
        this.appendStatementInput("CONTENT")
            .setCheck(null)
            .appendField("content");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Sets an OnClickListener with a prefix.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['set_on_click_listener'] = function(block) {
    const prefix = block.getFieldValue('PREFIX');
    const content = Blockly.JavaScript.statementToCode(block, 'CONTENT');
    return `${prefix}.setOnClickListener(new View.OnClickListener() {\n    @Override\n    public void onClick(View v) {\n${content}    }\n});\n`;
};

Blockly.Blocks['add_text_view'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
            .appendField(".addTextView");
        this.appendValueInput("TEXT")
            .setCheck("String")
            .appendField("with text");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Adds a TextView with specified text to a layout.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['add_text_view'] = function(block) {
    const prefix = block.getFieldValue('PREFIX');
    const text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
    return `${prefix}.addView(new TextView(context) {{ setText(${text}); }});\n`;
};

Blockly.Blocks['add_image_view'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
            .appendField(".addImageView");
        this.appendValueInput("IMAGE_PATH")
            .setCheck("String")
            .appendField("with image path");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Adds an ImageView with the specified image path.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['add_image_view'] = function(block) {
    const prefix = block.getFieldValue('PREFIX');
    const imagePath = Blockly.JavaScript.valueToCode(block, 'IMAGE_PATH', Blockly.JavaScript.ORDER_ATOMIC);
    return `${prefix}.addView(new ImageView(context) {{ setImageURI(Uri.parse(${imagePath})); }});\n`;
};

Blockly.Blocks['scroll_to_bottom'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
            .appendField(".scrollToBottom");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Scrolls a ScrollView to the bottom.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['scroll_to_bottom'] = function(block) {
    const prefix = block.getFieldValue('PREFIX');
    return `${prefix}.post(new Runnable() {\n    @Override\n    public void run() {\n        ${prefix}.fullScroll(View.FOCUS_DOWN);\n    }\n});\n`;
};

Blockly.Blocks['show_toast'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Show Toast");
        this.appendValueInput("MESSAGE")
            .setCheck("String")
            .appendField("message");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#4CAF50");
        this.setTooltip("Shows a toast message.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['show_toast'] = function(block) {
    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC);
    return `Toast.makeText(context, ${message}, Toast.LENGTH_SHORT).show();\n`;
};

