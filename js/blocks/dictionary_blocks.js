// Criar HashMap
Blockly.Blocks['dict_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('novo HashMap<')
            .appendField(new Blockly.FieldDropdown([
                ['String', 'String'],
                ['Integer', 'Integer'],
                ['Boolean', 'Boolean'],
                ['Object', 'Object']
            ]), 'KEY_TYPE')
            .appendField(',')
            .appendField(new Blockly.FieldDropdown([
                ['String', 'String'],
                ['Integer', 'Integer'],
                ['Boolean', 'Boolean'],
                ['Object', 'Object']
            ]), 'VALUE_TYPE')
            .appendField('>');
        this.setOutput(true, 'HashMap');
        this.setColour("#43A047");
        this.setTooltip('Cria um novo HashMap');
    }
};

// Obter valor
Blockly.Blocks['dict_get'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('obter valor');
        this.appendValueInput('KEY')
            .setCheck(null)
            .appendField('com chave');
        this.setOutput(true, null);
        this.setColour("#43A047");
        this.setTooltip('Obtém um valor do HashMap');
    }
};

// Definir valor
Blockly.Blocks['dict_set'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('definir em');
        this.appendValueInput('KEY')
            .setCheck(null)
            .appendField('chave');
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('valor');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#43A047");
        this.setTooltip('Define um valor no HashMap');
    }
};

// Remover valor
Blockly.Blocks['dict_remove'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('remover de');
        this.appendValueInput('KEY')
            .setCheck(null)
            .appendField('chave');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#43A047");
        this.setTooltip('Remove um valor do HashMap');
    }
};

// Verificar chave
Blockly.Blocks['dict_containsKey'] = {
    init: function() {
        this.appendValueInput('DICT')
            .setCheck('HashMap')
            .appendField('contém chave');
        this.appendValueInput('KEY')
            .setCheck(null);
        this.setOutput(true, 'Boolean');
        this.setColour("#43A047");
        this.setTooltip('Verifica se o HashMap contém uma chave');
    }
};

// Geradores de código para dicionários
Blockly.JavaScript['dict_create'] = function(block) {
    var keyType = block.getFieldValue('KEY_TYPE');
    var valueType = block.getFieldValue('VALUE_TYPE');
    return [`new HashMap<${keyType}, ${valueType}>()`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_get'] = function(block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${dict}.get(${key})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['dict_set'] = function(block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `${dict}.put(${key}, ${value});\n`;
};

Blockly.JavaScript['dict_remove'] = function(block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return `${dict}.remove(${key});\n`;
};

Blockly.JavaScript['dict_containsKey'] = function(block) {
    var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_ATOMIC) || 'map';
    var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    return [`${dict}.containsKey(${key})`, Blockly.JavaScript.ORDER_ATOMIC];
};
