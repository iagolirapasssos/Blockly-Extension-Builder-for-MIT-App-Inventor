//blocks/configurations.js

//Blocks
Blockly.Blocks['extension_class'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Create Extension"), "className")
        .appendField(new Blockly.FieldTextInput("MyExtension"), "classNameEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Description"), "descriptionName")
        .appendField(new Blockly.FieldTextInput("A custom extension"), "descriptionNameEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Category"), "categoryName")
        .appendField(new Blockly.FieldTextInput("EXTENSION"), "extensionNameEdit");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Non-visible"), "NAME")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "checkBoxNonVisible");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Icon Name"), "NAME")
        .appendField(new Blockly.FieldTextInput("image/icon.png"), "imageURL");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Interfaces"), "interfacesLabel")
        .appendField(new Blockly.FieldTextInput(""), "interfaces");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("ANNOTATIONS"), "annotationsText");
    this.appendStatementInput("annotationBlocks")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("BLOCKS"), "blocksExtensions");
    this.appendStatementInput("statementBlocks")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setColour("#5C6BC0");
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['custom_annotation'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Custom Annotation")
            .appendField(new Blockly.FieldTextInput("@MyAnnotation"), "ANNOTATION");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip("Adds a custom annotation above @SimpleObject");
        this.setHelpUrl("");
    }
};


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
        let container = document.createElement('mutation');
        let isDefault = (this.getFieldValue('IS_DEFAULT') == 'TRUE');
        container.setAttribute('is_default', isDefault);
        return container;
    },
    
    domToMutation: function(xmlElement) {
        let isDefault = (xmlElement.getAttribute('is_default') == 'true');
        this.getField('IS_DEFAULT').setValue(isDefault ? 'TRUE' : 'FALSE');
        this.updateShape_();
    },
    
    updateShape_: function() {
        let isDefault = (this.getFieldValue('IS_DEFAULT') == 'TRUE');
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
        this.setPreviousStatement(true, 'constructor_super_call');
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip('Chamada do construtor da classe pai');
    }
};

Blockly.Blocks['package_declaration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Package")
            .appendField(new Blockly.FieldTextInput("com.example.extension"), "PACKAGE");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5C6BC0");
        this.setTooltip("Declares the extension package");
        this.setHelpUrl("");
    }
};

//Generators
Blockly.JavaScript['extension_class'] = function(block) {
  let interfaces = block.getFieldValue('interfaces');
  let className = block.getFieldValue('classNameEdit');
  let description = block.getFieldValue('descriptionNameEdit');
  let category = block.getFieldValue('extensionNameEdit');
  let nonVisible = block.getFieldValue('checkBoxNonVisible') === 'TRUE';
  let iconName = block.getFieldValue('imageURL');
  let annotations = Blockly.JavaScript.statementToCode(block, 'annotationBlocks');
  let members = Blockly.JavaScript.statementToCode(block, 'statementBlocks');

  let code = `@DesignerComponent(version = 1,
    description = "${description}",
    category = ComponentCategory.${category},
    nonVisible = ${nonVisible},
    iconName = "${iconName}")
@SimpleObject(external = true)
${annotations}public class ${className} extends AndroidNonvisibleComponent${interfaces ? ' implements ' + interfaces : ''} {
${members}}`;

  return code;
};

Blockly.JavaScript['custom_annotation'] = function(block) {
    let annotation = block.getFieldValue('ANNOTATION');
    return `${annotation}\n`;
};

Blockly.JavaScript['constructor_declaration'] = function(block) {
    let isDefault = block.getFieldValue('IS_DEFAULT') == 'TRUE';
    let content = Blockly.JavaScript.statementToCode(block, 'CONSTRUCTOR_CONTENT') || '';
    
    if (isDefault) {
        return `    public Constructor(ComponentContainer container) {
        
${content}    }\n`;
    } else {
        let parameters = Blockly.JavaScript.statementToCode(block, 'PARAMETERS') || '';
        let superCall = Blockly.JavaScript.statementToCode(block, 'SUPER_CALL') || '';
        
        parameters = parameters.trim().replace(/,\s*$/, '');
        
        return `    public Constructor(${parameters}) {
${superCall}${content}    }\n`;
    }
};

Blockly.JavaScript['constructor_parameter'] = function(block) {
    let paramName = block.getFieldValue('PARAM_NAME');
    let paramType = block.getFieldValue('PARAM_TYPE');
    
    return paramType + ' ' + paramName + ', ';
};

Blockly.JavaScript['constructor_super_call'] = function(block) {
    let params = block.getFieldValue('SUPER_PARAMS');
    let afterSuper = Blockly.JavaScript.statementToCode(block, 'AFTER_SUPER') || '';
    
    return `        super(${params});
${afterSuper}`;
};

Blockly.JavaScript['package_declaration'] = function(block) {
    let package = block.getFieldValue('PACKAGE');
    return `package ${package};\n\n`;
};