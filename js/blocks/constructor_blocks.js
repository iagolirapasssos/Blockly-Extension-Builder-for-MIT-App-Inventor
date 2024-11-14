'use strict';

// Bloco do construtor
Blockly.Blocks['constructor_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('Constructor')
            .appendField(new Blockly.FieldCheckbox("TRUE"), "IS_DEFAULT")
            .appendField("default");
        this.appendStatementInput('PARAMETERS')
            .setCheck('constructor_parameter')
            .appendField('parameters');
        this.appendStatementInput('SUPER_CALL')
            .setCheck('constructor_super_call')
            .appendField('super call');
        this.appendStatementInput('CONSTRUCTOR_CONTENT')
            .setCheck(null)
            .appendField('implementation');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip('Define o construtor da extensão');
        
        this.updateShape_();
    },
    
    mutationToDom: function() {
        var container = document.createElement('mutation');
        var isDefault = (this.getFieldValue('IS_DEFAULT') == 'TRUE');
        container.setAttribute('is_default', isDefault);
        return container;
    },
    
    domToMutation: function(xmlElement) {
        var isDefault = (xmlElement.getAttribute('is_default') == 'true');
        this.getField('IS_DEFAULT').setValue(isDefault ? 'TRUE' : 'FALSE');
        this.updateShape_();
    },
    
    updateShape_: function() {
        var isDefault = (this.getFieldValue('IS_DEFAULT') == 'TRUE');
        if (isDefault) {
            if (this.getInput('PARAMETERS')) this.removeInput('PARAMETERS');
            if (this.getInput('SUPER_CALL')) this.removeInput('SUPER_CALL');
        } else {
            if (!this.getInput('PARAMETERS')) {
                this.appendStatementInput('PARAMETERS')
                    .setCheck('constructor_parameter')
                    .appendField('parameters');
            }
            if (!this.getInput('SUPER_CALL')) {
                this.appendStatementInput('SUPER_CALL')
                    .setCheck('constructor_super_call')
                    .appendField('super call');
            }
        }
    }
};

// Bloco de parâmetro do construtor
Blockly.Blocks['constructor_parameter'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('parameter')
            .appendField(new Blockly.FieldTextInput('paramName'), 'PARAM_NAME')
            .appendField('type')
            .appendField(new Blockly.FieldDropdown([
                ['ComponentContainer', 'ComponentContainer'],
                ['Context', 'Context'],
                ['String', 'String'],
                ['int', 'int'],
                ['boolean', 'boolean']
            ]), 'PARAM_TYPE');
        this.setPreviousStatement(true, 'constructor_parameter');
        this.setNextStatement(true, 'constructor_parameter');
        this.setColour("#5C6BC0");
        this.setTooltip('Adiciona um parâmetro ao construtor');
    }
};

// Bloco para chamada super
Blockly.Blocks['constructor_super_call'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('super(')
            .appendField(new Blockly.FieldTextInput('container.$context()'), 'SUPER_PARAMS')
            .appendField(')');
        this.appendStatementInput('AFTER_SUPER')
            .setCheck(null)
            .appendField('after super');
        this.setPreviousStatement(true, 'constructor_super_call');
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip('Chamada do construtor da classe pai');
    }
};

// Geradores de código
Blockly.JavaScript['constructor_declaration'] = function(block) {
    var isDefault = block.getFieldValue('IS_DEFAULT') == 'TRUE';
    var content = Blockly.JavaScript.statementToCode(block, 'CONSTRUCTOR_CONTENT') || '';
    
    if (isDefault) {
        return `    public Constructor(ComponentContainer container) {
        super(container.$context());
${content}    }\n`;
    } else {
        var parameters = Blockly.JavaScript.statementToCode(block, 'PARAMETERS') || '';
        var superCall = Blockly.JavaScript.statementToCode(block, 'SUPER_CALL') || '';
        
        parameters = parameters.trim().replace(/,\s*$/, '');
        
        return `    public Constructor(${parameters}) {
${superCall}${content}    }\n`;
    }
};

Blockly.JavaScript['constructor_parameter'] = function(block) {
    var paramName = block.getFieldValue('PARAM_NAME');
    var paramType = block.getFieldValue('PARAM_TYPE');
    
    return paramType + ' ' + paramName + ', ';
};

Blockly.JavaScript['constructor_super_call'] = function(block) {
    var params = block.getFieldValue('SUPER_PARAMS');
    var afterSuper = Blockly.JavaScript.statementToCode(block, 'AFTER_SUPER') || '';
    
    return `        super(${params});
${afterSuper}`;
};