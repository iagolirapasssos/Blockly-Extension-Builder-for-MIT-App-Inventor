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
        this.itemCount_ = 2;
        this.updateShape_();
        this.setOutput(true, 'Number');
        this.setMutator(new Blockly.Mutator(['math_operation_item']));
        this.setTooltip('Combines numbers with mathematical operations');
    },

    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },

    decompose: function(workspace) {
        var containerBlock = workspace.newBlock('math_operation_container');
        containerBlock.initSvg();
        
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_ - 1; i++) {
            var itemBlock = workspace.newBlock('math_operation_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        
        return containerBlock;
    },

    compose: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var connections = [];
        var operators = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            operators.push(itemBlock.getFieldValue('OP'));
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
        
        this.itemCount_ = connections.length + 1;
        this.updateShape_();
        
        for (var i = 1; i < this.itemCount_; i++) {
            if (operators[i-1]) {
                this.getField('OP' + i).setValue(operators[i-1]);
            }
            if (connections[i-1]) {
                this.getInput('NUM' + i).connection.connect(connections[i-1]);
            }
        }
    },

    updateShape_: function() {
        if (!this.getInput('NUM0')) {
            this.appendValueInput('NUM0')
                .setCheck('Number');
        }

        var i = 1;
        while (this.getInput('NUM' + i)) {
            this.removeInput('NUM' + i);
            i++;
        }

        for (var i = 1; i < this.itemCount_; i++) {
            this.appendValueInput('NUM' + i)
                .setCheck('Number')
                .appendField(new Blockly.FieldDropdown([
                    ['+', 'ADD'],
                    ['-', 'SUBTRACT'],
                    ['×', 'MULTIPLY'],
                    ['÷', 'DIVIDE'],
                    ['%', 'MODULO'],
                    ['^', 'POWER']
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
        var type = this.getFieldValue('TYPE');
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

// Code Generators
Blockly.JavaScript['math_number'] = function(block) {
    var number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_operation'] = function(block) {
    var code = [];
    
    code.push(Blockly.JavaScript.valueToCode(block, 'NUM0', Blockly.JavaScript.ORDER_ATOMIC) || '0');
    
    for (var i = 1; i < block.itemCount_; i++) {
        var operator = block.getFieldValue('OP' + i);
        var value = Blockly.JavaScript.valueToCode(block, 'NUM' + i, Blockly.JavaScript.ORDER_ATOMIC) || '0';
        
        switch(operator) {
            case 'ADD': code.push('+', value); break;
            case 'SUBTRACT': code.push('-', value); break; 
            case 'MULTIPLY': code.push('*', value); break; 
            case 'DIVIDE': code.push('/', value); break;
            case 'MODULO': code.push('%', value); break;
            case 'POWER': code.push('Math.pow(' + code.pop() + ',', value + ')'); break;
        }
    }
    
    return ['(' + code.join(' ') + ')', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_constant'] = function(block) {
    var constant = block.getFieldValue('CONSTANT');
    return [constant, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_function'] = function(block) {
    var func = block.getFieldValue('FUNC');
    var number = Blockly.JavaScript.valueToCode(block, 'NUMBER', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [func + '(' + number + ')', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_random'] = function(block) {
    var type = block.getFieldValue('TYPE');
    var code;
    
    switch(type) {
        case 'INT':
            var min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
            var max = Blockly.JavaScript.valueToCode(block, 'MAX', Blockly.JavaScript.ORDER_ATOMIC) || '100';
            code = `Math.floor(Math.random() * (${max} - ${min} + 1) + ${min})`;
            break;
        case 'FLOAT':
            var min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
            var max = Blockly.JavaScript.valueToCode(block, 'MAX', Blockly.JavaScript.ORDER_ATOMIC) || '1';
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
