//blocks/methods.js
'use strict';

//blocks
// Function return block for methods
Blockly.Blocks['method_return'] = {
    init: function() {
        this.appendValueInput('RETURN_VALUE')
            .setCheck(null)
            .appendField('return');
        this.setPreviousStatement(true, null);
        this.setNextStatement(false, null); // Does not allow following block
        this.setColour("#7CB342"); // Same color as methods
        this.setTooltip('Returns a value from the method');
    }
};

Blockly.Blocks['method_mutator'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Parameters");
        this.appendStatementInput("STACK")
            .setCheck("Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Add or remove parameters.");
        this.contextMenu = false;
    }
};

Blockly.Blocks['parameter'] = {
    init: function() {
        this.setColour("#7CB342");
        this.appendDummyInput()
            .appendField('parameter');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    }
};

// Updated method block with content field
Blockly.Blocks['method_declaration'] = {
    init: function() {
        this.appendDummyInput("HEADER")
            .appendField(new Blockly.FieldTextInput("myMethod"), "METHOD_NAME")
            .appendField("return")
            .appendField(new Blockly.FieldDropdown([
                ["void", "void"],
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"]
            ]), "RETURN_TYPE");
        this.appendDummyInput("DESCRIPTION")
            .appendField("description")
            .appendField(new Blockly.FieldTextInput("A custom method"), "DESCRIPTION");
        this.appendStatementInput("METHOD_CONTENT")
            .setCheck(null)
            .appendField("content");
        this.setMutator(new Blockly.Mutator(['method_parameter']));
        this.paramCount_ = 0;
        this.paramNames_ = [];
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#7CB342");
        this.setTooltip("Declares a method with customizable parameters.");
    },

    mutationToDom: function() {
        const container = document.createElement('mutation');
        container.setAttribute('params', this.paramCount_);
        this.paramNames_.forEach(param => {
            const paramNode = document.createElement('param');
            paramNode.setAttribute('name', param.name);
            paramNode.setAttribute('type', param.type);
            paramNode.setAttribute('final', param.final);
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

    updateShape_: function() {
        if (this.getField("PARAMS")) {
            this.getInput("HEADER").removeField("PARAMS");
        }

        if (this.paramCount_ > 0) {
            const paramDisplay = this.paramNames_
                .map(param => (param.final ? 'final ' : '') + `${param.type} ${param.name}`)
                .join(', ');
            this.getInput("HEADER")
                .appendField("(" + paramDisplay + ")", "PARAMS");
        } else {
            this.getInput("HEADER")
                .appendField("()", "PARAMS");
        }
    }
};


Blockly.Blocks['method_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("param1"), "PARAM_NAME")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"]
            ]), "PARAM_TYPE")
            .appendField("final")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "FINAL");
        this.setPreviousStatement(true, "Parameter");
        this.setNextStatement(true, "Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Defines a parameter for a method.");
    }
};

//Events
Blockly.Blocks['event_declaration'] = {
    init: function() {
        this.appendDummyInput("HEADER")
            .appendField(new Blockly.FieldTextInput("MyEvent"), "EVENT_NAME")
            .appendField("parameters");
        this.appendDummyInput("DESCRIPTION")
            .appendField("description")
            .appendField(new Blockly.FieldTextInput("A custom event"), "DESCRIPTION");
        this.appendStatementInput("EVENT_CONTENT")
            .setCheck(null)
            .appendField("content");
        this.setMutator(new Blockly.Mutator(['event_parameter']));
        this.paramCount_ = 0;
        this.paramNames_ = [];
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#7CB342");
        this.setTooltip("Declares an event with customizable parameters.");
    },

    mutationToDom: function() {
        const container = document.createElement('mutation');
        container.setAttribute('params', this.paramCount_);
        this.paramNames_.forEach(param => {
            const paramNode = document.createElement('param');
            paramNode.setAttribute('name', param.name);
            paramNode.setAttribute('type', param.type);
            paramNode.setAttribute('final', param.final);
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

    updateShape_: function() {
        if (this.getField("PARAMS")) {
            this.getInput("HEADER").removeField("PARAMS");
        }

        if (this.paramCount_ > 0) {
            const paramDisplay = this.paramNames_
                .map(param => (param.final ? 'final ' : '') + `${param.type} ${param.name}`)
                .join(', ');
            this.getInput("HEADER")
                .appendField("(" + paramDisplay + ")", "PARAMS");
        } else {
            this.getInput("HEADER")
                .appendField("()", "PARAMS");
        }
    }
};


Blockly.Blocks['event_mutator'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Parameters");
        this.appendStatementInput("STACK")
            .setCheck("Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Add or remove event parameters.");
        this.contextMenu = false;
    }
};

Blockly.Blocks['event_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("param1"), "PARAM_NAME")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"]
            ]), "PARAM_TYPE")
            .appendField("final")
            .appendField(new Blockly.FieldCheckbox("TRUE"), "FINAL");
        this.setPreviousStatement(true, "Parameter");
        this.setNextStatement(true, "Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Defines a parameter for an event.");
    }
};


Blockly.Blocks['custom_dispatcher'] = {
    init: function() {
        this.appendDummyInput("HEADER")
            .appendField(new Blockly.FieldTextInput("Dispatcher"), "EVENT_NAME")
            .appendField("parameters");
        this.appendDummyInput("PARAMETERS")
            .appendField("content");
        this.setMutator(new Blockly.Mutator(['custom_dispatcher_parameter']));
        this.paramCount_ = 0;
        this.paramNames_ = [];
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#7CB342");
        this.setTooltip("Custom Event Dispatcher with dynamic parameters.");
    },
    
    mutationToDom: function() {
        const container = document.createElement('mutation');
        container.setAttribute('params', this.paramCount_);
        this.paramNames_.forEach(param => {
            const paramNode = document.createElement('param');
            paramNode.setAttribute('name', param.name);
            paramNode.setAttribute('type', param.type);
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
                type: param.getAttribute('type')
            });
        });
        this.updateShape_();
    },

    decompose: function(workspace) {
        const containerBlock = workspace.newBlock('custom_dispatcher_mutator');
        containerBlock.initSvg();
        const connection = containerBlock.getInput('STACK').connection;

        this.paramNames_.forEach(param => {
            const paramBlock = workspace.newBlock('custom_dispatcher_parameter');
            paramBlock.setFieldValue(param.name, 'PARAM_NAME');
            paramBlock.setFieldValue(param.type, 'PARAM_TYPE');
            paramBlock.initSvg();
            connection.connect(paramBlock.previousConnection);
            connection = paramBlock.nextConnection;
        });

        return containerBlock;
    },

    compose: function(containerBlock) {
        let paramBlock = containerBlock.getInputTargetBlock('STACK');
        this.paramCount_ = 0;
        this.paramNames_ = [];

        while (paramBlock) {
            const paramName = paramBlock.getFieldValue('PARAM_NAME');
            const paramType = paramBlock.getFieldValue('PARAM_TYPE');

            this.paramCount_++;
            this.paramNames_.push({
                name: paramName,
                type: paramType
            });
            paramBlock = paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();
        }

        this.updateShape_();
    },

    updateShape_: function() {
        // Remove the old parameter display
        if (this.getField("PARAMS")) {
            this.getInput("HEADER").removeField("PARAMS");
        }

        // Add the new parameter display
        if (this.paramCount_ > 0) {
            const paramDisplay = this.paramNames_
                .map(param => `${param.type} ${param.name}`)
                .join(', ');
            this.getInput("HEADER")
                .appendField("(" + paramDisplay + ")", "PARAMS");
        } else {
            this.getInput("HEADER")
                .appendField("()", "PARAMS");
        }
    }
};


Blockly.Blocks['custom_dispatcher_mutator'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Parameters");
        this.appendStatementInput("STACK")
            .setCheck("Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Add or remove parameters for the custom dispatcher.");
        this.contextMenu = false;
    }
};

Blockly.Blocks['custom_dispatcher_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("param1"), "PARAM_NAME")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"]
            ]), "PARAM_TYPE");
        this.setPreviousStatement(true, "Parameter");
        this.setNextStatement(true, "Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Defines a parameter for the custom dispatcher.");
    }
};

Blockly.Blocks['method_call'] = {
    init: function() {
        this.appendDummyInput("HEADER")
            .appendField("call method")
            .appendField(new Blockly.FieldTextInput("Method Name"), "METHOD_NAME");
        this.setMutator(new Blockly.Mutator(['custom_dispatcher_parameter']));
        this.paramCount_ = 0;
        this.paramNames_ = [];
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#7CB342");
        this.setTooltip("Call a method with dynamic parameters.");
    },
    
    mutationToDom: function() {
        const container = document.createElement('mutation');
        container.setAttribute('params', this.paramCount_);
        this.paramNames_.forEach(param => {
            const paramNode = document.createElement('param');
            paramNode.setAttribute('name', param.name);
            paramNode.setAttribute('type', param.type);
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
                type: param.getAttribute('type')
            });
        });
        this.updateShape_();
    },

    decompose: function(workspace) {
        const containerBlock = workspace.newBlock('call_event_mutator');
        containerBlock.initSvg();
        const connection = containerBlock.getInput('STACK').connection;

        this.paramNames_.forEach(param => {
            const paramBlock = workspace.newBlock('call_event_parameter');
            paramBlock.setFieldValue(param.name, 'PARAM_NAME');
            paramBlock.setFieldValue(param.type, 'PARAM_TYPE');
            paramBlock.initSvg();
            connection.connect(paramBlock.previousConnection);
            connection = paramBlock.nextConnection;
        });

        return containerBlock;
    },

    compose: function(containerBlock) {
        let paramBlock = containerBlock.getInputTargetBlock('STACK');
        this.paramCount_ = 0;
        this.paramNames_ = [];

        while (paramBlock) {
            const paramName = paramBlock.getFieldValue('PARAM_NAME');
            const paramType = paramBlock.getFieldValue('PARAM_TYPE');

            this.paramCount_++;
            this.paramNames_.push({
                name: paramName,
                type: paramType
            });
            paramBlock = paramBlock.nextConnection && paramBlock.nextConnection.targetBlock();
        }

        this.updateShape_();
    },

    updateShape_: function() {
        // Remove the old parameter display
        if (this.getField("PARAMS")) {
            this.getInput("HEADER").removeField("PARAMS");
        }

        // Add the new parameter display
        if (this.paramCount_ > 0) {
            const paramDisplay = this.paramNames_
                .map(param => `${param.type} ${param.name}`)
                .join(', ');
            this.getInput("HEADER")
                .appendField("(" + paramDisplay + ")", "PARAMS");
        } else {
            this.getInput("HEADER")
                .appendField("()", "PARAMS");
        }
    }
};



Blockly.Blocks['call_event_mutator'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Parameters");
        this.appendStatementInput("STACK")
            .setCheck("Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Add or remove parameters for the custom dispatcher.");
        this.contextMenu = false;
    }
};

Blockly.Blocks['call_event_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("param1"), "PARAM_NAME")
            .appendField(":")
            .appendField(new Blockly.FieldDropdown([
                ["String", "String"],
                ["int", "int"],
                ["double", "double"],
                ["boolean", "boolean"]
            ]), "PARAM_TYPE");
        this.setPreviousStatement(true, "Parameter");
        this.setNextStatement(true, "Parameter");
        this.setColour("#7CB342");
        this.setTooltip("Defines a parameter for the custom dispatcher.");
    }
};



//generators

Blockly.JavaScript['method_call'] = function(block) {
    const eventName = block.getFieldValue('METHOD_NAME');
    const content = Blockly.JavaScript.statementToCode(block, 'EVENT_CONTENT');

    // Coleta os parâmetros diretamente do `paramNames_`
    const parameters = block.paramNames_ || [];

    // Junta os parâmetros no formato "tipo nome" para o cabeçalho
    const paramString = parameters.map(param => `${param.type} ${param.name}`).join(', ');

    // Apenas os nomes dos parâmetros para usar no `EventDispatcher.dispatchEvent`
    const paramNames = parameters.map(param => param.name).join(', ');

    // Gera o evento com os parâmetros no cabeçalho e no dispatcher
    return `${eventName}"(${paramNames});\n`;
};



Blockly.JavaScript['event_declaration'] = function(block) {
    const eventName = block.getFieldValue('EVENT_NAME');
    const description = block.getFieldValue('DESCRIPTION');
    const content = Blockly.JavaScript.statementToCode(block, 'EVENT_CONTENT');

    const parameters = block.paramNames_ || [];
    const paramString = parameters.map(param => (param.final ? 'final ' : '') + `${param.type} ${param.name}`).join(', ');

    return `    @SimpleEvent(description = "${description}")
    public void ${eventName}(${paramString}) {
${content}
    }\n`;
};


Blockly.JavaScript['custom_dispatcher'] = function(block) {
    const eventName = block.getFieldValue('EVENT_NAME');
    const content = Blockly.JavaScript.statementToCode(block, 'EVENT_CONTENT');

    // Coleta os parâmetros diretamente do `paramNames_`
    const parameters = block.paramNames_ || [];

    // Junta os parâmetros no formato "tipo nome" para o cabeçalho
    const paramString = parameters.map(param => `${param.type} ${param.name}`).join(', ');

    // Apenas os nomes dos parâmetros para usar no `EventDispatcher.dispatchEvent`
    const paramNames = parameters.map(param => param.name).join(', ');

    // Gera o evento com os parâmetros no cabeçalho e no dispatcher
    return `       EventDispatcher.dispatchEvent(this, "${eventName}", ${paramNames});\n`;
};

Blockly.JavaScript['method_parameter'] = function(block) {
    const paramName = block.getFieldValue('PARAM_NAME');
    const paramType = block.getFieldValue('PARAM_TYPE');
    const paramFinal = block.getFieldValue('FINAL') === 'TRUE';

    // Retorna o parâmetro formatado como "tipo nome"
    return (paramFinal ? 'final ' : '') + `${paramType} ${paramName}`;
};

Blockly.JavaScript['method_declaration'] = function(block) {
    const methodName = block.getFieldValue('METHOD_NAME');
    const description = block.getFieldValue('DESCRIPTION');
    const returnType = block.getFieldValue('RETURN_TYPE');
    const content = Blockly.JavaScript.statementToCode(block, 'METHOD_CONTENT');

    const parameters = block.paramNames_ || [];
    const paramString = parameters.map(param => (param.final ? 'final ' : '') + `${param.type} ${param.name}`).join(', ');

    return `    @SimpleFunction(description = "${description}")
    public ${returnType} ${methodName}(${paramString}) {
${content}
    }\n`;
};

Blockly.JavaScript['method_return'] = function(block) {
    var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN_VALUE', Blockly.JavaScript.ORDER_ATOMIC) || '';
    return `        return ${returnValue};\n`;
};