@echo off
echo Updating GitHub repository...

git add README.md package.json
git commit -m "Update to version 0.2.0 with improved README design"
git push -u origin main

echo Done!
pause
