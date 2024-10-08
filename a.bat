@echo off
setlocal enabledelayedexpansion

:: Set the file to modify
set inputFile=c.txt
set tempFile=temp.txt

:: Step 1: Run git add, commit, and push
git add *
git commit -m "."
git push origin main

:: Step 2: Modify the file by removing "hello world" and replacing it with "hello"
if not exist "%inputFile%" (
    echo File not found!
    exit /b
)

> "%tempFile%" (
    for /f "tokens=*" %%A in (%inputFile%) do (
        set line=%%A
        set line=!line:hello world=hello!
        echo !line!
    )
)

move /y "%tempFile%" "%inputFile%"
echo "hello world" has been replaced with "hello"

:: Step 3: Add, commit, and push the changes after modification
git add *
git commit -m "Reverted 'hello world' to 'hello'"
git push origin main

echo Script completed.
