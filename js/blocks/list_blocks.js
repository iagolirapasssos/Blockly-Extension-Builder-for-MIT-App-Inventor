// Criar Lista
Blockly.Blocks['lists_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('nova ArrayList<')
            .appendField(new Blockly.FieldDropdown([
                ['String', 'String'],
                ['Integer', 'Integer'],
                ['Boolean', 'Boolean'],
                ['Double', 'Double']
            ]), 'TYPE')
            .appendField('>');
        this.setOutput(true, 'ArrayList');
        this.setColour("#00ACC1");
        this.setTooltip('Cria uma nova ArrayList');
    }
};

// Operações com Lista
Blockly.Blocks['lists_operation'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField(new Blockly.FieldDropdown([
                ['adicionar', 'ADD'],
                ['remover', 'REMOVE'],
                ['obter', 'GET'],
                ['tamanho', 'SIZE'],
                ['limpar', 'CLEAR']
            ]), 'OP');
        this.appendValueInput('ITEM')
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Operações com ArrayList');
    }
};

// Geradores de código para listas
Blockly.JavaScript['lists_create'] = function(block) {
    var type = block.getFieldValue('TYPE');
    return [`new ArrayList<${type}>()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['lists_operation'] = function(block) {
    var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    var item = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var op = block.getFieldValue('OP');
    
    switch(op) {
        case 'ADD': return `${list}.add(${item});\n`;
        case 'REMOVE': return `${list}.remove(${item});\n`;
        case 'GET': return `${list}.get(${item});\n`;
        case 'SIZE': return `${list}.size();\n`;
        case 'CLEAR': return `${list}.clear();\n`;
    }
    return '';
};

// Blocos para Listas
Blockly.Blocks['lists_get_index'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('obter item da lista');
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('índice');
        this.setOutput(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Obtém um item da lista pelo índice');
    }
};

Blockly.Blocks['lists_set_index'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('definir item da lista');
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('índice');
        this.appendValueInput('ITEM')
            .appendField('valor');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Define um item na lista pelo índice');
    }
};

Blockly.Blocks['lists_forEach'] = {
    init: function() {
        this.appendValueInput('LIST')
            .setCheck('ArrayList')
            .appendField('para cada item');
        this.appendDummyInput()
            .appendField('como')
            .appendField(new Blockly.FieldTextInput('item'), 'VAR');
        this.appendStatementInput('DO')
            .appendField('fazer');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00ACC1");
        this.setTooltip('Executa ações para cada item da lista');
    }
};

// Blocos para Matemática
Blockly.Blocks['math_number'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), 'NUM');
        this.setOutput(true, 'Number');
        this.setColour(230);
        this.setTooltip('Um número');
    }
};

Blockly.Blocks['math_constant'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['π', 'Math.PI'],
                ['e', 'Math.E'],
                ['φ', '1.618034'],
                ['√2', 'Math.SQRT2'],
                ['√½', 'Math.SQRT1_2']
            ]), 'CONSTANT');
        this.setOutput(true, 'Number');
        this.setColour(230);
        this.setTooltip('Constantes matemáticas');
    }
};

// Blocos para Texto
Blockly.Blocks['text_charAt'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('caractere da string');
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('na posição');
        this.setOutput(true, 'String');
        this.setColour(160);
        this.setTooltip('Retorna o caractere na posição especificada');
    }
};

Blockly.Blocks['text_indexOf'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('posição em');
        this.appendValueInput('FIND')
            .setCheck('String')
            .appendField('encontrar');
        this.setOutput(true, 'Number');
        this.setColour(160);
        this.setTooltip('Retorna a posição de uma string dentro de outra');
    }
};

// Blocos para Lógica
Blockly.Blocks['logic_boolean'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['verdadeiro', 'true'],
                ['falso', 'false']
            ]), 'BOOL');
        this.setOutput(true, 'Boolean');
        this.setColour(290);
        this.setTooltip('Valor booleano verdadeiro ou falso');
    }
};

Blockly.Blocks['logic_null'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('null');
        this.setOutput(true, null);
        this.setColour(290);
        this.setTooltip('Valor nulo');
    }
};

// Geradores de código para os blocos
Blockly.JavaScript['lists_get_index'] = function(block) {
    var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`${list}.get(${index})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['lists_set_index'] = function(block) {
    var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var item = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return `${list}.set(${index}, ${item});\n`;
};

Blockly.JavaScript['lists_forEach'] = function(block) {
    var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || 'list';
    var varName = block.getFieldValue('VAR');
    var branch = Blockly.JavaScript.statementToCode(block, 'DO') || '';
    return `for (${varName} : ${list}) {\n${branch}}\n`;
};

Blockly.JavaScript['math_number'] = function(block) {
    var number = block.getFieldValue('NUM');
    return [number, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['math_constant'] = function(block) {
    var constant = block.getFieldValue('CONSTANT');
    return [constant, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_charAt'] = function(block) {
    var string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return [`${string}.charAt(${index})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['text_indexOf'] = function(block) {
    var string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var find = Blockly.JavaScript.valueToCode(block, 'FIND', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${string}.indexOf(${find})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_boolean'] = function(block) {
    var bool = block.getFieldValue('BOOL');
    return [bool, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['logic_null'] = function(block) {
    return ['null', Blockly.JavaScript.ORDER_ATOMIC];
};