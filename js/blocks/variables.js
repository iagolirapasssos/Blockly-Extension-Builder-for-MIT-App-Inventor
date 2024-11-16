//blocks/variables.js
'use strict';

Blockly.Blocks['create_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Create Variable")
            .appendField(new Blockly.FieldTextInput("varName", this.validateAndRenameVariable.bind(this)), "VAR_NAME")
            .appendField("type")
            .appendField(new Blockly.FieldDropdown([
                ["int", "int"],
                ["String", "String"],
                ["boolean", "boolean"],
                ["double", "double"],
                ["Object", "Object"],
                ["List<String>", "List<String>"],
                ["List<Integer>", "List<Integer>"]
            ]), "VAR_TYPE")
            .appendField("final")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "IS_FINAL");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Creates a new variable.");
        this.setHelpUrl("");
    },

    validateAndRenameVariable: function (newName) {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) return newName;

        const currentName = this.getFieldValue('VAR_NAME');
        const varType = this.getFieldValue('VAR_TYPE');

        // Se o nome não mudou, não faça nada
        if (currentName === newName) {
            return newName;
        }

        const existingVariable = workspace.getVariable(currentName, varType);

        // Se a variável atual não existir, crie uma nova
        if (!existingVariable) {
            console.warn(`Variable "${currentName}" does not exist. Creating a new one.`);
            workspace.createVariable(newName, varType);
            this.updateAllReferences(newName); // Atualiza referências no workspace
            return newName;
        }

        // Verifica se já existe uma variável com o novo nome
        const conflictingVariable = workspace.getVariable(newName, varType);
        if (conflictingVariable) {
            console.warn(`Variable "${newName}" already exists. Cannot rename.`);
            return currentName; // Reverte para o nome anterior
        }

        // Renomeia a variável no workspace
        workspace.renameVariableById(existingVariable.getId(), newName);
        this.updateAllReferences(newName); // Atualiza referências no workspace

        return newName;
    },
    updateAllReferences: function (variableId, newName) {
        const workspace = Blockly.getMainWorkspace();

        // Atualiza todos os blocos que utilizam a variável pelo ID
        workspace.getAllBlocks().forEach(block => {
            if (block.type === 'set_variable' || block.type === 'get_variable') {
                const variableField = block.getField('VAR_NAME');
                if (variableField && variableField.getValue() === variableId) {
                    variableField.setValue(variableId); // Atualiza o ID
                }
                if (typeof block.updateVariableDropdown === 'function') {
                    block.updateVariableDropdown(); // Atualiza os dropdowns
                }
            }
        });
    },
    onchange: function (event) {
        if (event.type === Blockly.Events.BLOCK_CREATE || Blockly.Events.BLOCK_CHANGE) {
            const workspace = Blockly.getMainWorkspace();
            const varName = this.getFieldValue('VAR_NAME');
            const varType = this.getFieldValue('VAR_TYPE');

            // Verifica se a variável já existe
            const existingVariable = workspace.getVariable(varName, varType);

            if (!existingVariable) {
                // Cria a variável apenas se não existir
                workspace.createVariable(varName, varType);
            }
        }
    },
};


Blockly.JavaScript['create_variable'] = function(block) {
    const varName = block.getFieldValue('VAR_NAME');
    const varType = block.getFieldValue('VAR_TYPE');
    const isFinal = block.getFieldValue('IS_FINAL') === 'TRUE' ? 'final ' : '';
    return `${isFinal}${varType} ${varName};\n`;
};

// Atribuição de valor
Blockly.Blocks['set_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Set Variable")
            .appendField(new Blockly.FieldDropdown(this.getVariableOptions.bind(this)), "VAR_NAME")
            .appendField("=");
        this.appendValueInput("VALUE")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Sets a value to an existing variable.");
        this.setHelpUrl("");
    },

    getVariableOptions: function () {
        const workspace = Blockly.getMainWorkspace();
        const variables = workspace.getAllVariables();
        return variables.length > 0
            ? variables.map(v => [v.name, v.getId()]) // Nome e ID da variável
            : [["No Variables", ""]];
    },

    updateVariableDropdown: function () {
        const variableField = this.getField("VAR_NAME");
        const currentValue = variableField.getValue(); // Obtém o ID atual selecionado
        const options = this.getVariableOptions(); // Obtém as opções atualizadas

        // Atualiza as opções do dropdown
        variableField.menuGenerator_ = options;

        // Verifica se o valor atual ainda é válido
        const isValidOption = options.some(([, id]) => id === currentValue);

        if (!isValidOption && options.length > 0) {
            // Define o valor para a primeira variável disponível
            variableField.setValue(options[0][1]);
        } else if (isValidOption) {
            // Mantém o valor atual selecionado
            variableField.setValue(currentValue);
        }
    },
};

Blockly.JavaScript['set_variable'] = function (block) {
    const varId = block.getFieldValue('VAR_NAME');
    const workspace = Blockly.getMainWorkspace();
    const variable = workspace.getVariableById(varId);
    const varName = variable ? variable.name : "unknown";
    const value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC) || 'null';
    return `${varName} = ${value};\n`;
};

// Obter valor de variável
Blockly.Blocks['get_variable'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get Variable")
            .appendField(new Blockly.FieldDropdown(this.getVariableOptions.bind(this)), "VAR_NAME");
        this.setOutput(true, null);
        this.setColour("#546E7A");
        this.setTooltip("Gets the value of a variable.");
        this.setHelpUrl("");
    },

    getVariableOptions: function () {
        const workspace = Blockly.getMainWorkspace();
        const variables = workspace.getAllVariables();
        return variables.length > 0
            ? variables.map(v => [v.name, v.getId()]) // Nome e ID da variável
            : [["No Variables", ""]];
    },

    updateVariableDropdown: function () {
        const variableField = this.getField("VAR_NAME");
        const currentValue = variableField.getValue(); // Obtém o ID atual selecionado
        const options = this.getVariableOptions(); // Obtém as opções atualizadas

        // Atualiza as opções do dropdown
        variableField.menuGenerator_ = options;

        // Verifica se o valor atual ainda é válido
        const isValidOption = options.some(([, id]) => id === currentValue);

        if (!isValidOption && options.length > 0) {
            // Define o valor para a primeira variável disponível
            variableField.setValue(options[0][1]);
        } else if (isValidOption) {
            // Mantém o valor atual selecionado
            variableField.setValue(currentValue);
        }
    },

};


Blockly.JavaScript['get_variable'] = function (block) {
    const varId = block.getFieldValue('VAR_NAME');
    const workspace = Blockly.getMainWorkspace();
    const variable = workspace.getVariableById(varId);
    const varName = variable ? variable.name : "unknown";
    return [`${varName}`, Blockly.JavaScript.ORDER_ATOMIC];
};
