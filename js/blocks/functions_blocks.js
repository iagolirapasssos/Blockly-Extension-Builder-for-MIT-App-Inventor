'use strict';

// Define a procedure without return
Blockly.Blocks['procedures_defnoreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('procedure')
            .appendField(new Blockly.FieldTextInput('name'), 'NAME');
        this.appendStatementInput('STACK')
            .appendField('do');
        this.setColour('#827717');
        this.setTooltip('Defines a procedure without a return value');
        this.setHelpUrl('');
    }
};

// Define a function with return
Blockly.Blocks['procedures_defreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('function')
            .appendField(new Blockly.FieldTextInput('name'), 'NAME');
        this.appendStatementInput('STACK')
            .appendField('do');
        this.appendValueInput('RETURN')
            .appendField('return');
        this.setColour('#827717');
        this.setTooltip('Defines a function with a return value');
        this.setHelpUrl('');
    }
};

// Call procedure without return
Blockly.Blocks['procedures_callnoreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('call')
            .appendField(new Blockly.FieldTextInput('procedure'), 'NAME');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#827717');
        this.setTooltip('Calls a procedure without a return value');
    }
};

// Call function with return
Blockly.Blocks['procedures_callreturn'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('call function')
            .appendField(new Blockly.FieldTextInput('function'), 'NAME');
        this.setOutput(true, null);
        this.setColour('#827717');
        this.setTooltip('Calls a function and retrieves the return value');
    }
};

// Simple return block
Blockly.Blocks['function_return'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck(null)
            .appendField('return');
        this.setPreviousStatement(true, null);
        this.setNextStatement(false, null);
        this.setColour('#827717');
        this.setTooltip('Returns a value from the function');
    }
};

// Define a function with parameters
Blockly.Blocks['function_with_parameters'] = {
    init: function() {
        this.appendDummyInput("HEADER")
            .appendField("function")
            .appendField(new Blockly.FieldTextInput("myFunction"), "FUNCTION_NAME")
            .appendField("return type")
            .appendField(new Blockly.FieldDropdown([
                ["void", "void"],
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"],
                ["Object", "Object"]
            ]), "RETURN_TYPE");
        this.appendStatementInput("STACK")
            .appendField("do");
        this.setMutator(new Blockly.Mutator(['function_parameter']));
        this.paramCount_ = 0;
        this.paramNames_ = [];
        this.setColour('#827717');
        this.setTooltip("Defines a function with editable and 'final' parameters.");
    },

    mutationToDom: function() {
        const container = document.createElement('mutation');
        container.setAttribute('params', this.paramCount_);
        this.paramNames_.forEach(param => {
            const paramNode = document.createElement('param');
            paramNode.setAttribute('name', param.name);
            paramNode.setAttribute('type', param.type);
            paramNode.setAttribute('final', param.final ? 'true' : 'false');
            container.appendChild(paramNode);
        });
        return container;
    },

    domToMutation: function(xmlElement) {
        this.paramCount_ = parseInt(xmlElement.getAttribute('params'), 10);
        this.paramNames_ = [];
        Array.from(xmlElement.children).forEach(param => {
            this.paramNames_.push({
                name: param.getAttribute('name'),
                type: param.getAttribute('type'),
                final: param.getAttribute('final') === 'true'
            });
        });
        this.updateShape_();
    },

    decompose: function(workspace) {
        const containerBlock = workspace.newBlock('function_mutator');
        containerBlock.initSvg();
        let connection = containerBlock.getInput('STACK').connection;

        this.paramNames_.forEach(param => {
            const paramBlock = workspace.newBlock('function_parameter');
            paramBlock.setFieldValue(param.name, 'PARAM_NAME');
            paramBlock.setFieldValue(param.type, 'PARAM_TYPE');
            paramBlock.setFieldValue(param.final ? 'TRUE' : 'FALSE', 'FINAL');
            paramBlock.initSvg();
            connection.connect(paramBlock.previousConnection);
            connection = paramBlock.nextConnection;
        });

        return containerBlock;
    },

    compose: function(containerBlock) {
        let paramBlock = containerBlock.getInputTargetBlock('STACK');
        const newParamNames = [];

        while (paramBlock) {
            const paramName = paramBlock.getFieldValue('PARAM_NAME');
            const paramType = paramBlock.getFieldValue('PARAM_TYPE');
            const isFinal = paramBlock.getFieldValue('FINAL') === 'TRUE';

            newParamNames.push({
                name: paramName,
                type: paramType,
                final: isFinal
            });

            paramBlock = paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();
        }

        this.paramCount_ = newParamNames.length;
        this.paramNames_ = newParamNames;

        this.updateShape_();

        // Update Blockly variable list
        const workspace = this.workspace;
        const variableNames = newParamNames.map(param => param.name);
        workspace.getAllVariables().forEach(variable => {
            if (!variableNames.includes(variable.name)) {
                workspace.deleteVariableById(variable.getId());
            }
        });
        variableNames.forEach(name => {
            if (!workspace.getVariable(name)) {
                workspace.createVariable(name);
            }
        });
    },

    updateShape_: function() {
        // Remove old parameter display
        if (this.getField("PARAMS")) {
            this.getInput("HEADER").removeField("PARAMS");
        }

        // Add new parameter display
        if (this.paramCount_ > 0) {
            const paramDisplay = this.paramNames_
                .map(param => `${param.final ? 'final ' : ''}${param.type} ${param.name}`)
                .join(', ');
            this.getInput("HEADER")
                .appendField("(" + paramDisplay + ")", "PARAMS");
        } else {
            this.getInput("HEADER")
                .appendField("()", "PARAMS");
        }
    }
};

Blockly.Blocks['function_mutator'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Parameters");
        this.appendStatementInput("STACK")
            .setCheck("Parameter");
        this.setColour('#827717');
        this.setTooltip("Add or remove parameters for the function.");
        this.contextMenu = false;
    }
};

Blockly.Blocks['function_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("parameter")
            .appendField(new Blockly.FieldTextInput("param1"), "PARAM_NAME")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"],
                ["Object", "Object"]
            ]), "PARAM_TYPE")
            .appendField("final")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "FINAL");
        this.setPreviousStatement(true, "Parameter");
        this.setNextStatement(true, "Parameter");
        this.setColour('#827717');
        this.setTooltip("Defines a parameter for the function.");
    }
};


Blockly.JavaScript['function_with_parameters'] = function(block) {
    const functionName = block.getFieldValue('FUNCTION_NAME');
    const returnType = block.getFieldValue('RETURN_TYPE');
    const paramList = block.paramNames_
        .map(param => `${param.final ? 'final ' : ''}${param.type} ${param.name}`)
        .join(', ');
    const statements = Blockly.JavaScript.statementToCode(block, 'STACK');
    return `public ${returnType} ${functionName}(${paramList}) {\n${statements}}\n`;
};

Blockly.JavaScript['function_parameter'] = function(block) {
    const paramName = block.getFieldValue('PARAM_NAME');
    const paramType = block.getFieldValue('PARAM_TYPE');
    const isFinal = block.getFieldValue('FINAL') === "TRUE";
    return `${isFinal ? 'final ' : ''}${paramType} ${paramName}`;
};

// JavaScript Generators
Blockly.JavaScript['procedures_defnoreturn'] = function(block) {
    const name = block.getFieldValue('NAME');
    const statements = Blockly.JavaScript.statementToCode(block, 'STACK');
    return `public void ${name}() {\n${statements}}\n`;
};

Blockly.JavaScript['procedures_defreturn'] = function(block) {
    const name = block.getFieldValue('NAME');
    const statements = Blockly.JavaScript.statementToCode(block, 'STACK');
    const returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_ATOMIC);
    return `public Object ${name}() {\n${statements}    return ${returnValue};\n}\n`;
};

Blockly.JavaScript['procedures_callnoreturn'] = function(block) {
    const name = block.getFieldValue('NAME');
    return `${name}();\n`;
};

Blockly.JavaScript['procedures_callreturn'] = function(block) {
    const name = block.getFieldValue('NAME');
    return [`${name}()`, Blockly.JavaScript.ORDER_ATOMIC];
};

