// Comparações
Blockly.Blocks['logic_compare'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck(null);
        this.appendValueInput('B')
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([
                ['=', 'EQ'],
                ['≠', 'NEQ'],
                ['<', 'LT'],
                ['≤', 'LTE'],
                ['>', 'GT'],
                ['≥', 'GTE']
            ]), 'OP');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Compara dois valores');
    }
};

// Operações lógicas com múltiplas entradas
Blockly.Blocks['logic_operation'] = {
    init: function() {
        this.setHelpUrl('');
        this.setColour("#FDD835");
        this.itemCount_ = 2;
        this.updateShape_();
        this.setOutput(true, 'Boolean');
        this.setMutator(new Blockly.Mutator(['logic_operation_item']));
        this.setTooltip('Combina valores booleanos com AND/OR');
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
        let containerBlock = workspace.newBlock('logic_operation_container');
        containerBlock.initSvg();
        
        let connection = containerBlock.getInput('STACK').connection;
        for (let i = 0; i < this.itemCount_; i++) {
            let itemBlock = workspace.newBlock('logic_operation_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        
        return containerBlock;
    },

    compose: function(containerBlock) {
        let itemBlock = containerBlock.getInputTargetBlock('STACK');
        let connections = [];
        while (itemBlock) {
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
        
        this.itemCount_ = connections.length;
        this.updateShape_();
        
        for (let i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ADD' + i).connection.connect(connections[i]);
            }
        }
    },

    updateShape_: function() {
        let i = 0;
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }

        if (!this.getInput('OP')) {
            this.appendDummyInput('OP')
                .appendField(new Blockly.FieldDropdown([
                    ['and', 'AND'],
                    ['or', 'OR']
                ]), 'OP');
        }

        for (let i = 0; i < this.itemCount_; i++) {
            let input = this.appendValueInput('ADD' + i)
                .setCheck('Boolean');
            if (i === 0) {
                input.appendField('');
            }
        }

        if (this.itemCount_ === 0) {
            this.appendDummyInput('EMPTY')
                .appendField('(vazio)');
        }
    }
};

// Negação
Blockly.Blocks['logic_negate'] = {
    init: function() {
        this.appendValueInput('BOOL')
            .setCheck('Boolean')
            .appendField('not');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Nega um valor booleano');
    }
};

// Booleano
Blockly.Blocks['logic_boolean'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['true', 'TRUE'],
                ['false', 'FALSE']
            ]), 'BOOL');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Retorna verdadeiro ou falso');
    }
};

// Nulo
Blockly.Blocks['logic_null'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('null');
        this.setOutput(true, null);
        this.setColour("#FDD835");
        this.setTooltip('Retorna um valor nulo');
    }
};

// Blocos do mutator para logic_operation
Blockly.Blocks['logic_operation_container'] = {
    init: function() {
        this.setColour("#FDD835");
        this.appendDummyInput()
            .appendField('entradas');
        this.appendStatementInput('STACK');
        this.setTooltip("Adicione, remova ou reordene as entradas");
        this.contextMenu = false;
    }
};

Blockly.Blocks['logic_operation_item'] = {
    init: function() {
        this.setColour("#FDD835");
        this.appendDummyInput()
            .appendField('valor booleano');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip("Adiciona uma nova entrada booleana");
        this.contextMenu = false;
    }
};

// Geradores de código
Blockly.JavaScript['logic_compare'] = function(block) {
    let a = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    let b = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    let op = block.getFieldValue('OP');
    
    let code = '';
    switch(op) {
        case 'EQ': code = `${a}.equals(${b})`; break;
        case 'NEQ': code = `!${a}.equals(${b})`; break;
        case 'LT': code = `${a} < ${b}`; break;
        case 'LTE': code = `${a} <= ${b}`; break;
        case 'GT': code = `${a} > ${b}`; break;
        case 'GTE': code = `${a} >= ${b}`; break;
    }
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_operation'] = function(block) {
    let operator = block.getFieldValue('OP');
    let code = [];
    
    for (let i = 0; i < block.itemCount_; i++) {
        let value = Blockly.JavaScript.valueToCode(block, 'ADD' + i,
            Blockly.JavaScript.ORDER_ATOMIC) || 'false';
        code.push(value);
    }
    
    let operation = (operator === 'AND') ? ' && ' : ' || ';
    return ['(' + code.join(operation) + ')', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_negate'] = function(block) {
    let bool = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    return [`!${bool}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_boolean'] = function(block) {
    let code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_null'] = function(block) {
    return ['null', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_operation_container'] = function(block) {
    return null;
};

Blockly.JavaScript['logic_operation_item'] = function(block) {
    return null;
};