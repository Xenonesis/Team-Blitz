@echo off
echo Starting GitHub update script...

echo Checking git version...
git --version
if %ERRORLEVEL% neq 0 (
    echo Git is not installed or not in PATH. Please install Git and try again.
    exit /b 1
)

echo Current directory:
cd

echo Files in current directory:
dir

echo Checking if we're in a git repository...
if not exist .git (
    echo Initializing git repository...
    git init
    echo Git repository initialized
)

echo Configuring git if needed...
git config --get user.name
if %ERRORLEVEL% neq 0 (
    echo Setting git user.name...
    git config user.name "Aditya Kumar Tiwari"
    echo Git user.name set
)

git config --get user.email
if %ERRORLEVEL% neq 0 (
    echo Setting git user.email...
    git config user.email "itisaddy7@gmail.com"
    echo Git user.email set
)

echo Git status before adding files:
git status

echo Adding files to git...
git add README.md package.json
echo Files added to git

echo Git status after adding files:
git status

echo Committing changes...
git commit -m "Update to version 0.2.0 with improved README design"
echo Changes committed

echo Checking git remotes:
git remote -v
if %ERRORLEVEL% neq 0 (
    echo Adding remote origin...
    git remote add origin https://github.com/Xenonesis/Team-Blitz.git
    echo Remote origin added
)

echo Pushing to GitHub...
git push -u origin master
echo Changes pushed to GitHub

echo Done!
