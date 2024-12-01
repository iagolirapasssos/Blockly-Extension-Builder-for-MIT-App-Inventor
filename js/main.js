//js/main.js
/*
 * Author: Francisco Iago Lira Passos (iagolirapassos@gmail.com)
 * New blocks in https://google.github.io/blockly-samples/examples/developer-tools/index.html
 * MIT LICENSE
 */
// Variáveis globais
let workspace = Blockly.getMainWorkspace();
let currentLanguage = 'pt-br';
let dependencies = []; // Array to store dependency URLs
let helpersData = {};
let manifestEditor;
let ymlEditor;

// Sistema de notificações
function showNotification(message, type) {
    let oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    let notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function initializeIdePreview() {
    const ideTab = document.getElementById('ideTab');
    if (!ideTab) return;

    const container = document.createElement('div');
    container.className = 'helper-container';

    const workspace = document.createElement('div');
    workspace.className = 'helper-workspace';
    workspace.appendChild(document.getElementById('blocklyDiv'));

    const preview = createIdeCodePreview();
    
    container.appendChild(workspace);
    container.appendChild(preview);
    ideTab.appendChild(container);

    const blocklyWorkspace = Blockly.getMainWorkspace();
    if (blocklyWorkspace) {
        blocklyWorkspace.addChangeListener(() => {
            updateIdeCodePreview();
        });
    }
}

function createIdeCodePreview() {
    const preview = document.createElement('div');
    preview.className = 'helper-code-preview';
    
    const header = document.createElement('div');
    header.className = 'helper-code-header';
    
    const title = document.createElement('h4');
    title.className = 'helper-code-title';
    title.textContent = 'Java Code Preview';
    
    const toggleButton = document.createElement('button');
    toggleButton.className = 'helper-code-toggle';
    toggleButton.innerHTML = '⟩';
    toggleButton.onclick = () => toggleCodePreview(preview);
    
    header.appendChild(title);
    header.appendChild(toggleButton);
    
    const content = document.createElement('pre');
    content.className = 'helper-code-content';
    const code = document.createElement('code');
    code.id = 'outputCode';
    code.className = 'language-java';
    content.appendChild(code);
    
    preview.appendChild(header);
    preview.appendChild(content);
    
    return preview;
}

function updateIdeCodePreview() {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;
    
    const code = generateJavaCodeForWorkspace(workspace);
    const codeElement = document.getElementById('outputCode');
    
    if (codeElement) {
        codeElement.textContent = code;
        Prism.highlightElement(codeElement);
    }
}

// Funções para sallet e carregar blocos
// Salvar blocos de forma assíncrona
window.saveBlocks = async function() {
    try {
        const mainXmlDom = Blockly.Xml.workspaceToDom(workspace);
        let mainXmlText = Blockly.Xml.domToPrettyText(mainXmlDom);
        mainXmlText = mainXmlText.split('\n').map(line => '    ' + line).join('\n');

        for (const [helperId, helperInfo] of Object.entries(blocklyHelpers)) {
            const helperXmlDom = Blockly.Xml.workspaceToDom(helperInfo.workspace);
            let helperXmlText = Blockly.Xml.domToPrettyText(helperXmlDom);
            helperXmlText = helperXmlText.split('\n').map(line => '        ' + line).join('\n');
            const helperFileName = document.getElementById(helperInfo.fileNameInputId)?.value || `helper_${helperId}`;
            helpersData[helperId] = { blocks: helperXmlText, fileName: helperFileName };
        }

        console.log(helpersData);

        const saveData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            mainBlocks: mainXmlText,
            helperCount,
            helpers: helpersData
        };

        const saveString = JSON.stringify(saveData, null, 4);
        const blob = new Blob([saveString], { type: 'application/json' });
        const a = document.createElement('a');
        a.download = 'extension_blocks.json';
        a.href = URL.createObjectURL(blob);
        a.click();

        showNotification(TRANSLATIONS[currentLanguage]['file_success'], 'success');
    } catch (error) {
        console.error('Erro ao salvar blocos:', error);
        showNotification(TRANSLATIONS[currentLanguage]['file_error'], 'error');
    }
};

// Carregar blocos de forma assíncrona
window.loadBlocks = async function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    helperCount = 0;

    input.onchange = async (e) => {
        try {
            const file = e.target.files[0];
            const content = await file.text();
            const saveData = JSON.parse(content);

            if (!saveData.version) throw new Error('Formato de arquivo inválido');

            if (saveData.mainBlocks) {
                const mainXmlDom = Blockly.utils.xml.textToDom(saveData.mainBlocks);
                workspace.clear();
                Blockly.Xml.domToWorkspace(mainXmlDom, workspace);
            }

            Object.keys(blocklyHelpers).forEach(helperId => deleteHelper(helperId));
            helperCount = saveData.helperCount || 0;

            if (saveData.helpers) {
                const sortedHelpers = Object.entries(saveData.helpers).sort(([idA], [idB]) => {
                    const numA = parseInt(idA.replace('helperTab', ''));
                    const numB = parseInt(idB.replace('helperTab', ''));
                    return numA - numB;
                });

                for (const [helperId, helperData] of sortedHelpers) {
                    await addHelperTab();
                    const currentHelperId = `helperTab${helperCount}`;
                    const helperInfo = blocklyHelpers[currentHelperId];

                    if (helperData.blocks && helperInfo && helperInfo.workspace) {
                        const helperXmlDom = Blockly.utils.xml.textToDom(helperData.blocks);
                        helperInfo.workspace.clear();
                        Blockly.Xml.domToWorkspace(helperXmlDom, helperInfo.workspace);

                        if (helperData.fileName) {
                            const fileNameInput = document.getElementById(helperInfo.fileNameInputId);
                            if (fileNameInput) fileNameInput.value = helperData.fileName;
                        }

                        await new Promise(resolve => setTimeout(resolve, 100));
                        updateHelperCodePreview(currentHelperId);
                    }
                }
            }

            showNotification(TRANSLATIONS[currentLanguage]['file_success'], 'success');
        } catch (error) {
            console.error('Erro ao carregar blocos:', error);
            showNotification(TRANSLATIONS[currentLanguage]['file_error'], 'error');
        }
    };

    input.click();
};


document.addEventListener('DOMContentLoaded', function() {
	const themeSelect = document.getElementById("themeSelect");
	const outputCode = document.getElementById('outputCode');
    const blocklyDiv = document.getElementById('blocklyDiv');
    
    const resizeBlocklyDiv = () => {
        const blocklyDiv = document.getElementById('blocklyDiv');
        const tabContainer = document.querySelector('.tab-container');
        const header = document.querySelector('.header');
        
        if (blocklyDiv) {
            const availableHeight = window.innerHeight - tabContainer.offsetHeight - header.offsetHeight;
            blocklyDiv.style.height = `${availableHeight}px`;
            
            // Força o Blockly a recalcular seu tamanho
            if (workspace) {
                Blockly.svgResize(workspace);
            }
        }
    };

    // Redimensiona o editor de blocos ao carregar e ao redimensionar a janela
    window.addEventListener('load', () => {
        resizeBlocklyDiv();
        // Força uma atualização adicional após um breve delay
        setTimeout(resizeBlocklyDiv, 100);
    });

    window.addEventListener('resize', () => {
        resizeBlocklyDiv();
    });


    // Configuração do Blockly
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox'),
        grid: {
            spacing: 30,
            length: 3,
            colour: '#ffc107',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        trashcan: true,
        move: {
            scrollbars: true,
            drag: true,
            wheel: true
        }
    });

    // Força o resize inicial
    resizeBlocklyDiv();

    // Adiciona um pequeno delay para garantir que tudo está renderizado
    setTimeout(() => {
        resizeBlocklyDiv();
        Blockly.svgResize(workspace);
    }, 100);


    // Configuração da mudança de idioma
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', function() {
        currentLanguage = this.value; // Atualiza a variável global
        changeLanguage(this.value);
    });

    function changeLanguage(lang) {
    
        // Atualiza as categorias do toolbox
        document.querySelectorAll('[id^="cat_"]').forEach(category => {
            const categoryId = category.id.replace('cat_', 'category_');
            if (TRANSLATIONS[lang][categoryId]) {
                category.setAttribute('name', TRANSLATIONS[lang][categoryId]);
            }
        });

        // Atualiza textos da interface
        document.getElementById('title').textContent = TRANSLATIONS[lang]['title'];
        // Atualiza categorias do toolbox
        document.getElementById('cat_config').setAttribute('name', TRANSLATIONS[lang]['cat_config']);
        document.getElementById('cat_props').setAttribute('name', TRANSLATIONS[lang]['cat_props']);
        document.getElementById('cat_methods').setAttribute('name', TRANSLATIONS[lang]['cat_methods']);

        // Atualiza os botões da IDE
        document.querySelector('.text-save').parentElement.title = TRANSLATIONS[lang]['save_blocks'];
        document.querySelector('.text-load').parentElement.title = TRANSLATIONS[lang]['load_blocks'];
        document.querySelector('.text-download').textContent = TRANSLATIONS[lang]['download_file'];

        // Atualiza o Blockly
        Blockly.setLocale(lang);
    }
    
    // Função para aplicar o tema
    function applyTheme(theme) {
        const body = document.body;

        // Remove todas as classes de tema previamente aplicadas
        body.classList.remove("theme-light", "theme-dark", "theme-github", "theme-monokai");

        // Adiciona a nova classe de tema
        body.classList.add(`theme-${theme}`);

        // Estilos adicionais para blockly e categorias do 
        // Additional styles for Blockly and toolbox categories
        const blocklyDiv = document.getElementById("blocklyDiv");
        if (blocklyDiv) {
            blocklyDiv.classList.remove("theme-light", "theme-dark", "theme-github", "theme-monokai");
            blocklyDiv.classList.add(`theme-${theme}`);
        }

        // Atualiza as cores das categorias do toolbox
        // Updates the colors of the categories in the toolbox
        const toolboxCategories = document.querySelectorAll("#toolbox category");
        toolboxCategories.forEach(category => {
            category.style.color = getComputedStyle(document.body).getPropertyValue("--category-text-color");
        });

        // Set the Monaco Editor theme
    let monacoTheme = 'vs'; // Default Monaco theme
    if (theme === 'dark') {
        monacoTheme = 'vs-dark';
    } else if (theme === 'github') {
        monacoTheme = 'vs-github'; 
    } else if (theme === 'monokai') {
        monacoTheme = 'vs-monokai';
    }

    // Update Monaco Editor themes
    if (window.manifestEditor) {
        monaco.editor.setTheme(monacoTheme);
    }
    if (window.ymlEditor) {
        monaco.editor.setTheme(monacoTheme);
    }

    // Apply background colors for the editors
    const editor = document.getElementById('editor');
    const editorYml = document.getElementById('editor-yml');
    const backgroundColor = getComputedStyle(body).getPropertyValue('--editor-background-color');

    if (editor) {
        editor.style.backgroundColor = backgroundColor;
    }
    if (editorYml) {
        editorYml.style.backgroundColor = backgroundColor;
    }

        // Atualiza as cores do workspace
        // Updates the workspace colors
      //  Blockly.getMainWorkspace().updateToolbox(document.getElementById("toolbox"));
       // Update the workspace colors
        const workspaceBackgroundColor = getComputedStyle(document.body).getPropertyValue("--workspace-bg-color");
        const workspace = Blockly.getMainWorkspace();
        if (workspace) {
        workspace.getCanvas().style.backgroundColor = workspaceBackgroundColor;
        workspace.getParentSvg().style.backgroundColor = workspaceBackgroundColor;

        // Reapply the toolbox to ensure the styles are updated
        workspace.updateToolbox(document.getElementById("toolbox"));
    }

    }

    // Adicionar evento ao seletor
    themeSelect.addEventListener("change", (event) => {
        applyTheme(event.target.value);
    });



    // Update code generation to use new preview system
    generateJavaCode = function() {
        try {
            const code = generateJavaCodeForWorkspace(Blockly.getMainWorkspace());
            const outputElement = document.getElementById('outputCode');
            if (outputElement) {
                outputElement.textContent = code;
                Prism.highlightElement(outputElement);
            }
        } catch (error) {
            console.error('Error generating Java code:', error);
            showNotification('Failed to generate code', 'error');
        }
    };

    window.downloadCode = function () {
        try {
            const workspace = Blockly.getMainWorkspace();
            const mainCode = generateJavaCodeForWorkspace(workspace);

            // Verificar se há código no workspace principal
            if (!mainCode.trim()) {
                showNotification("No code generated in Blocks. Please create some blocks first.", "error");
                return;
            }

            let combinedCode = mainCode;

            // Adicionar o código de todos os helpers
            for (const [helperId, helperInfo] of Object.entries(blocklyHelpers)) {
                const helperCode = generateJavaCodeForWorkspace(helperInfo.workspace);
                if (helperCode.trim()) {
                    combinedCode += `\n\n// Helper: ${helperId}\n${helperCode}`;
                }
            }

            // Validar a presença do pacote e da classe principal
            const packageMatch = combinedCode.match(/package\s+([\w\.]+);/);
            const classMatch = combinedCode.match(/public\s+class\s+(\w+)/);

            if (!packageMatch || !classMatch) {
                throw new Error("Invalid Java code. Could not extract package or class name.");
            }

            const packageName = packageMatch[1];
            const className = classMatch[1];
            const fileName = `${className}.java`;

            // Criar o arquivo para download
            const blob = new Blob([combinedCode], { type: "text/java;charset=utf-8" });
            const a = document.createElement("a");
            a.download = fileName;
            a.href = URL.createObjectURL(blob);
            a.click();

            showNotification(`Code downloaded as ${fileName}`, "success");
        } catch (error) {
            console.error("Error while downloading code:", error);
            showNotification("Failed to download code. Check the console for details.", "error");
        }
    };


    document.getElementById('blocklyDiv').addEventListener('dragover', handleDragOver);
    document.getElementById('blocklyDiv').addEventListener('drop', handleFileDrop);

    function handleDragOver(e) {
      e.preventDefault();
    }

    async function handleFileDrop(e) {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file || file.type !== 'application/json') {
            showNotification("Please drop a valid JSON file.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(event) {
            try {
                const saveData = JSON.parse(event.target.result);

                // Verifica versão do arquivo
                if (!saveData.version) {
                    throw new Error('Invalid file format or missing version.');
                }

                // Carregar blocos principais
                if (saveData.mainBlocks) {
                    const mainXmlDom = Blockly.utils.xml.textToDom(saveData.mainBlocks);
                    workspace.clear();
                    Blockly.Xml.domToWorkspace(mainXmlDom, workspace);
                }

                // Remove todas as abas helpers existentes
                Object.keys(blocklyHelpers).forEach(helperId => {
                    deleteHelper(helperId);
                });

                // Restaura o contador de helpers
                helperCount = saveData.helperCount || 0;

                // Carrega os helpers na ordem correta
                if (saveData.helpers) {
                    const sortedHelpers = Object.entries(saveData.helpers)
                        .sort(([idA], [idB]) => {
                            const numA = parseInt(idA.replace('helperTab', ''));
                            const numB = parseInt(idB.replace('helperTab', ''));
                            return numA - numB;
                        });

                    for (const [helperId, helperData] of sortedHelpers) {
                        await addHelperTab();

                        const currentHelperId = `helperTab${helperCount}`;
                        const helperInfo = blocklyHelpers[currentHelperId];

                        if (helperData.blocks && helperInfo && helperInfo.workspace) {
                            const helperXmlDom = Blockly.utils.xml.textToDom(helperData.blocks);
                            helperInfo.workspace.clear();
                            Blockly.Xml.domToWorkspace(helperXmlDom, helperInfo.workspace);

                            // Define o nome do arquivo se existir
                            if (helperData.fileName) {
                                const fileNameInput = document.getElementById(helperInfo.fileNameInputId);
                                if (fileNameInput) {
                                    fileNameInput.value = helperData.fileName;
                                }
                            }

                            updateHelperCodePreview(currentHelperId);
                        }
                    }
                }

                showNotification("Blocks loaded successfully.", "success");
            } catch (error) {
                console.error("Error loading blocks:", error);
                showNotification("Failed to load blocks. Check console for details.", "error");
            }
        };

        reader.readAsText(file);
    }

    workspace.addChangeListener(event => {
        if (
            event.type === Blockly.Events.BLOCK_CREATE ||  // Bloco criado
            event.type === Blockly.Events.BLOCK_CHANGE ||  // Bloco modificado
            event.type === Blockly.Events.BLOCK_DELETE ||  // Bloco deletado
            event.type === Blockly.Events.BLOCK_MOVE       // Bloco movido
        ) {
            //initializeIdePreview();
        }
    });


    Blockly.getMainWorkspace().addChangeListener(event => {
        if (event.type === Blockly.Events.VAR_RENAME || 
            event.type === Blockly.Events.VAR_CREATE || 
            event.type === Blockly.Events.VAR_DELETE) {
            
            Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
                if (typeof block.updateVariableDropdown === 'function') {
                    block.updateVariableDropdown();
                }
            });
        }
    });



    // Define o idioma inicial
    changeLanguage('en');
    initializeIdePreview();
    applyTheme('light');
});


function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    // Remove a classe 'active' de todas as abas e botões
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    // Ativa a aba correspondente
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    } else {
        console.error(`Tab with ID ${tabId} not found.`);
    }

    // Ativa o botão correspondente
    const activeButton = Array.from(buttons).find(button => button.getAttribute("onclick") === `showTab('${tabId}')`);
    if (activeButton) {
        activeButton.classList.add('active');
    } else {
        console.error(`Button for tab with ID ${tabId} not found.`);
    }
}



// Function to add a dependency
function addDependency() {
    const dependencyUrl = document.getElementById("dependencyUrl").value;
    if (!dependencyUrl) {
        showNotification("Please enter a valid URL.", "error");
        return;
    }
    dependencies.push(dependencyUrl);

    const list = document.getElementById("dependenciesList");
    const listItem = document.createElement("li");
    listItem.textContent = dependencyUrl;

    // Add a remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => {
        dependencies = dependencies.filter(url => url !== dependencyUrl);
        list.removeChild(listItem);
    };
    listItem.appendChild(removeButton);

    list.appendChild(listItem);
    document.getElementById("dependencyUrl").value = ""; // Clear the input field
}

// Função para compilar extensão
// Extend compileExtension to send dependencies to the server
async function compileExtension() {
    generateJavaCode(); // Gera o código principal primeiro
    const progressModal = showProgressModal();
    
    try {
        const outputElement = document.getElementById("outputCode");
        const code = outputElement.textContent || outputElement.innerText;
        const manifestContent = manifestEditor.getValue();
        const fastYmlContent = ymlEditor.getValue();;

        if (!code) {
            showNotification("No code generated. Please generate code first.", "error");
            progressModal.close();
            return;
        }

        // Primeiro tenta encontrar uma declaração de classe
        const packageMatch = code.match(/package\s+([\w\.]+);/);
        let className, packageName;

        // Tenta encontrar uma declaração de classe ou enum
        const typeMatch = code.match(/public\s+(class|enum)\s+(\w+)/);
        
        if (!typeMatch) {
            // Se não encontrar nem classe nem enum, tenta extrair do XML
            const xmlDoc = new DOMParser().parseFromString(code, 'text/xml');
            const classNameField = xmlDoc.querySelector('field[name="classNameEdit"]');
            if (classNameField) {
                className = classNameField.textContent;
            } else {
                throw new Error("Could not extract type name from code or blocks.");
            }
        } else {
            className = typeMatch[2]; // O nome está no segundo grupo de captura
        }

        packageName = packageMatch ? packageMatch[1] : "com.example";

        const updatedManifestContent = manifestContent.replace(
            /package="[^"]*"/,
            `package="${packageName}"`
        );

        // Processa os helpers
        const helpers = {};
        if (helpersData) {
            Object.entries(helpersData).forEach(([id, helper]) => {
                if (helper.fileName && helper.blocks) {
                    // Converte os blocos XML em código Java antes de enviar
                    const helperCode = generateCodeFromXml(helper.blocks);
                    if (helperCode) {
                        helpers[helper.fileName] = helperCode;
                    }
                }
            });
        }

        const response = await fetch("https://localhost:8080/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
                className,
                packageName,
                androidManifest: updatedManifestContent,
                fastYml: fastYmlContent,
                dependencies,
                helpers
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json().catch(() => null);
            const errorMessage = errorDetails?.error || "Unknown error occurred.";
            throw new Error(`Failed to compile the extension: ${errorMessage}`);
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        progressModal.updateWithDownload(downloadUrl, `${className}.aix`);

        await cleanupProjectDirectory(className);
    } catch (error) {
        console.error("Error during compilation:", error);
        showNotification("Compilation failed. Check the console for more details.", "error");
        progressModal.close();
    }
}

// Função auxiliar para gerar código Java a partir do XML dos helpers
function generateCodeFromXml(xmlString) {
    try {
        const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml');
        // Converte os blocos em código Java usando o Blockly
        const workspace = new Blockly.Workspace();
        Blockly.Xml.domToWorkspace(xmlDoc.documentElement, workspace);
        const code = generateJavaCodeForWorkspace(workspace);
        workspace.dispose();
        return code;
    } catch (error) {
        console.error('Error converting helper blocks to code:', error);
        return null;
    }
}

function showProgressModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Please wait...</h2>
            <p>Your extension is being generated. This might take a few seconds.</p>
            <div class="progress-circle"></div>
            <button class="close-modal">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModalButton = modal.querySelector('.close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // Method to update the modal with a download link
    modal.updateWithDownload = (downloadUrl, fileName) => {
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Extension Compiled Successfully!</h2>
                <p>Your extension is ready for download:</p>
                <a href="${downloadUrl}" download="${fileName}" class="download-link">Download ${fileName}</a>
                <button class="close-modal">Close</button>
            </div>
        `;

        const updatedCloseModalButton = modal.querySelector('.close-modal');
        if (updatedCloseModalButton) {
            updatedCloseModalButton.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
    };

    // Method to close the modal
    modal.close = () => {
        document.body.removeChild(modal);
    };

    return modal;
}


async function cleanupProjectDirectory(className) {
    try {
        const response = await fetch(`https://localhost:8080/cleanup/${className}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            console.error("Failed to cleanup project directory. Response status:", response.status);
        } else {
            console.log(`Project directory for ${className} cleaned up successfully.`);
        }
    } catch (error) {
        console.error("Error during project directory cleanup:", error);
    }
}
    // Manifest XML Editor
    const defaultCode = `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.mypackage.testextension.testextension">

  <application>
    <!-- You can use any manifest tag that goes inside the <application> tag -->
    <!-- <service android:name="com.example.MyService"> ... </service> -->
  </application>

  <!-- Other than <application> level tags, you can use <uses-permission> & <queries> tags -->
  <!-- <uses-permission android:name="android.permission.INTERNET"/> -->
  <!-- <queries> ... </queries> -->

</manifest>
    `;

    // Load Monaco Editor for Manifest XML
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.manifestEditor = monaco.editor.create(document.getElementById('editor'), {
        value: defaultCode.trim(),
        language: 'xml',
        theme: 'vs', // This will be updated dynamically
        automaticLayout: true,
    });
});

    // Default YML Code
    const defaultYamlCode = `
# The name of the extension developer
author: BosonsHiggs

# If enabled, the version number of every component will be increased automatically.
auto_version: true

# The minimum Android SDK level your extension supports. Minimum SDK defined in
# AndroidManifest.xml or @DesignerComponent are ignored, you should always define it here.
min_sdk: 7

# If enabled, Kotlin Standard Libraries (V1.9.24) will be included with the extension.
# If you want to add specific Kotlin Standard Libraries so disable it.
kotlin: false

# If enabled, you will be able to use Java 8 language features in your extension source code.
# When you use .kt classes, by default Fast will desugar sources.
desugar_sources: false

# Enable it, if any of your dependencies use Java 8 language features.
# If kotlin is enabled, by default Fast will desugar dependencies.
desugar_deps: false

# If enabled, the D8 tool will generate desugared (classes.jar) classes.dex
desugar_dex: true

# If enabled, @annotations will be not present in built extension.
deannonate: true

# If enabled, matching classes provided by MIT will not be included in the built extension.
filter_mit_classes: false

# If enabled, it will optimizes the extension with ProGuard.
proguard: true

# If enabled, R8 will be used instead of ProGuard and D8 dexer.
# NOTE: It's an experimental feature.
R8: false

# Extension dependencies (JAR) [Should be present into deps directory]
# dependencies:
# - mylibrary.jar

# Extension assets. [Should be present into assets directory]
# assets:
# - my-awesome-asset.anything
    `;

    // Load Monaco Editor for YML
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    window.ymlEditor = monaco.editor.create(document.getElementById('editor-yml'), {
        value: defaultYamlCode.trim(),
        language: 'yaml',
        theme: 'vs', // This will be updated dynamically
        automaticLayout: true,
    });
});
