# Windows npm install fix

If `npm install` fails with `ECONNRESET`, it is a network interruption while downloading packages, not a ROVIK code error.
If you see `EPERM: operation not permitted, rmdir node_modules`, Windows is locking files from a failed install.

Run PowerShell as a normal user in the project folder:

```powershell
# close VS Code terminals running this project first
rmdir /s /q node_modules 2>$null
del package-lock.json 2>$null
npm cache verify
npm config set registry https://registry.npmjs.org/
npm config delete proxy
npm config delete https-proxy
npm install --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
npm run dev
```

If Windows still refuses to delete `node_modules`, restart the PC or run:

```powershell
npx rimraf node_modules package-lock.json
```

Then run `npm install` again.
