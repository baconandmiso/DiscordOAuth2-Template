# passport-discordを用いたOAuth2認証

単純にログインして、名前を表示するだけのものとなります。
TypeScriptで作りました。

## 使い方
1. npm install を実行すると、必要なパッケージインストールされます。
2. .envファイルを作る
3. .envファイルに以下の構成を記述

  CLIENT_ID = アプリケーションのID
  CLIENT_SECRET = アプリケーションのシークレットID
  COOKIE_SECRET = ランダムな文字列
  PORT = ポート番号(例: 8030)
