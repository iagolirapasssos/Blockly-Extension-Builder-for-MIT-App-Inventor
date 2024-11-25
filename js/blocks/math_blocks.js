//blocks/math_blocks.js
'use strict';


// Number block
Blockly.Blocks['math_number'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), 'NUM');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('A number');
    }
};

// Multiple Math Operations
Blockly.Blocks['math_operation'] = {
    init: function() {
        this.setHelpUrl('');
        this.setColour("#8E24AA");
        this.itemCount_ = 2; // Começa com duas entradas
        this.updateShape_();
        this.setOutput(true, 'Number');
        this.setMutator(new Blockly.Mutator(['math_operation_item']));
        this.setTooltip('Performs mathematical operations on numbers.');
    },

    mutationToDom: function() {
        let container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },

    decompose: function(workspace) {
        let containerBlock = workspace.newBlock('math_operation_container');
        containerBlock.initSvg();

        let connection = containerBlock.getInput('STACK').connection;
        for (let i = 0; i < this.itemCount_ - 1; i++) {
            let itemBlock = workspace.newBlock('math_operation_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return containerBlock;
    },

    compose: function(containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        let connections = [];
        let operators = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            operators.push(itemBlock.getFieldValue('OP'));
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }

        this.itemCount_ = connections.length + 1;
        this.updateShape_();

        for (let i = 1; i < this.itemCount_; i++) {
            if (operators[i - 1]) {
                this.getField('OP' + i).setValue(operators[i - 1]);
            }
            if (connections[i - 1]) {
                this.getInput('NUM' + i).connection.connect(connections[i - 1]);
            }
        }
    },

    updateShape_: function() {
        if (!this.getInput('NUM0')) {
            this.appendValueInput('NUM0')
                .setCheck('Number');
        }

        let i = 1;
        while (this.getInput('NUM' + i)) {
            this.removeInput('NUM' + i);
            i++;
        }

        for (let i = 1; i < this.itemCount_; i++) {
            this.appendValueInput('NUM' + i)
                .setCheck('Number')
                .appendField(new Blockly.FieldDropdown([
                    ['+', 'ADD'],
                    ['-', 'SUBTRACT'],
                    ['×', 'MULTIPLY'],
                    ['÷', 'DIVIDE']
                ]), 'OP' + i);
        }
    }
};


// Container block for mutator
Blockly.Blocks['math_operation_container'] = {
    init: function() {
        this.setColour("#8E24AA");
        this.appendDummyInput()
            .appendField('numbers');
        this.appendStatementInput('STACK');
        this.setTooltip('Add numbers for math operations');
        this.contextMenu = false;
    }
};

// Item block for mutator
Blockly.Blocks['math_operation_item'] = {
    init: function() {
        this.setColour("#8E24AA");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['+', 'ADD'],
                ['-', 'SUBTRACT'],
                ['×', 'MULTIPLY'],
                ['÷', 'DIVIDE'],
                ['%', 'MODULO'],
                ['^', 'POWER']
            ]), 'OP');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Adds a new number with operator');
        this.contextMenu = false;
    }
};

// Math functions
Blockly.Blocks['math_function'] = {
    init: function() {
        this.appendValueInput('NUMBER')
            .setCheck('Number')
            .appendField(new Blockly.FieldDropdown([
                ['abs', 'Math.abs'],
                ['sqrt', 'Math.sqrt'],
                ['pow', 'Math.pow'],
                ['sin', 'Math.sin'],
                ['cos', 'Math.cos'],
                ['tan', 'Math.tan'],
                ['round', 'Math.round'],
                ['ceil', 'Math.ceil'],
                ['floor', 'Math.floor'],
                ['log', 'Math.log'],
                ['log10', 'Math.log10'],
                ['exp', 'Math.exp']
            ]), 'FUNC');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Advanced mathematical functions');
    }
};

// Random with options
Blockly.Blocks['math_random'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('random')
            .appendField(new Blockly.FieldDropdown([
                ['number between', 'INT'],
                ['decimal between', 'FLOAT'],
                ['decimal 0-1', 'RANDOM'],
                ['boolean', 'BOOL']
            ]), 'TYPE');
        this.appendValueInput('MIN')
            .setCheck('Number')
            .appendField('min');
        this.appendValueInput('MAX')
            .setCheck('Number')
            .appendField('max');
        this.setOutput(true, ['Number', 'Boolean']);
        this.setColour("#8E24AA");
        this.setTooltip('Generates random numbers');
        this.updateShape_();
    },

    updateShape_: function() {
        let type = this.getFieldValue('TYPE');
        if (type === 'RANDOM' || type === 'BOOL') {
            if (this.getInput('MIN')) this.removeInput('MIN');
            if (this.getInput('MAX')) this.removeInput('MAX');
        } else {
            if (!this.getInput('MIN')) {
                this.appendValueInput('MIN')
                    .setCheck('Number')
                    .appendField('min');
            }
            if (!this.getInput('MAX')) {
                this.appendValueInput('MAX')
                    .setCheck('Number')
                    .appendField('max');
            }
        }
    },

    onchange: function() {
        this.updateShape_();
    }
};

// Mathematical constants
Blockly.Blocks['math_constant'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['π', 'Math.PI'],
                ['e', 'Math.E'],
                ['φ (phi)', '1.618034'],
                ['√2', 'Math.SQRT2'],
                ['√½', 'Math.SQRT1_2'],
                ['∞', 'Infinity']
            ]), 'CONSTANT');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Mathematical constants');
    }
};

Blockly.Blocks['math_compare'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck('Number')
            .appendField('if');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['=', 'EQ'],
                ['≠', 'NEQ'],
                ['>', 'GT'],
                ['≥', 'GTE'],
                ['<', 'LT'],
                ['≤', 'LTE']
            ]), 'OP');
        this.appendValueInput('B')
            .setCheck('Number')
            .appendField('then');
        this.setOutput(true, 'Boolean');
        this.setColour("#8E24AA");
        this.setTooltip('Compares two numbers');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['math_max_min'] = {
    init: function() {
        this.appendValueInput('VALUE1')
            .setCheck('Number')
            .appendField(new Blockly.FieldDropdown([
                ['max', 'Math.max'],
                ['min', 'Math.min']
            ]), 'OP');
        this.appendValueInput('VALUE2')
            .setCheck('Number')
            .appendField('and');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Finds the maximum or minimum between two numbers');
    }
};

Blockly.Blocks['math_average'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('average of');
        this.appendValueInput('VALUES')
            .setCheck('Array');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Calculates the average of an array of numbers');
    }
};

Blockly.Blocks['math_sum'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('sum of');
        this.appendValueInput('VALUES')
            .setCheck('Array');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Calculates the sum of all numbers in an array');
    }
};

Blockly.Blocks['math_factorial'] = {
    init: function() {
        this.appendValueInput('NUMBER')
            .setCheck('Number')
            .appendField('factorial of');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Calculates the factorial of a number');
    }
};

Blockly.Blocks['math_modulo'] = {
    init: function() {
        this.appendValueInput('DIVIDEND')
            .setCheck('Number')
            .appendField('remainder of');
        this.appendValueInput('DIVISOR')
            .setCheck('Number')
            .appendField('divided by');
        this.setOutput(true, 'Number');
        this.setColour("#8E24AA");
        this.setTooltip('Calculates the remainder of division');
    }
};


// Code Generators

Blockly.JavaScript['math_modulo'] = function(block) {
    const dividend = Blockly.JavaScript.valueToCode(block, 'DIVIDEND', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const divisor = Blockly.JavaScript.valueToCode(block, 'DIVISOR', Blockly.JavaScript.ORDER_ATOMIC) || '1';
    const code = `(${dividend} % ${divisor})`;
    return [code, Blockly.JavaScript.ORDER_MODULUS];
};


Blockly.JavaScript['math_factorial'] = function(block) {
    const number = Blockly.JavaScript.valueToCode(block, 'NUMBER', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const code = `
    (function factorial(n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    })(${number})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['math_sum'] = function(block) {
    const values = Blockly.JavaScript.valueToCode(block, 'VALUES', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
    const code = `${values}.reduce((a, b) => a + b, 0)`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['math_average'] = function(block) {
    const values = Blockly.JavaScript.valueToCode(block, 'VALUES', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
    const code = `(${values}.reduce((a, b) => a + b, 0) / ${values}.length)`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};


Blockly.JavaScript['math_max_min'] = function(block) {
    const value1 = Blockly.JavaScript.valueToCode(block, 'VALUE1', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const value2 = Blockly.JavaScript.valueToCode(block, 'VALUE2', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const operator = block.getFieldValue('OP');
    const code = `${operator}(${value1}, ${value2})`;
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript['math_compare'] = function(block) {
    const valueA = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const valueB = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const operator = block.getFieldValue('OP');

    let code;
    switch (operator) {
        case 'EQ': // Igual a
            code = `${valueA} == ${valueB}`;
            break;
        case 'NEQ': // Diferente de
            code = `${valueA} != ${valueB}`;
            break;
        case 'GT': // Maior que
            code = `${valueA} > ${valueB}`;
            break;
        case 'GTE': // Maior ou igual a
            code = `${valueA} >= ${valueB}`;
            break;
        case 'LT': // Menor que
            code = `${valueA} < ${valueB}`;
            break;
        case 'LTE': // Menor ou igual a
            code = `${valueA} <= ${valueB}`;
            break;
        default:
            code = 'false';
    }

    return [code, Blockly.JavaScript.ORDER_RELATIONAL];
};


Blockly.JavaScript['math_number'] = function(block) {
    let number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_operation'] = function(block) {
    let code = [];
    let firstValue = Blockly.JavaScript.valueToCode(block, 'NUM0', Blockly.JavaScript.ORDER_ATOMIC) || '0';

    code.push(firstValue);

    for (let i = 1; i < block.itemCount_; i++) {
        let operator = block.getFieldValue('OP' + i);
        let value = Blockly.JavaScript.valueToCode(block, 'NUM' + i, Blockly.JavaScript.ORDER_ATOMIC) || '0';

        switch (operator) {
            case 'ADD':
                code.push('+', value);
                break;
            case 'SUBTRACT':
                code.push('-', value);
                break;
            case 'MULTIPLY':
                code.push('*', value);
                break;
            case 'DIVIDE':
                if (value === '0') {
                    throw new Error("Division by zero error.");
                }
                code.push('/', value);
                break;
        }
    }

    return ['(' + code.join(' ') + ')', Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['math_constant'] = function(block) {
    let constant = block.getFieldValue('CONSTANT');
    return [constant, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_function'] = function(block) {
    let func = block.getFieldValue('FUNC');
    let number = Blockly.JavaScript.valueToCode(block, 'NUMBER', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [func + '(' + number + ')', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_random'] = function(block) {
    let type = block.getFieldValue('TYPE');
    let code;
    let min;
    let max

    switch(type) {
        case 'INT':
            min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
            max = Blockly.JavaScript.valueToCode(block, 'MAX', Blockly.JavaScript.ORDER_ATOMIC) || '100';
            code = `Math.floor(Math.random() * (${max} - ${min} + 1) + ${min})`;
            break;
        case 'FLOAT':
            min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
            max = Blockly.JavaScript.valueToCode(block, 'MAX', Blockly.JavaScript.ORDER_ATOMIC) || '1';
            code = `(Math.random() * (${max} - ${min}) + ${min})`;
            break;
        case 'RANDOM':
            code = 'Math.random()';
            break;
        case 'BOOL':
            code = 'Math.random() >= 0.5';
            break;
    }
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_operation_container'] = function(block) {
    return null;
};

Blockly.JavaScript['math_operation_item'] = function(block) {
    return null;
};
