@echo off

:: Nome do arquivo de saída
set OUTPUT_FILE=CodeCrafterAIX.txt

:: Nome do próprio script
set SCRIPT_NAME=%~nx0

:: Limpa o conteúdo do arquivo de saída
> "%OUTPUT_FILE%"

:: Função para imprimir o conteúdo do diretório e dos arquivos
:print_contents
setlocal
set DIR=%1
set PREFIX=%2

:: Verifica se o diretório existe
if not exist "%DIR%" (
    endlocal
    goto :eof
)

:: Lista os conteúdos do diretório atual
for /f "delims=" %%F in ('dir /b "%DIR%"') do (
    set ENTRY_NAME=%%F
    if /i not "%ENTRY_NAME%"=="%SCRIPT_NAME%" if /i not "%ENTRY_NAME%"=="%OUTPUT_FILE%" if /i not "%ENTRY_NAME%"=="venv" if /i not "%ENTRY_NAME%"=="ExternalExtensions" if /i not "%ENTRY_NAME%"=="Blocks Examples" if /i not "%ENTRY_NAME%"=="Figures" if /i not "%ENTRY_NAME%"=="sketches" if /i not "%ENTRY_NAME%"=="favicon.ico" if /i not "%ENTRY_NAME%"=="README.md" if /i not "%ENTRY_NAME%"==".gitignore" if /i not "%ENTRY_NAME%"=="node_modules" if /i not "%ENTRY_NAME%"=="package-lock.json" if /i not "%ENTRY_NAME%"=="rooms.json" if /i not "%ENTRY_NAME%"=="users.json" if /i not "%ENTRY_NAME%"=="exemples" if /i not "%ENTRY_NAME%"=="Midia" if /i not "%ENTRY_NAME%"=="localhost.key" if /i not "%ENTRY_NAME%"=="localhost.crt" if /i not "%ENTRY_NAME%"=="LICENSE" if not "%ENTRY_NAME:~0,-3%"==".sh" (
        if exist "%DIR%\%%F\" (
            :: Se for um diretório, chama a função recursivamente
            call :print_contents "%DIR%\%%F" "%PREFIX%%%F/"
        ) else (
            :: Se for um arquivo, imprime o nome e o conteúdo
            echo %PREFIX%%%F: >> "%OUTPUT_FILE%"
            type "%DIR%\%%F" >> "%OUTPUT_FILE%" 2>nul
            echo. >> "%OUTPUT_FILE%"
        )
    )
)

endlocal
goto :eof

:: Chama a função print_contents a partir do diretório atual
call :print_contents "." ""

echo Conteúdo listado e escrito em %OUTPUT_FILE%
