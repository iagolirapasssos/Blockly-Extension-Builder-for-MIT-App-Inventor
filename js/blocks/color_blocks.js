//blocks/color_blocks.js
'use strict';

// Color Picker
Blockly.Blocks['color_picker'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('color')
            .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Selects a color');
    }
};

// RGB Color
Blockly.Blocks['color_rgb'] = {
    init: function() {
        this.appendValueInput('RED')
            .setCheck('Number')
            .appendField('color with R');
        this.appendValueInput('GREEN')
            .setCheck('Number')
            .appendField('G');
        this.appendValueInput('BLUE')
            .setCheck('Number')
            .appendField('B');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Creates a color from RGB values (0-255)');
    }
};

// Blend Colors
Blockly.Blocks['color_blend'] = {
    init: function() {
        this.appendValueInput('COLOR1')
            .setCheck('Color')
            .appendField('blend color');
        this.appendValueInput('COLOR2')
            .setCheck('Color')
            .appendField('with');
        this.appendValueInput('RATIO')
            .setCheck('Number')
            .appendField('ratio');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Blends two colors with a ratio (0-1)');
    }
};

// Random Color
Blockly.Blocks['color_random'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('random color');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Generates a random color');
    }
};

// Adjust Brightness
Blockly.Blocks['color_brightness'] = {
    init: function() {
        this.appendValueInput('COLOR')
            .setCheck('Color')
            .appendField('adjust brightness of');
        this.appendValueInput('AMOUNT')
            .setCheck('Number')
            .appendField('by amount');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Adjusts the brightness of a color by a specified amount');
    }
};

// Convert HEX to RGB
Blockly.Blocks['color_hex_to_rgb'] = {
    init: function() {
        this.appendValueInput('HEX')
            .setCheck('String')
            .appendField('convert HEX');
        this.setOutput(true, 'Color');
        this.setColour("#D81B60");
        this.setTooltip('Converts a HEX color string to an RGB color');
    }
};

// Convert RGB to HEX
Blockly.Blocks['color_rgb_to_hex'] = {
    init: function() {
        this.appendValueInput('COLOR')
            .setCheck('Color')
            .appendField('convert to HEX');
        this.setOutput(true, 'String');
        this.setColour("#D81B60");
        this.setTooltip('Converts an RGB color to a HEX color string');
    }
};

//Generators
// Code Generator for Color Picker
Blockly.JavaScript['color_picker'] = function(block) {
    // Get the selected color value from the block (e.g., '#ff0000')
    let color = block.getFieldValue('COLOR');

    // Remove the '#' character and convert to uppercase (e.g., 'FF0000')
    let hex = color.substring(1).toUpperCase();

    // Prepend 'FF' for the alpha channel to make it ARGB (e.g., 'FFFF0000')
    let argbHex = 'FF' + hex;

    // Generate JavaScript code to parse the ARGB hex string into a signed 32-bit integer
    // The bitwise OR with 0 (`| 0`) converts the number to a signed 32-bit integer
    let code = `parseInt('${argbHex}', 16) | 0`;

    // Return the generated code and specify the order of operations
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// Code Generator for RGB Color
// Code Generator for RGB Color
Blockly.JavaScript['color_rgb'] = function(block) {
    let red = Blockly.JavaScript.valueToCode(block, 'RED', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    let green = Blockly.JavaScript.valueToCode(block, 'GREEN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    let blue = Blockly.JavaScript.valueToCode(block, 'BLUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';

    // Generate Java code using Color.rgb method
    let code = `Color.rgb(${red}, ${green}, ${blue})`;

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// Code Generator for Blend Colors
// Code Generator for Blend Colors
Blockly.JavaScript['color_blend'] = function(block) {
    let color1 = Blockly.JavaScript.valueToCode(block, 'COLOR1', Blockly.JavaScript.ORDER_ATOMIC) || 'Color.BLACK';
    let color2 = Blockly.JavaScript.valueToCode(block, 'COLOR2', Blockly.JavaScript.ORDER_ATOMIC) || 'Color.WHITE';
    let ratio = Blockly.JavaScript.valueToCode(block, 'RATIO', Blockly.JavaScript.ORDER_ATOMIC) || '0.5';

    // Generate Java code using a helper method to blend colors
    // Since we cannot define helper methods within generated code, we'll inline the blending logic
    let code = `(int) ((1 - ${ratio}) * ${color1} + ${ratio} * ${color2})`;

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Code Generator for Random Color
Blockly.JavaScript['color_random'] = function(block) {
    // Generate Java code to create a random color using Math.random()
    let code = `(int)(Math.random() * 0x1000000) | 0xFF000000`;

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Code Generator for Adjust Brightness
// Code Generator for Adjust Brightness
Blockly.JavaScript['color_brightness'] = function(block) {
    let color = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC) || 'Color.BLACK';
    let amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '0';

    // Generate Java code to adjust brightness
    // This involves extracting RGB components, adjusting them, and recombining
    let code = `Color.argb(Color.alpha(${color}), 
        Math.min(255, Math.max(0, Color.red(${color}) + ${amount})), 
        Math.min(255, Math.max(0, Color.green(${color}) + ${amount})), 
        Math.min(255, Math.max(0, Color.blue(${color}) + ${amount})))`;

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Code Generator for Convert HEX to RGB
// Code Generator for Convert HEX to RGB
Blockly.JavaScript['color_hex_to_rgb'] = function(block) {
    let hex = Blockly.JavaScript.valueToCode(block, 'HEX', Blockly.JavaScript.ORDER_ATOMIC) || '"#000000"';

    // Generate Java code to convert HEX to RGB string
    let code = `Color.red(Color.parseColor(${hex})) + ", " + Color.green(Color.parseColor(${hex})) + ", " + Color.blue(Color.parseColor(${hex}))`;

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Code Generator for Convert RGB to HEX
// Code Generator for Convert RGB to HEX
Blockly.JavaScript['color_rgb_to_hex'] = function(block) {
    let rgb = Blockly.JavaScript.valueToCode(block, 'COLOR', Blockly.JavaScript.ORDER_ATOMIC) || '"rgb(0, 0, 0)"';

    // Generate Java code to convert RGB string to HEX color
    let code = `String.format("#%02X%02X%02X", 
        Integer.parseInt(${rgb}.split(",")[0].replace("rgb(", "").trim()), 
        Integer.parseInt(${rgb}.split(",")[1].trim()), 
        Integer.parseInt(${rgb}.split(",")[2].replace(")", "").trim()))`;

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
