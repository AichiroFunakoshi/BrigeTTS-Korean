# 🧭 作業継続ガイド（HANDOFF）

別のPC・別のセッションで作業を引き継ぐときは、**まずこのファイルを開く**こと。
ここが申し送り（handover）の入口。常に最新状態へのポインタを置く。

---

## ▶️ 現在の最新状態（韓国語版）

- 2026-10-14アイコン更新: 英語版/Nepali版のGitHub最新アイコンを参照し、「가 ↔ あ」に変更。1024px原本とPWA6サイズをRGB/アルファなしで保存。キャッシュv2へ更新。19件のスモークテスト成功。アイコンのAltStore反映にはPRマージ後の新IPAリリースが必要。

- AltStore準備（2026-10-13）: main a43d4c6のiOS Actions run 38336729890が成功。未署名IPAの識別子com.a16.bridgetts.korean、表示名、iOS 16.0、ko-KR認識/TTSと한국어ボタンをZIP内で確認。実機インストールは未確認。
- 非公開リポジトリ・Pages未設定でソース公開runはSetup Pagesで失敗。非公開時は公開ジョブをスキップし、IPA手動導入をREADMEの先頭に案内。ユーザー承認により公開へ切替済み。PagesをActions配信に設定。v2.9.3 IPAのReleaseとソース公開を実施済み。Pages run 38345140455成功。登録ページ/apps.json/IPAを認証なしで取得し、IPAサイズ864910バイトとSHA-256一致を確認。
- AltStoreソースにappPermissionsを追加し、Info.plistからマイク/音声認識の説明を取得。生成ソースと実IPAの権限一致をローカルで検証。
- 最終更新: 2026-10-13。正本は https://github.com/AichiroFunakoshi/BrigeTTS-Korean （公開）。作業フォルダーは `/Users/inaminetetsuo/BrigeTTS-Korean`。
- 英語版 `3f290fd`（v2.9.3）をコピーし、日韓版へ変更。言語コードはja/ko、認識はja-JP/ko-KR、TTSは入力言語を渡して内部で相手言語へ反転する。
- 通常訳・順送り訳・推敲、医療/日常モード、辞書（korean項目・空欄はハングル音訳）、履歴・言語別学習を日韓に対応。言語ボタンは日本語/한국어、韓国語入力中の停止は정지。設定説明とAPI名は日本語/元表記を維持。
- 保存キーはtranslatorKoreanで独立。設定エクスポート識別子はBridgeTTS-Koreanで、英語版の設定は取り込まない。iOS bundle IDはcom.a16.bridgetts.korean、表示名はBridgeTTS Korean。
- originは韓国語版、upstreamは英語版（push無効）。更新はfetch/status確認後pull --ff-only。実装はcodex/korean-versionブランチからPRで反映。
- 韓国語デバウンスは346msの暫定値。英語版の154msや改善率は韓国語の実測値ではない。
- 配信URL・レポート送信先を韓国語リポジトリへ変更。GitHub Pages公開・IPAビルド・v2.9.3リリースは実施済み。Apple ID署名・iPhone実インストールは利用者側で未確認。コピー元のトークンは転用していない。韓国語版のERROR_REPORT_TOKEN未設定時はIssue下書き画面を開く既存方式。
- 韓国語SWは韓国語版の古いキャッシュだけを削除。英語版SWには他アプリのキャッシュを削除する既存処理があるため、同一オリジンでの相互のオフライン維持は未保証。
- 検証: Playwright 19/19成功（API・認識・TTSはモック）、画面画像の表示確認、別エージェントの静的レビュー（履歴方向/キャッシュ削除を修正）。変更JS構文、軽量ESLint/Stylelint、plist検証、日韓eval 12件/順送り5件のdry-run。実API翻訳品質、iPhone Safari/WKWebView認識・音声再生・ネイティブビルドは未確認。
- TTS: 前段でMacのYuna ko_KRによる3.71秒の音声生成を確認。自動テストのTTSはモックであり実音声の品質確認ではない。
- 次の確認: AltStoreソースからの実機インストール、利用者のキーを設定した実翻訳、iPhoneで日韓の認識/読み上げ/連続ターン。公開配信設定は完了。実機のインストール・更新動作は未確認。
- PR #1のCI修正: 韓国語テスト画像の保存先を`testInfo.outputPath('korean-ui.png')`へ変更。CodeRabbitはFreeプランの要約のみで、行単位のレビュー指摘はない。

以下はコピー元英語版の履歴・設計資料。旧リリース、Issue番号、安定版タグ、品質数値は韓国語版の現在状態ではない。

---

## 🔙 ロールバック / 安定版アンカー

不具合時に「安定していた状態」へ確実に戻すための基点。

- **安定版アンカー**: タグ `stable-fable5-v2.3.0`（= `v2.3.0` / コミット `723eb06`）。fable5期の最終安定版。**不変**で、mainがどれだけ進んでも常にここを指す。
- **GitHub Release**: `v2.3.0`（IPA添付）も公開済み。配信を戻す場合はこのReleaseを再配布、または再びLatestにする。

戻し方（いずれも改良を失わず両方向に可能）:

```bash
# 安定版の中身を確認・取り出す
git checkout stable-fable5-v2.3.0      # detached。作業するなら: git checkout -b hotfix stable-fable5-v2.3.0

# mainの特定のマージだけを安全に打ち消す（履歴を残す）
git revert -m 1 <マージコミットSHA>     # 例: 2ff46c3（PR #33）

# 配信を旧版へ: v2.3.0 のIPA(GitHub Release)を再配布、またはv2.3.0を再Latest化
```

> 運用: 改良は必ずブランチ→PR→マージ、リリースは必ず `v*` タグ。各バージョンが独立した復帰点になる。
> 注意: `v*` タグのpushはIPA自動ビルド＆AltStore配信を発火する。安定版アンカーが `stable-` 始まりなのは誤発火を避けるため。

---

## 🔁 別PCで継続する手順

```bash
# 1. リポジトリを取得（初回のみ）。※iCloud Drive内ではなくローカル実体に置くこと
git clone https://github.com/AichiroFunakoshi/Bridge-TTS-Codex-.git
cd Bridge-TTS-Codex-

# 2. 最新を取得
git fetch origin

# 3. 作業ブランチを確認・チェックアウト（上の「現在の最新状態」を参照）
git branch -a
git checkout main                        # 進行中の作業ブランチがあればそれをcheckout

# 4. このガイドと最新の申し送りを読む
#    docs/HANDOFF.md → 最新の docs/handover-YYYY-MM-DD-*.md
#    → 「次にやること」から再開

# 5. 依存導入・テスト（Node 22 を使用）
nvm use
npm install
npx playwright install chromium
npm run test:smoke -- --reporter=line
```

> 補足: 作業フォルダは **iCloud Drive の外**（例 `~/Developer/`）に置くこと。
> iCloud内だとファイルがクラウド専用化して読み書き・gitが不安定になる。

---

## 🗂 申し送り一覧（新しい順）

| 日付 | ファイル | 概要 |
|---|---|---|
| 2026-07-02 | [handover-2026-07-02-local-migration.md](handover-2026-07-02-local-migration.md) | ローカル移行確定 / CLAUDE.mdにFable5規範 / 進捗ダッシュボード追加 |
| 2026-06-23 | [handover-2026-06-23-present-mode.md](handover-2026-06-23-present-mode.md) | 大型表示モード実装 / package.json 版数整合（PR #33 マージ済み・main 2ff46c3） |
| 2025-10-10 | [handover-2025-10-10-ios-safari-fix.md](handover-2025-10-10-ios-safari-fix.md) | iOS Safari 関連の修正 |
| 2025-10-10 | [handover-2025-10-10.md](handover-2025-10-10.md) | 申し送り |
| 2025-01-08 | [handover-2025-01-08.md](handover-2025-01-08.md) | 申し送り |

---

## 📝 運用ルール（申し送りの残し方）

0. **毎セッション終了時**（指示がなくても）「現在の最新状態」を更新してpushする。フォルダの手動コピーでMacを移っても、ここが最新なら継続できる。
1. 大きな節目では `docs/handover-YYYY-MM-DD[-トピック].md` を新規作成する。
2. 内容は「現在の作業状況／完了／進行中／次のステップ／重要情報／注意点」を含める
   （テンプレートは既存の申し送りファイルを流用してよい）。
3. **このファイル（HANDOFF.md）の「現在の最新状態」と「申し送り一覧」を必ず更新**する。
4. コミットして push する（別PCから `git pull` で参照できる状態にする）。

---

## ⚠️ 既知の注意点

- `main` への取り込みは push → PR → マージで行う（直接編集しない）。
- この共同作業環境は `.git` の `unlink` が制限され、コミット時に空ロックが残ることがある。
  Mac Terminal で掃除: `rm -f .git/HEAD.lock .git/index.lock .git/objects/*/tmp_obj_* 2>/dev/null`
  Cowork内で「Operation not permitted」になる場合は、ファイル削除の許可（allow file delete）を得れば掃除できる。
- **Cowork（Claudeサンドボックス）での開発**（2026-07-03確認）:
  - テスト環境構築は `bash scripts/cowork-setup.sh` を「✅ セットアップ完了」が出るまで繰り返し実行（シェル45秒制限のため分割再開式）。完了後は `LD_LIBRARY_PATH=$HOME/.local/lib-extra/lib npm run test:smoke` でsmoke全11件が実行できる。
  - サンドボックスからは `git push` 不可（認証なし）。ブランチ・コミット・PRは GitHub MCP（server-github）経由で作成し、ローカル作業ツリーは汚さない。
  - apt/deb/condaはプロキシ遮断。npmレジストリとPlaywright CDNは通る。
- GitHub Pagesのデプロイが「Deployment failed, try again later」で連続失敗することがある（GitHub側の一過性障害）。
  10分ほど置いて `gh workflow run altstore-source.yml` で再実行すれば復旧する。ipa/Release本体は影響を受けない。
- 翻訳には OpenAI APIキーが必要（端末の localStorage に保存。共有端末では使用後リセット）。
