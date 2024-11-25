'use strict';

Blockly.Blocks.Utilities = Blockly.Blocks.Utilities || {};
Blockly.Blocks.Utilities.YailTypeToBlocklyType = function(yailType, mode) {
  switch (yailType) {
    case "number":
      return "Number";
    case "text":
      return "String";
    case "list":
      return "Array";
    case "boolean":
      return "Boolean";
    case "dictionary":
      return "Object";
    case "pair":
      return "Pair";
    case "key":
      return "Key";
    default:
      return null; // Valor padrão para tipos desconhecidos
  }
};

'use strict';

// Bloco para criar um dicionário com pares
Blockly.Blocks['dictionaries_create_with'] = {
  init: function () {
    this.setColour("#43A047");
    this.itemCount_ = 0; // Inicializa o bloco com uma lista vazia
    this.setMutator(new Blockly.Mutator(['dictionaries_mutator_pair'])); // Define o mutator
    this.setOutput(true, 'dictionary'); // Saída do bloco como "dictionary"
    this.addEmptyInput();
    this.setTooltip('Create a dictionary with key-value pairs.');
  },
  mutationToDom: function () {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  decompose: function (workspace) {
    // Cria o bloco contêiner principal
    var containerBlock = workspace.newBlock('dictionaries_mutator_pair_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;

    // Adiciona blocos de pares para cada item no dicionário
    for (var i = 0; i < this.itemCount_; i++) {
      var pairBlock = workspace.newBlock('dictionaries_mutator_pair');
      pairBlock.initSvg();
      connection.connect(pairBlock.previousConnection);
      connection = pairBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK'); // Bloco inicial conectado ao contêiner
    var connections = [];

    // Recolhe as conexões de saída dos blocos filhos
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }

    // Remove todas as entradas existentes
    for (var i = 0; this.getInput('ADD' + i); i++) {
      this.removeInput('ADD' + i);
    }

    // Adiciona novas entradas com base nas conexões coletadas
    this.itemCount_ = connections.length;
    if (this.itemCount_ === 0) {
      this.addEmptyInput();
    } else {
      this.addInputs(connections);
    }
  },
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
  addEmptyInput: function () {
    if (!this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY').appendField('Create Empty Dictionary');
    }
  },
  addInputs: function (connections) {
    for (var i = 0; i < this.itemCount_; i++) {
      var input = this.appendValueInput('ADD' + i).setCheck('pair');
      if (i === 0) {
        input.appendField('Create Dictionary');
      }
      if (connections[i]) {
        input.connection.connect(connections[i]);
      }
    }
  },
  updateShape_: function () {
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    }
    for (var i = 0; this.getInput('ADD' + i); i++) {
      this.removeInput('ADD' + i);
    }
    if (this.itemCount_ === 0) {
      this.addEmptyInput();
    } else {
      this.addInputs([]);
    }
  },
};

// Bloco para o contêiner do mutator
Blockly.Blocks['dictionaries_mutator_pair_container'] = {
  init: function () {
    this.setColour("#43A047");
    this.appendDummyInput().appendField('Dictionary Items');
    this.appendStatementInput('STACK');
    this.setTooltip('Add, remove, or reorder dictionary pairs.');
  },
};

// Bloco para o mutator de pares
Blockly.Blocks['dictionaries_mutator_pair'] = {
  init: function () {
    this.setColour("#43A047");
    this.appendDummyInput().appendField('Pair');
    this.setPreviousStatement(true); // Permite conexão acima
    this.setNextStatement(true); // Permite conexão abaixo
    this.setTooltip('Defines a key-value pair for the dictionary.');
  },
};

// Bloco para criar um par key-value
//PAIR
const pair = {
  init: function() {
    this.appendValueInput('KEY')
    .setCheck('String')
      .appendField('Add item to');
    this.appendValueInput('VALUE')
      .appendField('item');
    this.setOutput(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour("#43A047");
  }
};
Blockly.common.defineBlocks({pair: pair});
//PAIR

// Bloco para buscar valor por chave
Blockly.Blocks['dictionaries_lookup'] = {
  init: function() {
    this.setColour("#43A047");
    this.appendValueInput('DICT')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("dictionary", Blockly.Blocks.Utilities.INPUT))
      .appendField('Get value from dictionary');
    this.appendValueInput('KEY')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("key", Blockly.Blocks.Utilities.INPUT))
      .appendField('Key');
    this.setOutput(true, null);
    this.setTooltip('Get the value associated with the key in the dictionary.');
  }
};

// Bloco para adicionar ou alterar pares no dicionário
Blockly.Blocks['dictionaries_set_pair'] = {
  init: function() {
    this.setColour("#43A047");
    this.appendValueInput('DICT')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("dictionary", Blockly.Blocks.Utilities.INPUT))
      .appendField('Set value in dictionary');
    this.appendValueInput('KEY')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("key", Blockly.Blocks.Utilities.INPUT))
      .appendField('Key');
    this.appendValueInput('VALUE')
      .setCheck(null)
      .appendField('Value');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Set a key-value pair in the dictionary.');
  }
};

// Bloco para remover um par do dicionário
Blockly.Blocks['dictionaries_delete_pair'] = {
  init: function() {
    this.setColour("#43A047");
    this.appendValueInput('DICT')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("dictionary", Blockly.Blocks.Utilities.INPUT))
      .appendField('Remove from dictionary');
    this.appendValueInput('KEY')
      .setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("key", Blockly.Blocks.Utilities.INPUT))
      .appendField('Key');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Remove a key-value pair from the dictionary.');
  }
};

//Generators

Blockly.JavaScript['dictionaries_create_with'] = function(block) {
  var elements = [];
  for (var i = 0; i < block.itemCount_; i++) {
    // Obtém o código de cada entrada "pair"
    var pairCode = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_COMMA) || '';
    elements.push(pairCode);
  }
  // Combina os pares no formato de objeto JavaScript
  var code = `{${elements.join(', ')}}`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC]; // Retorna o código como uma string
};


// Gerador para criar um par key-value
Blockly.JavaScript['pair'] = function(block) {
  var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
  var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
  // Retorna um par no formato esperado
  var code = `${key}: ${value}`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Gerador para buscar um valor por chave no dicionário
Blockly.JavaScript['dictionaries_lookup'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_MEMBER) || '{}';
  var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_NONE) || '""';
  var code = `${dict}[${key}]`;
  return [`"${code}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

// Gerador para adicionar ou alterar pares em um dicionário
Blockly.JavaScript['dictionaries_set_pair'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_MEMBER) || '{}';
  var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_NONE) || '""';
  var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE) || 'null';
  var code = `${dict}[${key}] = ${value};\n`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Gerador para remover um par de um dicionário
Blockly.JavaScript['dictionaries_delete_pair'] = function(block) {
  var dict = Blockly.JavaScript.valueToCode(block, 'DICT', Blockly.JavaScript.ORDER_MEMBER) || '{}';
  var key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_NONE) || '""';
  var code = `delete ${dict}[${key}];\n`;
  return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};
