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
    default:
      return null; // Ou outro tipo padrão
  }
};


// Bloco para criar uma lista com qualquer número de itens
Blockly.Blocks['lists_create_with'] = {
  category: 'Lists',
  helpUrl: Blockly.Msg.LANG_LISTS_CREATE_WITH_EMPTY_HELPURL,
  init: function() {
    this.setColour("#00ACC1");
    this.itemCount_ = 0; // Inicia como lista vazia
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'ADD';
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("list", Blockly.Blocks.Utilities.OUTPUT));
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.Msg.LANG_LISTS_CREATE_WITH_TOOLTIP);
    this.addEmptyInput();
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
    var containerBlock = workspace.newBlock('lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.getNextBlock();
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput(this.repeatingInputName + i).connection.connect(connections[i]);
      }
    }
  },
  updateShape_: function() {
    // Remove todos os inputs existentes
    if (this.getInput(this.emptyInputName)) {
      this.removeInput(this.emptyInputName);
    }
    for (var i = 0; this.getInput(this.repeatingInputName + i); i++) {
      this.removeInput(this.repeatingInputName + i);
    }
    // Adiciona inputs conforme o número de itens
    if (this.itemCount_ === 0) {
      this.addEmptyInput();
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        this.addInput(i);
      }
    }
  },
  addEmptyInput: function() {
    this.appendDummyInput(this.emptyInputName)
        .appendField(Blockly.Msg.LANG_LISTS_CREATE_EMPTY_TITLE);
  },
  addInput: function(inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum);
    if (inputNum === 0) {
      input.appendField(Blockly.Msg.LANG_LISTS_CREATE_WITH_TITLE_MAKE_LIST);
    }
    return input;
  },
  typeblock: [
    {
      translatedName: Blockly.Msg.LANG_LISTS_CREATE_WITH_TITLE_MAKE_LIST,
      mutatorAttributes: { items: 2 }
    },
    {
      translatedName: Blockly.Msg.LANG_LISTS_CREATE_EMPTY_TITLE,
      mutatorAttributes: { items: 0 }
    }
  ]
};

// Contêiner para gerenciar itens da lista
Blockly.Blocks['lists_create_with_container'] = {
  init: function() {
    this.appendDummyInput().appendField('List Items');
    this.appendStatementInput('STACK');
    this.setColour("#00ACC1");
    this.setTooltip('Add, remove, or reorder list items.');
  }
};

// Bloco para itens individuais na lista
Blockly.Blocks['lists_create_with_item'] = {
  init: function() {
    this.setColour("#00ACC1");
    this.appendDummyInput().appendField('Item');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Add an item to the list.');
    this.contextMenu = false;
  }
};


// Bloco para adicionar itens a uma lista existente
Blockly.Blocks['lists_add_items'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('Add items to');
    this.appendValueInput('ITEM')
        .appendField('item');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#00ACC1");
    this.setTooltip('Adds items to an existing list.');
  }
};

// Bloco para verificar se uma lista está vazia
Blockly.Blocks['lists_is_empty'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('is list');
    this.appendDummyInput()
        .appendField('empty?');
    this.setOutput(true, 'Boolean');
    this.setColour("#00ACC1");
    this.setTooltip('Checks if the list is empty.');
  }
};

// Bloco para obter o tamanho de uma lista
Blockly.Blocks['lists_length'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('length of');
    this.setOutput(true, 'Number');
    this.setColour("#00ACC1");
    this.setTooltip('Gets the length of a list.');
  }
};

// Bloco para acessar um item da lista por índice
Blockly.Blocks['lists_get_index'] = {
  init: function() {
    this.appendValueInput('LIST')
        .setCheck('Array')
        .appendField('get item from');
    this.appendValueInput('INDEX')
        .setCheck('Number')
        .appendField('at index');
    this.setOutput(true, null);
    this.setColour("#00ACC1");
    this.setTooltip('Gets an item from the list at the specified index.');
  }
};


Blockly.JavaScript['lists_create_with'] = function(block) {
  var elements = [];
  for (var i = 0; i < block.itemCount_; i++) {
    var itemCode = Blockly.JavaScript.valueToCode(block, 'ADD' + i, Blockly.JavaScript.ORDER_COMMA) || 'null';
    elements.push(itemCode);
  }
  var code = '[' + elements.join(', ') + ']';
  return code;
};


Blockly.JavaScript['lists_add_items'] = function(block) {
  var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  var item = Blockly.JavaScript.valueToCode(block, 'ITEM', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
  return list + '.push(' + item + ');\n';
};

Blockly.JavaScript['lists_is_empty'] = function(block) {
  var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  return ['!' + list + '.length', Blockly.JavaScript.ORDER_LOGICAL_NOT];
};

Blockly.JavaScript['lists_length'] = function(block) {
  var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  return [list + '.length', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['lists_get_index'] = function(block) {
  var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ATOMIC) || '[]';
  var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return [list + '[' + index + ']', Blockly.JavaScript.ORDER_ATOMIC];
};
