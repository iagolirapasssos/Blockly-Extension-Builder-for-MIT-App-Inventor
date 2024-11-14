// Variáveis globais
let workspace;
let currentLanguage = 'pt-br';

// Sistema de notificações
function showNotification(message, type) {
    var oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    var notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Funções para salvar e carregar blocos
window.saveBlocks = function() {
    try {
        var xmlDom = Blockly.Xml.workspaceToDom(workspace);
        var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
        
        var saveData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            blocks: xmlText
        };
        
        var saveString = JSON.stringify(saveData, null, 2);
        var blob = new Blob([saveString], {type: 'application/json'});
        var a = document.createElement('a');
        a.download = 'extension_blocks.json';
        a.href = URL.createObjectURL(blob);
        a.click();
        
        showNotification(TRANSLATIONS[currentLanguage]['file_success'], 'success');
    } catch (e) {
        console.error('Erro ao salvar blocos:', e);
        showNotification(TRANSLATIONS[currentLanguage]['file_error'], 'error');
    }
};

window.loadBlocks = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                var saveData = JSON.parse(e.target.result);
                
                if (!saveData.version) {
                    throw new Error('Formato de arquivo inválido');
                }
                
                var xmlDom = Blockly.utils.xml.textToDom(saveData.blocks);
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
		    var code = Blockly.JavaScript.workspaceToCode(workspace);
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

    window.downloadCode = function() {
        const outputElement = document.getElementById('outputCode');
        // Pega o texto sem formatação HTML
        const code = outputElement.textContent || outputElement.innerText;
        const blob = new Blob([code], { type: 'text/java;charset=utf-8' });
        const a = document.createElement('a');
        a.download = 'MinhaExtensao.java';
        a.href = URL.createObjectURL(blob);
        a.click();
    };


    // Define o idioma inicial
    changeLanguage('en');
    changeTheme('light');
});
