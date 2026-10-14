# BridgeTTS Korean アイコン

PWA用アイコンファイル一覧:

| ファイル名 | サイズ | 用途 |
|-----------|--------|------|
| icon-120x120.png | 120x120 | iOS (iPhone) |
| icon-152x152.png | 152x152 | iOS (iPad) |
| icon-167x167.png | 167x167 | iOS (iPad Pro) |
| apple-touch-icon-180x180.png | 180x180 | iOS Apple Touch Icon |
| icon-192x192.png | 192x192 | Android / PWA |
| icon-512x512.png | 512x512 | PWA スプラッシュ |

## 意匠と原本

上部は韓国語「가」↔日本語「あ」、下部はマイクと波形。英語版/Nepali版の共通構成と青・濃紺の配色を踏襲しています。

- 英語版参照: https://github.com/AichiroFunakoshi/Bridge-TTS-Codex-/blob/main/images/icons/ios-appicon-1024.png
- Nepali版参照: https://github.com/AichiroFunakoshi/BrigeTTS-Nepali/blob/main/images/icons/ios-appicon-1024.png
- iOS原本: `ios-appicon-1024.png`（1024×1024、RGB、アルファなし）
- PWA用の各PNGは同じ原本を指定サイズへ縮小。
- 実際の編集プロンプト: `korean-icon-prompt.txt`
- iOSビルド時にprepare-www.shが原本をAsset Catalogへコピー。AltStoreソースも同じ原本をicon.pngとして配信します。
