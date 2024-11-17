//js/main.js
/*
 * Author: Francisco Iago Lira Passos (iagolirapassos@gmail.com)
 * New blocks in https://google.github.io/blockly-samples/examples/developer-tools/index.html
 * MIT LICENSE
 */
// Variáveis globais
let workspace = Blockly.getMainWorkspace();
let currentLanguage = 'pt-br';

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

// Funções para sallet e carregar blocos
window.saveBlocks = function() {
    try {
        let xmlDom = Blockly.Xml.workspaceToDom(workspace);
        let xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        
        let saveData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            blocks: xmlText
        };
        
        let saveString = JSON.stringify(saveData, null, 2);
        let blob = new Blob([saveString], {type: 'application/json'});
        let a = document.createElement('a');
        a.download = 'extension_blocks.json';
        a.href = URL.createObjectURL(blob);
        a.click();
        
        showNotification(TRANSLATIONS[currentLanguage]['file_success'], 'success');
    } catch (e) {
        console.error('Erro ao sallet blocos:', e);
        showNotification(TRANSLATIONS[currentLanguage]['file_error'], 'error');
    }
};

window.loadBlocks = function() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                let saveData = JSON.parse(e.target.result);
                
                if (!saveData.version) {
                    throw new Error('Formato de arquivo inválido');
                }
                
                let xmlDom = Blockly.utils.xml.textToDom(saveData.blocks);
                workspace.clear();
                Blockly.Xml.domToWorkspace(xmlDom, workspace);
                
                showNotification(TRANSLATIONS[currentLanguage]['file_success'], 'success');
            } catch (err) {
                console.error('Erro ao carregar blocos:', err);
                showNotification(TRANSLATIONS[currentLanguage]['file_error'], 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
};


document.addEventListener('DOMContentLoaded', function() {
	const themeSelect = document.getElementById('themeSelect');
	const outputCode = document.getElementById('outputCode');

    // Configuração do Blockly
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox'),
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
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
        trashcan: true
    });

    // Configuração do redimensionamento do painel
    const outputPanel = document.querySelector('.output-panel');
    const resizeHandle = document.querySelector('.resize-handle');
    let isResizing = false;
    let startY;
    let startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = parseInt(document.defaultView.getComputedStyle(outputPanel).height, 10);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const diffY = startY - e.clientY;
        outputPanel.style.height = (startHeight + diffY) + 'px';
        
        // Ajusta a altura do Blockly
        const blocklyDiv = document.getElementById('blocklyDiv');
        blocklyDiv.style.height = `calc(100vh - ${outputPanel.offsetHeight}px - 60px)`;
        Blockly.svgResize(workspace);
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

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
        document.querySelector('.text-generate').textContent = TRANSLATIONS[lang]['generate_code'];
        document.querySelector('.text-download').textContent = TRANSLATIONS[lang]['download_file'];

        // Atualiza o Blockly
        Blockly.setLocale(lang);
    }
    
    //Themes
    themeSelect.addEventListener('change', function() {
		changeTheme(this.value);
	});

	function changeTheme(theme) {
		// Remove todas as classes de tema anteriores
		outputPanel.classList.remove('theme-light', 'theme-dark', 'theme-github', 'theme-monokai');
		
		// Adiciona a nova classe de tema
		outputPanel.classList.add(`theme-${theme}`);
		
		// Regenera o código para aplicar o novo tema
		if (workspace) {
		    generateJavaCode();
		}
	}

    // Funções de geração e download de código
    window.generateJavaCode = function() {
		try {
		    let code = Blockly.JavaScript.workspaceToCode(workspace);
		    const outputElement = document.getElementById('outputCode');
		    
		    // Primeiro, define o texto bruto
		    outputElement.textContent = code;

		    // Se o Prism está disponível e carregado corretamente
		    if (typeof Prism !== 'undefined' && Prism.languages.java) {
		        requestAnimationFrame(() => {
		            try {
		                const highlightedCode = Prism.highlight(
		                    code,
		                    Prism.languages.java,
		                    'java'
		                );
		                outputElement.innerHTML = highlightedCode;
		                
		                // Mantém o tema atual
		                const currentTheme = themeSelect.value;
		                changeTheme(currentTheme);
		            } catch (highlightError) {
		                console.warn('Erro ao aplicar syntax highlighting:', highlightError);
		            }
		        });
		    }
		} catch (error) {
		    console.error('Erro ao gerar código:', error);
		    outputElement.textContent = 'Erro ao gerar código. Por favor, verifique seus blocos.';
		}
	};

    window.downloadCode = function () {
        const outputElement = document.getElementById('outputCode');
        const code = outputElement.textContent || outputElement.innerText;

        if (!code) {
            showNotification("No code generated. Please generate code first.", "error");
            return;
        }

        try {
            // Extração do package e nome da classe
            const packageMatch = code.match(/package\s+([\w\.]+);/);
            const classMatch = code.match(/public\s+class\s+(\w+)/);

            if (!packageMatch || !classMatch) {
                throw new Error("Invalid Java code. Could not extract package or class name.");
            }

            const packageName = packageMatch[1];
            const className = classMatch[1];

            // Criar o nome do arquivo
            const fileName = `${className}.java`;

            // Criação do arquivo Java para download
            const blob = new Blob([code], { type: "text/java;charset=utf-8" });
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

    function handleFileDrop(e) {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      let reader = new FileReader();

      reader.onload = function(event) {
        let saveData = JSON.parse(event.target.result);
        let xmlDom = Blockly.utils.xml.textToDom(saveData.blocks);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
      };

      reader.readAsText(file);
    }

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
    changeTheme('light');
});

// Função para compilar extensão
async function compileExtension() {
    const progressModal = showProgressModal();

    try {
        const outputElement = document.getElementById('outputCode');
        const code = outputElement.textContent || outputElement.innerText;

        if (!code) {
            showNotification("No code generated. Please generate code first.", "error");
            progressModal.close();
            return;
        }

        // Extract package and class name from the code
        const packageMatch = code.match(/package\s+([\w\.]+);/);
        const classMatch = code.match(/public\s+class\s+(\w+)/);

        if (!classMatch) {
            throw new Error("Invalid Java code. Could not extract class name.");
        }

        const className = classMatch[1];
        const packageName = packageMatch ? packageMatch[1] : "com.example";

        console.log("Class Name:", className);
        console.log("Package Name:", packageName);

        // Fetch the compiled extension from the server
        const response = await fetch("https://localhost:8080/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, className, packageName }),
        });

        console.log("Response Status:", response.status);

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
        showNotification("Failed to compile the extension. Check the console for details.", "error");
        progressModal.close();
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

        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
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





// Evento de clique no botão
//document.querySelector('.button').addEventListener('click', compileExtension);
