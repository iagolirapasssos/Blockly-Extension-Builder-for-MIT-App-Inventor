// Seletor de cor
Blockly.Blocks['color_picker'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('cor')
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Seleciona uma cor');
    }
};

// RGB
Blockly.Blocks['color_rgb'] = {
    init: function() {
        this.appendValueInput('RED')
            .setCheck('Number')
            .appendField('cor com R');
        this.appendValueInput('GREEN')
            .setCheck('Number')
            .appendField('G');
        this.appendValueInput('BLUE')
            .setCheck('Number')
            .appendField('B');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Cria uma cor a partir de valores RGB (0-255)');
    }
};

// Misturar cores
Blockly.Blocks['color_blend'] = {
    init: function() {
        this.appendValueInput('COLOR1')
            .setCheck('Color')
            .appendField('misturar cor');
        this.appendValueInput('COLOR2')
            .setCheck('Color')
            .appendField('com');
        this.appendValueInput('RATIO')
            .setCheck('Number')
            .appendField('proporção');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Mistura duas cores com uma proporção (0-1)');
    }
};

// Cor aleatória
Blockly.Blocks['color_random'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('cor aleatória');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Gera uma cor aleatória');
    }
};

// Geradores de código para cores
Blockly.JavaScript['color_picker'] = function(block) {
    var color = block.getFieldValue('COLOR');
    return [`Color.parseColor("${color}")`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['color_rgb'] = function(block) {
    var red = Blockly.JavaScript.valueToCode(block, 'RED', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var green = Blockly.JavaScript.valueToCode(block, 'GREEN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var blue = Blockly.JavaScript.valueToCode(block, 'BLUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`Color.rgb(${red}, ${green}, ${blue})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['color_blend'] = function(block) {
    var color1 = Blockly.JavaScript.valueToCode(block, 'COLOR1', Blockly.JavaScript.ORDER_ATOMIC) || 'Color.BLACK';
    var color2 = Blockly.JavaScript.valueToCode(block, 'COLOR2', Blockly.JavaScript.ORDER_ATOMIC) || 'Color.WHITE';
    var ratio = Blockly.JavaScript.valueToCode(block, 'RATIO', Blockly.JavaScript.ORDER_ATOMIC) || '0.5';
    return [`ColorUtils.blendARGB(${color1}, ${color2}, ${ratio})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['color_random'] = function(block) {
    return [`Color.rgb((int)(Math.random() * 256), (int)(Math.random() * 256), (int)(Math.random() * 256))`, 
        Blockly.JavaScript.ORDER_ATOMIC];
};