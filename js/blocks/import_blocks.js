// Importação Manual
// Lista global de importações
const imports = {
    'ANNOTATIONS': 'com.google.appinventor.components.annotations.*',
    'RUNTIME': 'com.google.appinventor.components.runtime.*',
    'COMMON': 'com.google.appinventor.components.common.*',
    'COMPONENT_CATEGORY': 'com.google.appinventor.components.common.ComponentCategory',
    'COMPONENT_CONTAINER': 'com.google.appinventor.components.runtime.ComponentContainer',
    'UTIL': 'com.google.appinventor.components.runtime.util.*',
    'YAIL_LIST': 'com.google.appinventor.components.runtime.util.YailList',
    'YAIL_DICTIONARY': 'com.google.appinventor.components.runtime.util.YailDictionary',
    'PROPERTY_TYPE_CONSTANTS': 'com.google.appinventor.components.common.PropertyTypeConstants',
    'SIMPLE_EVENT': 'com.google.appinventor.components.annotations.SimpleEvent',
    'NUMBER_FORMAT': 'java.text.NumberFormat',
    'LOCALE': 'java.util.Locale',
    'LIST': 'java.util.List',
    'ARRAY_LIST': 'java.util.ArrayList',
    'COLLECTIONS': 'java.util.Collections',
    'OPTION_LIST': 'com.google.appinventor.components.common.OptionList',
    'HASH_MAP': 'java.util.HashMap',
    'MAP': 'java.util.Map',
    'CONTEXT': 'android.content.Context'
};

Blockly.Blocks['import_manual'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import')
            .appendField(new Blockly.FieldTextInput('java.util.ArrayList'), 'IMPORT_PATH');
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox('FALSE'), 'IS_STATIC')
            .appendField('static')
            .appendField(new Blockly.FieldCheckbox('FALSE'), 'IS_WILDCARD')
            .appendField('.*');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00897B");
        this.setTooltip('Importação manual de classe ou pacote');
    }
};

Blockly.Blocks['import_basic'] = {
    init: function() {
        // Cria o dropdown dinamicamente com base no objeto `imports`
        const dropdownOptions = Object.entries(imports).map(([key, value]) => [value, key]);

        this.appendDummyInput()
            .appendField("Import")
            .appendField(new Blockly.FieldDropdown(dropdownOptions), "IMPORT");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00897B");
        this.setTooltip("Imports necessary libraries");
        this.setHelpUrl("");
    }
};

// Importar Pacote Específico
Blockly.Blocks['import_package'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import package')
            .appendField(new Blockly.FieldTextInput('com.example'), 'PACKAGE')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('util'), 'SUB_PACKAGE')
            .appendField('.*');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00897B");
        this.setTooltip('Importar todas as classes de um pacote');
    }
};

// Importar Classe Específica
Blockly.Blocks['import_class'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import class')
            .appendField(new Blockly.FieldTextInput('java.util.List'), 'CLASS_PATH');
        this.appendDummyInput()
            .appendField('as')
            .appendField(new Blockly.FieldTextInput(''), 'ALIAS')
            .appendField('(opcional)');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00897B");
        this.setTooltip('Importar uma classe específica com alias opcional');
    }
};

// Importar Método Estático
Blockly.Blocks['import_static'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import static')
            .appendField(new Blockly.FieldTextInput('java.lang.Math'), 'CLASS')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('*'), 'METHOD');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#00897B");
        this.setTooltip('Importar método estático de uma classe');
    }
};

// Geradores de código
Blockly.JavaScript['import_manual'] = function(block) {
    let path = block.getFieldValue('IMPORT_PATH');
    let isStatic = block.getFieldValue('IS_STATIC') === 'TRUE';
    let isWildcard = block.getFieldValue('IS_WILDCARD') === 'TRUE';
    
    let code = 'import ';
    if (isStatic) code += 'static ';
    code += path;
    if (isWildcard) code += '.*';
    return code + ';\n';
};

Blockly.JavaScript['import_package'] = function(block) {
    let pkg = block.getFieldValue('PACKAGE');
    let subPkg = block.getFieldValue('SUB_PACKAGE');
    return `import ${pkg}.${subPkg}.*;\n`;
};

Blockly.JavaScript['import_class'] = function(block) {
    let classPath = block.getFieldValue('CLASS_PATH');
    let alias = block.getFieldValue('ALIAS');
    let code = `import ${classPath}`;
    if (alias) {
        code += ` as ${alias}`;
    }
    return code + ';\n';
};

Blockly.JavaScript['import_static'] = function(block) {
    let className = block.getFieldValue('CLASS');
    let method = block.getFieldValue('METHOD');
    return `import static ${className}.${method};\n`;
};

Blockly.JavaScript['import_basic'] = function(block) {
    const importType = block.getFieldValue('IMPORT');
    const importCode = imports[importType] || '';
    return `import ${importCode};\n`;
};