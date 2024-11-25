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

// Bloco de verificação de String vazia
Blockly.Blocks['logic_string_empty'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField(new Blockly.FieldDropdown([
                ['is empty', 'EMPTY'],
                ['is not empty', 'NOT_EMPTY']
            ]), 'CHECK');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Verifica se uma String está vazia');
    }
};

// Bloco de verificação de coleção vazia
Blockly.Blocks['logic_collection_empty'] = {
    init: function() {
        this.appendValueInput('COLLECTION')
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([
                ['is empty', 'EMPTY'],
                ['is not empty', 'NOT_EMPTY']
            ]), 'CHECK');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Verifica se uma coleção está vazia');
    }
};

// Bloco de verificação de intervalo (between)
Blockly.Blocks['logic_between'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck('Number')
            .appendField('value');
        this.appendValueInput('MIN')
            .setCheck('Number')
            .appendField('is between');
        this.appendValueInput('MAX')
            .setCheck('Number')
            .appendField('and');
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox('TRUE'), 'INCLUSIVE')
            .appendField('inclusive');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Verifica se um valor está em um intervalo');
    }
};

// Bloco de verificação de tipo (instanceof)
Blockly.Blocks['logic_typeof'] = {
    init: function() {
        this.appendValueInput('OBJECT')
            .setCheck(null)
            .appendField('check if');
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['is String', 'STRING'],
                ['is Number', 'NUMBER'],
                ['is Boolean', 'BOOLEAN'],
                ['is Array', 'ARRAY'],
                ['is Object', 'OBJECT'],
                ['is Null', 'NULL']
            ]), 'TYPE');
        this.setOutput(true, 'Boolean');
        this.setColour("#FDD835");
        this.setTooltip('Verifica o tipo de um valor');
    }
};

// Bloco de verificação condicional (ternário)
Blockly.Blocks['logic_ternary'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('if');
        this.appendValueInput('THEN')
            .setCheck(null)
            .appendField('then');
        this.appendValueInput('ELSE')
            .setCheck(null)
            .appendField('else');
        this.setOutput(true, null);
        this.setColour("#FDD835");
        this.setTooltip('Operador ternário - retorna um valor baseado em uma condição');
    }
};

// Bloco de verificação múltipla (switch-like)
Blockly.Blocks['logic_switch'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('match value');
        this.appendValueInput('CASE1')
            .setCheck(null)
            .appendField('when equals');
        this.appendValueInput('RETURN1')
            .setCheck(null)
            .appendField('return');
        this.appendValueInput('CASE2')
            .setCheck(null)
            .appendField('when equals');
        this.appendValueInput('RETURN2')
            .setCheck(null)
            .appendField('return');
        this.appendValueInput('DEFAULT')
            .setCheck(null)
            .appendField('otherwise return');
        this.setOutput(true, null);
        this.setColour("#FDD835");
        this.setTooltip('Retorna diferentes valores baseado em comparações');
    }
};


// Geradores de código
Blockly.JavaScript['logic_string_empty'] = function(block) {
    const string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const check = block.getFieldValue('CHECK');
    
    if (check === 'EMPTY') {
        return [`${string}.isEmpty()`, Blockly.JavaScript.ORDER_ATOMIC];
    }
    return [`!${string}.isEmpty()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_collection_empty'] = function(block) {
    const collection = Blockly.JavaScript.valueToCode(block, 'COLLECTION', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
    const check = block.getFieldValue('CHECK');
    
    if (check === 'EMPTY') {
        return [`${collection}.isEmpty()`, Blockly.JavaScript.ORDER_ATOMIC];
    }
    return [`!${collection}.isEmpty()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_between'] = function(block) {
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const min = Blockly.JavaScript.valueToCode(block, 'MIN', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const max = Blockly.JavaScript.valueToCode(block, 'MAX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const inclusive = block.getFieldValue('INCLUSIVE') === 'TRUE';
    
    if (inclusive) {
        return [`${value} >= ${min} && ${value} <= ${max}`, Blockly.JavaScript.ORDER_ATOMIC];
    }
    return [`${value} > ${min} && ${value} < ${max}`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_typeof'] = function(block) {
    const object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const type = block.getFieldValue('TYPE');
    
    let check;
    switch (type) {
        case 'STRING':
            check = `${object} instanceof String`;
            break;
        case 'NUMBER':
            check = `${object} instanceof Integer || ${object} instanceof Double`;
            break;
        case 'BOOLEAN':
            check = `${object} instanceof Boolean`;
            break;
        case 'ARRAY':
            check = `${object} instanceof List`;
            break;
        case 'OBJECT':
            check = `${object} instanceof Object`;
            break;
        case 'NULL':
            check = `${object} == null`;
            break;
        default:
            check = 'false';
    }
    return [check, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_ternary'] = function(block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const thenValue = Blockly.JavaScript.valueToCode(block, 'THEN', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const elseValue = Blockly.JavaScript.valueToCode(block, 'ELSE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    
    return [`(${condition} ? ${thenValue} : ${elseValue})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_switch'] = function(block) {
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const case1 = Blockly.JavaScript.valueToCode(block, 'CASE1', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const return1 = Blockly.JavaScript.valueToCode(block, 'RETURN1', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const case2 = Blockly.JavaScript.valueToCode(block, 'CASE2', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const return2 = Blockly.JavaScript.valueToCode(block, 'RETURN2', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    const defaultReturn = Blockly.JavaScript.valueToCode(block, 'DEFAULT', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    
    return [
        `(${value}.equals(${case1}) ? ${return1} : ` +
        `${value}.equals(${case2}) ? ${return2} : ${defaultReturn})`,
        Blockly.JavaScript.ORDER_ATOMIC
    ];
};

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