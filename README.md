# google-home-shiritori

Google Home と「しりとり」をすることができるアプリです。

# はじめに
このアプリを動かすには、Google Homeの他に、
  - Actions on Google の作成
  - Firebase Functions のデプロイ
  - Actions SDK のデプロイ
  - Firebase Realtime Database にデータの挿入

が必要になります。以下ではその手順について説明します。


# 必要なローカル環境
- node (v6.11.5以上)
- gactions (後述)

## クローン
- `git clone https://github.com/monstar-lab/google-home-shiritori.git`


# Actions on Googleの作成
1. [Actions on Google Console](https://console.actions.google.com)から作成する
1. [project名(actions)]を記入し、projectを作成する
1. Actions SDK でビルドを選択する
1. `gactions`を[gactions-cli](https://developers.google.com/actions/tools/gactions-cli)からダウンロードし、`chmod u+x gactions`で実行権限を追加する
1. `gactions`を`google-home-shiritori`に移動する


# Firebase Functions へのデプロイ
1. [Firebase](https://console.firebase.google.com)を開き、[project名(firebase)]、[project-id]を記入し、projectを新規作成する
1. `npm install -g firebase-tools`
1. `firebase login` を実行後、指示にしたがってFirebaseにログインする
1. `google-home-shiritori/`内で、`firebase init functions`を実行する
1. projectを選択するよう言われるので、1.で作成したprojectを選択する
1. 以下のように回答する
    ```
    ? What language would you like to use to write Cloud Functions? JavaScript
    ? Do you want to use ESLint to catch probable bugs and enforce style? No
    ? File functions/package.json already exists. Overwrite? No
    ? File functions/index.js already exists. Overwrite? No
    ? Do you want to install dependencies with npm now? Yes
    ```
1. `firebase deploy --only functions`でデプロイする


# Actions SDK のデプロイ
1. `./gactions init`
1. `action.json`を以下のように編集する
    ```json
    {
      "actions": [
        {
          "description": "Default Welcome Intent",
          "name": "MAIN",
          "fulfillment": {
            "conversationName": "shiritoriFunction"
          },
          "intent": {
            "name": "actions.intent.MAIN",
            "trigger": {
              "queryPatterns": [
                "しりとりアプリにつないで"
              ]
            }
          }
        },
        {
          "name": "SHIRITORI",
          "fulfillment": {
            "conversationName": "shiritoriFunction"
          },
          "intent": {
            "name": "actions.intent.TEXT",
            "parameters": {
              "name": "shiritoriWord",
              "type": "Shiritori"
            },
            "trigger": {
              "queryPatterns": [
                "$Shiritori:shiritoriWord"
              ]
            }
          }
        }
      ],
      "conversations": {
        "shiritoriFunction": {
          "name": "shiritoriFunction",
          "url": [Firebase FunctionsのURL]
        }
      },
      "locale": "ja"
    }
    ```
    FunctionsのURLは次の黒部分に記載されている
    ![](img/firebase_url_black.png)
1. `./gactions update --action_package action.json --project [project名(actions)]`


# Firebase Realtime Database へのデータの挿入
1. `data.json`の`dictionary`が Google Home の語彙になっているので、適宜編集する
1. [Firebase](https://console.firebase.google.com)のプロジェクトから、Databaseを選択する
1. Realtime Database を作成し、JSONからインポートを選択する
1. `data.json`をインポートする