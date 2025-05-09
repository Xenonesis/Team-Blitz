# PowerShell script to update GitHub repository
Write-Host "Starting GitHub update script..." -ForegroundColor Green

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Git is not installed or not in PATH. Please install Git and try again." -ForegroundColor Red
    exit 1
}

# Check current directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

# List files in current directory
Write-Host "Files in current directory:" -ForegroundColor Cyan
Get-ChildItem -Force | Format-Table Name, Length, LastWriteTime

# Check if we're in a git repository
$isGitRepo = Test-Path -Path ".git"
Write-Host "Is Git repository: $isGitRepo" -ForegroundColor Cyan

if (-not $isGitRepo) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
}

# Configure git if needed
$userName = git config --get user.name
$userEmail = git config --get user.email

Write-Host "Current git user.name: $userName" -ForegroundColor Cyan
Write-Host "Current git user.email: $userEmail" -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($userName)) {
    $userName = "Aditya Kumar Tiwari"
    git config user.name $userName
    Write-Host "Set git user.name to: $userName" -ForegroundColor Green
}

if ([string]::IsNullOrEmpty($userEmail)) {
    $userEmail = "itisaddy7@gmail.com"
    git config user.email $userEmail
    Write-Host "Set git user.email to: $userEmail" -ForegroundColor Green
}

# Check git status
Write-Host "Git status before adding files:" -ForegroundColor Yellow
git status

# Add files to git
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add README.md package.json
Write-Host "Files added to git" -ForegroundColor Green

# Check git status after adding
Write-Host "Git status after adding files:" -ForegroundColor Yellow
git status

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Update to version 0.2.0 with improved README design"
Write-Host "Changes committed" -ForegroundColor Green

# Check if remote exists
Write-Host "Checking git remotes:" -ForegroundColor Yellow
$remoteExists = git remote -v
Write-Host "Remote exists: $remoteExists" -ForegroundColor Cyan

if ([string]::IsNullOrEmpty($remoteExists)) {
    Write-Host "Adding remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/Xenonesis/Team-Blitz.git
    Write-Host "Remote origin added" -ForegroundColor Green
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin master
Write-Host "Changes pushed to GitHub" -ForegroundColor Green

Write-Host "Done!" -ForegroundColor Green
