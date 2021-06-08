---
puppeteer:
  # true=landscape, false=portrait
  landscape: false

  # trueにしないとBackgroundColorで設定したものが出ない
  # 基本的に常にtrue
  printBackground: true

  # PDFにした際のサイズを指定
  format: "A4"

  # ヘッダとフッタを出力するかどうか
  # ヘッダだけ出すとかはできない
  # 基本的に常にtrue
  displayHeaderFooter: true

  # ヘッダテンプレート
  # 自動でファイル名が入ります
  # 必要ない場合には<span>の行を削除
  headerTemplate: '
    <div style="width:100%; text-align:right; border-bottom: 1pt solid #eeeeee; margin: 0.4cm 0.5cm 0; font-size: 7pt;">
    <span class="title"></span>
    </div>'

  # フッタテンプレート
  # 必ずCopyrightの年号と内容について変更すること
  # 画像はここにBase64エンコードしたものを入れないと出ない
  # style.cssに書いても無駄
  footerTemplate: '
    <div style="position: relative; border-top: 1px solid black; margin: 0.5cm; font-size: 9px; width: 100%;">
      <div style="font-size: 6px; position: absolute; left: 0; top: 0.2cm;">
        &copy; 2000-2019 ACCESS Confidential & Proprietary
      </div>
      <div style="position: absolute; width: 100%; top: 0.2cm; text-align: center;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    </div>'

  # ドキュメントのマージンを指定
  margin:
    top: '18mm'
    bottom: '18mm'
    left: '15mm'
    right: '15mm'

# Table of Content Configuration
toc:
  depth_from: 1
  depth_to: 3
  ordered: false
---

<!--
                      !!!!!! 注意事項 !!!!!!

    1. copyrightは次のサイトを確認すること
    https://sites.google.com/a/access-company.com/ld/top/services/l/070-shang-biao/8-zhe-zuo-quan-biao-shiporishi

    2. ドキュメントに表示するロゴ、商標表記に関しては次のサイトを確認すること
    https://sites.google.com/a/access-company.com/ld/top/services/l/070-shang-biao/shi-dang/tesuto

 -->

<!-- ACCESSテンプレートのスタイルを読み込み -->
@import "./resources/style.less"

<!-- 表紙 -->
<!-- []の中を変更してください -->

<!-- ロゴの選択 TM or R -->
<!-- その他のロゴは自分で追加して調整してください -->
@import "./resources/ACCESS_TM.png" {width="200px"}

<div class="DocumentTitleBox">

<div class="DocumentTitle">POWERGs GW スレッド間インタフェース</div>

  Rev. [0.1]
  [2021/06/08]

</div>

<!-- pagebreak -->

<!-- 権利表記 -->
<!-- 内容は必ずあったものに変更すること -->

本書に含まれる文章、図面などの著作権は、株式会社ACCESSが所有します。
&copy; 2021 ACCESS CO., LTD. All rights reserved.
本書の全部または一部を株式会社ACCESSの許諾なく複製し、頒布その他の行為を行うことはできません。
また、本書の内容・構成を株式会社ACCESSの許諾なく改変すること、改変したものを複製し、頒布その他の行為を行うこともできません。
ACCESS、ACCESSロゴは、日本国、米国、およびその他の国における株式会社ACCESSの登録商標または商標です。

その他、文中に記載されている会社名および商品名は、各社の登録商標または商標です。

本製品に明示されている各権利者の知的財産権表示、免責、その他の事項を削除、変更したり、これらの事項に混同を生じさせたりするような表示を新たに付すことはできません。

作成者： 三原　克大
株式会社ACCESS
〒101-0022 東京都千代田区神田練塀町3番地 大東ビル

<!-- ===== ここから 変更不可 ===== -->
<!-- pagebreak -->

<div class="TOC">目次</div>

<!-- 目次 -->
<!-- Previewでは章番号が見えないが、Exportするとちゃんと見えます -->
[TOC]

<!-- ===== ここまで 変更不可 ===== -->

<!--
  ここから本文
  #, ##, ### の前には強制的に pagebreak が入ります
-->

# 章

これは章です。

# 改訂履歴

- __2021/06/08__
  - 初版作成

  |担当|審査|承認|
  |:--|:--|:--|:--|
  |三原|福田|福田|

# スクリプトに提供する関数

## クライアントスレッドの開始

登録済みクライアントのスレッドを開始する。

```ruby
start_clients(context)
```

- 引数
  - context: メインループのコンテキスト
- 戻り値
  - オブジェクト
    - 属性 errcode: エラーコード
    - 属性 message: エラー発生時のエラーメッセージ

## クライアントスレッドの停止

登録済みクライアントのスレッドを停止する。

```ruby
stop_clients(context)
```

- 引数
  - context: メインループのコンテキスト
- 戻り値
  - オブジェクト
    - 属性 errcode: エラーコード
    - 属性 message: エラー発生時のエラーメッセージ

## クライアントからのイベント取得

クライアントから発生したイベントを取得する。内部でイベントキューに対してスレッド間同期を行う。

```ruby
get_event(context, timeout)
```

- 引数
  - context: メインループのコンテキスト
  - timeout: タイムアウト時間(ms)
- 戻り値
  - オブジェクト
    - 属性 client_id: イベントを発生させたクライアントの識別子("timeout" を含みうる)
    - 属性 timestamp: イベント発生時のタイムスタンプ
    - その他属性はクライアント依存

## クライアントへのリクエスト発行

クライアントにイベントを発行する。内部でイベントキューに対してスレッド間同期を行う。

```ruby
put_event(context, client_id, obj)
```

- 引数
  - context: メインループのコンテキスト
  - client_id: リクエスト送信先クライアントの識別子
  - obj: 属性と値の組を持つオブジェクト。属性はクライアント依存
- 戻り値
  - オブジェクト
    - 属性 errcode: エラーコード
    - 属性 message: エラー発生時のエラーメッセージ

# クライアントに提供する関数

## 構造体、列挙子

### メインループのコンテキスト

コンテキストの内部については未定。

```C
struct context_ {
  /* T.B.D. */
}
typedef struct context_ context;
```

### イベントの属性の、名前と値の組

イベント内の属性の、名前と値の組を、次の構造体で定義する。

```C
enum {
  PROP_TYPE_INTEGER,
  PROP_TYPE_DOUBLE,
  PROP_TYPE_TEXT,
  PROP_TYPE_NUM
};

struct prop_ {
  char *name;
  int type;
  union u{
    int integer;
    double double_number;
    char *text;
  };
}
typedef struct prop_ prop;
```

- enum
  - PROP_TYPE_INTEGER: 属性の値は int
  - PROP_TYPE_DOUBLE: 属性の値は double
  - PROP_TYPE_TEXT: 属性の値は文字列(char* を UTF-8 として解釈)
  - PROP_TYPE_NUM: 属性の個数を示す識別子で、値の型の識別子としては使わない

- struct prop_
  - name: 属性の名前
  - type: 属性の値の型、PROP_TYPE_* のいずれかを格納する
  - union u 内:
    - integer: int 型属性の値
    - double_number: double 型属性の値
    - text: char* 型属性の値

### イベント

イベントは、次の構造体で取得する。

```C
struct event_ {
  char *client_id;
  char *timestamp;
  size_t props_num;
  prop props;
};
typedef struct event_ event;
```

- struct event_
  - client_id: イベントを送受信するクライアントの識別子
  - timestamp: イベント発生時のタイムスタンプ
  - props_num: 属性の数
  - props: 属性の配列

## 関数

### スクリプトからのイベント取得

スクリプトからのイベントを取得する。内部でイベントキューに対してスレッド間同期を行う。取得したイベントの構造体は関数 `free_event()` で解放する必要がある。

```C
int get_event(context main_context,
              char *in_client_id,
              event **new_event);
```

- 引数
  - main_context: メインループのコンテキスト
  - in_client_id: イベントを取得するクライアント自身の識別子
  - new_event: 新たに取得したイベントを格納するポインタ
- 戻り値
  - 0 ... イベントを取得した。この場合、引数 new_event が指し示すポインタにはイベントが動的に割り当てられている
  - -1 ... タイムアウト
  - その他は未定

### スクリプトへのイベント発行

スクリプトへイベントを発行する。内部でイベントキューに対してスレッド間同期を行う。引数として渡したデータの所有権は移動しないためクライアントが解放する必要がある。

```C
int put_event(context main_context,
              chat *in_client_id,
              event *in_new_event);
```

- 引数
  - main_context: メインループのコンテキスト
  - client_id: イベント発行先のクライアントの識別子
  - new_event: 発行するイベントを格納するポインタ
- 戻り値
  - 0 ... イベントを発行した
  - -1 ... メモリ不足によるエラー
  - その他は未定

### 取得したイベントの解放

関数 `get_event()` で取得したイベントのヒープメモリを解放する。

```C
void free_event(event used_event);
```

- 引数
  - used_event: ヒープメモリを解放するイベント
- 戻り値
  - なし
