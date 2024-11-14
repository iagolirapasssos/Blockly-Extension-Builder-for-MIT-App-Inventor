#!/bin/bash

# Nome do arquivo de saída
OUTPUT_FILE="output.txt"

# Nome do próprio script
SCRIPT_NAME=$(basename "$0")

# Limpa o conteúdo do arquivo de saída
> $OUTPUT_FILE

# Função para imprimir o conteúdo do diretório e dos arquivos
print_contents() {
    local dir="$1"
    local prefix="$2"

    # Verifica se o diretório existe e não está vazio
    if [ ! -d "$dir" ] || [ -z "$(ls -A "$dir")" ]; then
        return
    fi

    # Lista os conteúdos do diretório atual
    for entry in "$dir"/*; do
        [ -e "$entry" ] || continue  # Pula se a entrada não existe
        local entry_name=$(basename "$entry")
        if [ "$entry_name" != "$SCRIPT_NAME" ] && 
           [ "$entry_name" != "$OUTPUT_FILE" ] &&
           [ "$entry_name" != "venv" ] &&
           [ "$entry_name" != "ExternalExtensions" ] &&
           [ "$entry_name" != "Blocks Examples" ] &&
           [ "$entry_name" != "Figures" ] &&
           [ "$entry_name" != "Figures" ] &&
           [ "$entry_name" != "sketches" ] &&
           [ "$entry_name" != "favicon.ico" ] &&
           [ "$entry_name" != "README.md" ] &&
           [ "$entry_name" != ".gitignore" ] &&
           [ "$entry_name" != "node_modules" ] &&
           [ "$entry_name" != "package-lock.json" ] &&
           [ "$entry_name" != "rooms.json" ] &&
           [ "$entry_name" != "users.json" ] &&
           [[ "$entry_name" != *.sh ]]; then
            if [ -d "$entry" ]; then
                # Se for um diretório, chama a função recursivamente
                print_contents "$entry" "$prefix$entry_name/"
            elif [ -f "$entry" ]; then
                # Se for um arquivo, imprime o nome e o conteúdo
                echo "$prefix$entry_name:" >> $OUTPUT_FILE
                cat "$entry" >> $OUTPUT_FILE 2>/dev/null
                echo -e "\n" >> $OUTPUT_FILE
            fi
        fi
    done
}

# Chama a função print_contents a partir do diretório atual
print_contents "." ""

echo "Conteúdo listado e escrito em $OUTPUT_FILE"
