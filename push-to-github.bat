@echo off
echo Updating GitHub repository...

git add .
git commit -m "Update to version 5.5"
git push -u origin main

echo Done!
pause
