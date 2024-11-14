// Texto simples
Blockly.Blocks['text_string'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('"')
            .appendField(new Blockly.FieldTextInput(''), 'TEXT')
            .appendField('"');
        this.setOutput(true, 'String');
        this.setColour("#3949AB");
        this.setTooltip('String de texto');
    }
};

// Concatenar textos
Blockly.Blocks['text_join'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck(['String', 'Number']);
        this.appendValueInput('B')
            .setCheck(['String', 'Number'])
            .appendField('+');
        this.setOutput(true, 'String');
        this.setColour("#3949AB");
        this.setTooltip('Concatena textos');
    }
};

// Operações com texto
Blockly.Blocks['text_operation'] = {
    init: function() {
        this.appendValueInput('TEXT')
            .setCheck('String')
            .appendField(new Blockly.FieldDropdown([
                ['comprimento', 'LENGTH'],
                ['maiúsculas', 'UPPER'],
                ['minúsculas', 'LOWER'],
                ['trim', 'TRIM']
            ]), 'OP');
        this.setOutput(true, ['String', 'Number']);
        this.setColour("#3949AB");
        this.setTooltip('Operações com texto');
    }
};

// Log message block
Blockly.Blocks['log_message'] = {
    init: function() {
        this.appendValueInput('MESSAGE')
            .setCheck('String')
            .appendField(new Blockly.FieldDropdown([
                ['Info', 'INFO'],
                ['Warning', 'WARNING'],
                ['Error', 'ERROR'],
                ['Debug', 'DEBUG']
            ]), 'LOG_LEVEL')
            .appendField('Log');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#3949AB");
        this.setTooltip('Logs a message at the selected log level');
        this.setHelpUrl('');
    }
};

// Log message with tag
Blockly.Blocks['log_message_tagged'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['Info', 'INFO'],
                ['Warning', 'WARNING'],
                ['Error', 'ERROR'],
                ['Debug', 'DEBUG']
            ]), 'LOG_LEVEL')
            .appendField('Log with tag');
        this.appendValueInput('TAG')
            .setCheck('String')
            .appendField('Tag');
        this.appendValueInput('MESSAGE')
            .setCheck('String')
            .appendField('Message');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#3949AB");
        this.setTooltip('Logs a message with a custom tag at the selected log level');
        this.setHelpUrl('');
    }
};

// Log generator functions
Blockly.JavaScript['log_message'] = function(block) {
    var logLevel = block.getFieldValue('LOG_LEVEL');
    var message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '""';

    var logMethod;
    switch (logLevel) {
        case 'INFO': logMethod = 'console.info'; break;
        case 'WARNING': logMethod = 'console.warn'; break;
        case 'ERROR': logMethod = 'console.error'; break;
        case 'DEBUG': logMethod = 'console.debug'; break;
        default: logMethod = 'console.log';
    }

    var code = `${logMethod}(${message});\n`;
    return code;
};

Blockly.JavaScript['log_message_tagged'] = function(block) {
    var logLevel = block.getFieldValue('LOG_LEVEL');
    var tag = Blockly.JavaScript.valueToCode(block, 'TAG', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '""';

    var logMethod;
    switch (logLevel) {
        case 'INFO': logMethod = 'console.info'; break;
        case 'WARNING': logMethod = 'console.warn'; break;
        case 'ERROR': logMethod = 'console.error'; break;
        case 'DEBUG': logMethod = 'console.debug'; break;
        default: logMethod = 'console.log';
    }

    var code = `${logMethod}("[${tag}] " + ${message});\n`;
    return code;
};


// Geradores de código para texto
Blockly.JavaScript['text_string'] = function(block) {
    var text = block.getFieldValue('TEXT');
    return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_join'] = function(block) {
    var a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${a} + ${b}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_operation'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var op = block.getFieldValue('OP');
    var code = '';
    
    switch(op) {
        case 'LENGTH': code = `${text}.length()`; break;
        case 'UPPER': code = `${text}.toUpperCase()`; break;
        case 'LOWER': code = `${text}.toLowerCase()`; break;
        case 'TRIM': code = `${text}.trim()`; break;
    }
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
