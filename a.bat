@echo off
setlocal enabledelayedexpansion

:: Create the temp folder if it doesn't exist
if not exist temp (
    mkdir temp
)

:: Loop 100 times
for /l %%i in (1,1,50) do (
    echo Loop iteration %%i

    :: Step 1: Create a new file in the temp folder and write some text to it
    set fileName=temp\file%%i.txt
    echo This is file %%i > !fileName!
    echo Created file !fileName! with content: "This is file %%i"

    :: Step 2: Run git add, commit, and push
    git add *
    git commit -m "Added file %%i"
    git push origin main

    echo Iteration %%i completed.
)

echo All iterations completed.
