# 拾伍・圓夢 師長祝福網站 Demo

這是一個純靜態網站 demo，可直接放到 GitHub Pages 或學校 virtual server。

## 本地測試

最簡單的方式是直接打開 `index.html`。

Windows 可以直接雙擊：

```text
start-local.bat
```

如果想用 PowerShell 開啟接近 GitHub Pages 的本機預覽：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1
```

開啟後瀏覽：

```text
http://127.0.0.1:5500/
```

## 放到 GitHub Pages

把這個資料夾內的檔案一起放到 repository：

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

GitHub Pages 的來源選 repository root 即可。
