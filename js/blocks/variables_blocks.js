'use strict';

// Bloco para criar variável
Blockly.Blocks['create_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Create")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "IS_FINAL")
            .appendField("final")
            .appendField(new Blockly.FieldTextInput("variable", this.validateVariableName_), "VAR_NAME");
        this.appendDummyInput()
            .appendField("type")
            .appendField(new Blockly.FieldDropdown([
                ["byte", "byte"], ["short", "short"], ["int", "int"], ["long", "long"],
                ["float", "float"], ["double", "double"], ["char", "char"], ["boolean", "boolean"],
                ["Byte", "Byte"], ["Short", "Short"], ["Integer", "Integer"], ["Long", "Long"],
                ["Float", "Float"], ["Double", "Double"], ["Character", "Character"],
                ["Boolean", "Boolean"], ["String", "String"], ["ArrayList<String>", "ArrayList<String>"],
                ["HashSet<String>", "HashSet<String>"], ["TreeSet<String>", "TreeSet<String>"],
                ["HashMap<String,String>", "HashMap<String,String>"], ["String[]", "String[]"],
                ["YailList", "YailList"], ["Object", "Object"]
            ]), "VAR_TYPE");
        this.appendDummyInput()
            .appendField("initialize")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "INITIALIZE");
        this.appendValueInput("INITIAL_VALUE")
            .setCheck(null)
            .appendField("value")
            .setVisible(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Creates a new variable.");
    },
    onchange: function(event) {
        const workspace = this.workspace;
        const varName = this.getFieldValue('VAR_NAME');
        const varType = this.getFieldValue('VAR_TYPE');
        const shouldInitialize = this.getFieldValue('INITIALIZE') === 'TRUE';

        // Sincronizar visibilidade do campo de valor inicial
        const valueInput = this.getInput('INITIAL_VALUE');
        if (valueInput) {
            valueInput.setVisible(shouldInitialize);
        }

        // Verifica se a variável já existe e atribui ID
        if (event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === this.id) {
            if (!workspace.getVariable(varName, varType)) {
                workspace.createVariable(varName, varType);
            }
        }
    },
    validateVariableName_: function(name) {
        const reservedNames = [
            "byte", "short", "int", "long", "float", "double", "char", "boolean",
            "Byte", "Short", "Integer", "Long", "Float", "Double", "Character",
            "Boolean", "String", "ArrayList<String>", "HashSet<String>", "TreeSet<String>",
            "HashMap<String,String>", "String[]", "YailList", "Object"
        ];

        const isValid = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
        return isValid && !reservedNames.includes(name) ? name : null;
    }
};

// Bloco para atribuir valor à variável
Blockly.Blocks['set_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Set")
            .appendField(new Blockly.FieldDropdown(this.updateDropdown_.bind(this)), "VAR_NAME")
            .appendField("=");
        this.appendValueInput("VALUE").setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Sets a value to an existing variable.");
    },
    updateDropdown_: function() {
        const workspace = this.workspace;
        if (!workspace) return [["No variables", ""]];
        const variables = workspace.getAllVariables();
        return variables.length
            ? variables.map(variable => [variable.name, variable.name])
            : [["No variables", ""]];
    }
};

// Bloco para obter valor de uma variável
Blockly.Blocks['get_variable'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Get")
            .appendField(new Blockly.FieldDropdown(this.updateDropdown_.bind(this)), "VAR_NAME");
        this.setOutput(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Gets the value of a variable.");
    },
    updateDropdown_: function() {
        const workspace = this.workspace;
        if (!workspace) return [["No variables", ""]];
        const variables = workspace.getAllVariables();
        return variables.length
            ? variables.map(variable => [variable.name, variable.name])
            : [["No variables", ""]];
    }
};

// Geradores de código
Blockly.JavaScript['create_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const varType = block.getFieldValue('VAR_TYPE');
    const isFinal = block.getFieldValue('IS_FINAL') === 'TRUE' ? 'final ' : '';
    const shouldInitialize = block.getFieldValue('INITIALIZE') === 'TRUE';
    let code = `${varType} ${varName}`;

    if (shouldInitialize) {
        const value = Blockly.JavaScript.valueToCode(block, 'INITIAL_VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT);
        code += ` = ${value || '0'}`;
    }
    return `${isFinal}${code};\n`;
};

Blockly.JavaScript['set_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || 'null';
    return `${varName} = ${value};\n`;
};

Blockly.JavaScript['get_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    return [varName, Blockly.JavaScript.ORDER_ATOMIC];
};
