Write-Host "Cleaning failed npm install..." -ForegroundColor Cyan
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue }
npm cache verify
npm config set registry https://registry.npmjs.org/
npm config delete proxy 2>$null
npm config delete https-proxy 2>$null
npm install --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
