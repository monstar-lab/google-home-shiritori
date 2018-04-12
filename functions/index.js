const functions = require('firebase-functions');
const { DialogflowApp } = require('actions-on-google');
const kuromoji = require('kuromoji');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.database();

const wordList = {
  'あ': ['あいさつ','あいず','あき','あさ','あさり','あしか','あだな','あめ','あり','あるみほいる','あんず'],
  // 'あ': ['あめ','あふりか','あした'],
  'い': ['いか','いぐあな','いす','いたち','いちご','いぬ','いのしし','いもうと','いもり','いろり','いわ','いわし','いんすとーる'],
  'う': ['うえき','うきわ','うぐいす','うさぎ','うし','うちわ','うなぎ','うま','うみ','うらない','うり'],
  'え': ['えき','えすにっく','えだまめ','えのき','えのぐ','えはがき','えめらるど','えり','えりんぎ','えんそく','えんぴつ'],
  'お': ['おうむ','おくば','おくら','おっとせい','おみやげ','おやこ','おらんだ','おり','おれんじ'],
  'か': ['かーる','かい','かえる','こけら','かさ','かつお','かば','かぶとむし','かぼちゃ','かんがるー'],
  'き': ['きく','きじ','きず','きつつき','きつね','きのこ','きゃべつ','きゅうり','きょうかい','きりぎりす','きんめだる'],
  'く': ['くびかざり','くり','くつ','くま','くも','くりすます','くわがた','くじら','くっきー','くじゃく','くいず'],
  'け': ['けいさんき','けいと','けしごむ','けんこう'],
  'こ': ['こあら','こい','こーひー','ここあ','ここなっつ','こしょう','こたつ','こっぷ','こども'],
  'さ': ['さい','さいふ','さかな','さくらんぼ','さけ','さっかー','さとう','さる','さんそ','さんま'],
  'し': ['しーる','しお','しか','しじみ','しそ','しま','しまうま','しまりす','しゃち','しゃつ','しゃみせん','しょうが'],
  'す': ['すいか','すうじ','すかんく','すぎ','すし','すず','すすき','すずめ','すみれ'],
  // 'す': ['すろべにあ'],
  'せ': ['せいうち','せかい','せみ','せめんと','せんちゃ','せんぷうき','せんべい'],
  'そ': ['そうじ','そつぎょうしき','そば','そふぁー','そふとくりーむ','そら','そらまめ'],
  'た': ['たい','たおる','たけのこ','たこ','たたり','たちよみ','たつのおとしご','たぬき','たび','たる'],
  'ち': ['ちーず','ちーたー','ちきゅう','ちくわ','ちゅーりっぷ','ちょうちんあんこう','ちょこれーと','ちりとり','ちわわ','ちんぱんじー'],
  'つ': ['つき','つきのわぐま','つち','つつじ','つばめ','つまさき','つり','つる'],
  'て': ['てちょう','てっちり','てとらぽっと','てながざる','てぶくろ','てれび','てんき','てんとうむし'],
  'と': ['とうがらし','とうふ','とかい','とかげ','とけい','となかい','とびばこ','ともだち','とろ','とんじる','とんぼ'],
  'な': ['ないかく','ないふ','なし','なす','なつ','なっとう','なつめ','ななくさ','なまり','なみ','なると'],
  'に': ['にしきへび','にとうへんさんかっけい','にゅーよーく','にら','にわ','にわとり','にんにく'],
  'ぬ': ['ぬいぐるみ','ぬいめ','ぬかみそ','ぬけあな','ぬりえ','ぬるまゆ'],
  'ね': ['ねぎ','ねくたい','ねこ','ねずみ','ねっとわーく','ねぱーる','ねんど'],
  'の': ['のうさぎ','のーと','のこぎり','のど','のみ','のり','のろし'],
  'は': ['はいしゃ','はくさい','はさみ','はし','はしご','ぱせり','はな','はり'],
  'ひ': ['ひかげ','ひがんばな','ひきがえる','ひげ','ひすい','ひつじ','ひまわり','ひやしんす','ひらめ','ひる'],
  'ふ': ['ふうすい','ふきのとう','ふぐ','ふくろう','ふね','ふゆ','ふらみんご'],
  'へ': ['へいわ','へちま','へび'],
  'ほ': ['ほいーる','ぼうず','ほうれんそう','ほしがき','ほたる','ほっきょくぐま','ほっとけーき','ほととぎす','ほね','ほわいとはうす'],
  'ま': ['まいたけ','まがも','まぐろ','まつ','まめ','まれーばく','まんぐろーぶ','まんとひひ','まんぼう','まんほーる'],
  'み': ['みず','みそ','みつば','みのむし','みみ','みみず','みゅーじかる'],
  'む': ['むかしばなし','むかで','むぎ','むくどり','むし','むつごろう'],
  'め': ['めーる','めがね','めきゃべつ','めだか','めれんげ'],
  'も': ['もーたーしょー','もち','もでる','ものさし','もも','ももんが','もやし','もんしろちょう'],
  'や': ['やぎ','やきいも','やきゅう','やどかり','やまいも','やまねこ','やもり'],
  'ゆ': ['ゆうがお','ゆーかり','ゆかた','ゆきあそび','ゆず','ゆたんぽ','ゆび','ゆり'],
  'よ': ['ようがし','ようちえんじ','よーぐると','よこがお','よせがき','よつゆ','よみせ','よもぎ','よる'],
  'ら': ['らいちょう','らいむ','らくだ','らぐびー','らじお','らっかせい','らっきょう','らっこ','らんち','らんどせる'],
  'り': ['りきし','りく','りさいくる','りす','りゅう','りょうり','りょこう','りんご','りんどう'],
  'る': ['るーと','るーむめいと','るーれっと','るす','るびー','るんば'],
  'れ': ['れいぞうこ','れいとう','れきし','れたす','れっさーぱんだ','れんが','れんたる'],
  'ろ': ['ろうか','ろうがんきょう','ろうそく','ろーぷ','ろーま','ろーらーすけーと','ろけっと','ろば'],
  'わ': ['わいんせらー','わがし','わかめ','わさび','わし','わしき','わた','わに','わりばし'],
  'が': ['がちょう'],
  'ぎ': ['ぎょうざ'],
  'ぐ': ['ぐるめ'],
  'げ': ['げきじょう','げた','げんごろう'],
  'ご': ['ごーる','ごま'],
  'ざ': ['ざいこ'],
  'じ': ['じゃず'],
  'ず': ['ずかん'],
  'ぜ': ['ぜったいれいど'],
  'ぞ': ['ぞう'],
  'だ': ['だいず','だちょう'],
  'ぢ': [],
  'づ': [],
  'で': ['でんわ'],
  'ど': ['どーなつ'],
  'ば': ['ばなな'],
  // 'ば': ['ばす'],
  'び': ['びーどろ'],
  'ぶ': ['ぶた','ぶどう'],
  'べ': ['べにばな','べんち'],
  'ぼ': ['ぼーる'],
  'ぱ': ['ぱん'],
  'ぴ': ['ぴーなっつ'],
  'ぷ': ['ぷーる'],
  'ぺ': ['ぺんき','ぺんち'],
  'ぽ': ['ぽんぷ']
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

exports.shiritoriResponse = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({request: request, response: response});
  const WELCOME_INTENT = 'input.welcome';
  const SHIRITORI_INTENT = 'input.shiritori';

  const usedWordRef = db.ref("/shiritori/usedWord");

  function welcomeIntent (app) {
    startCharList = [];
    for (char in wordList) {startCharList.push(char)}
    var speakerLastWord = startCharList[getRandomInt(startCharList.length)];
    console.log(speakerLastWord);
    usedWordRef.set({
      lastWord: speakerLastWord,
      usedWords: [speakerLastWord]
    });
    app.ask(`しりとりをしましょう。「${speakerLastWord.slice(-1)}」から始めてください。制限時間は20秒です。`);
  }

  const readDB = () => {
    return new Promise((resolve, reject) => {
      usedWordRef.once('value', (snap) => {
        resolve(snap.val())
      })
    })
  }

  function shiritoriIntent (app) {
    const rawInput = app.getArgument('shiritoriWord')
    if (rawInput === 'quit' || rawInput === 'exit' || rawInput === 'しりとりを終了') {
      app.tell('しりとりを終了します。');
    } else if (rawInput === 'pause') {
      app.tell('しりとりを終了します。');
    } else {
      input = reading(rawInput);

      readDB()
      .then((data) => {
        console.log(data);
        speakerLastWord = data['lastWord'];
        usedWordList = data['usedWords'];
        checkedInput = userWordCheck(input,speakerLastWord,usedWordList);
        switch (checkedInput.status) {
          case 'continue':
            usedWordList.push(input);
            //Speaker側で次の単語を決める
            speakerAnswer = decideNextWord(input,usedWordList);
            switch (speakerAnswer.status) {
              case 'no_word_exist':
                app.tell(`${input}ですね。単語が思い浮かびません。ユーザーの勝ちです。`);
                // clearTimeout(alertTimer);
                // clearTimeout(closeTimer);
                break;
              case 'bad_word':
                app.tell(`${input}ですね。では、${speakerAnswer.word}。「ん」で終わってしまいました。ユーザーの勝ちです。`);
                // clearTimeout(alertTimer);
                // clearTimeout(closeTimer);
                break;
              case 'word_exist':
                app.ask(`${input}ですね。では、${speakerAnswer.word}`);
                usedWordList.push(speakerAnswer.word);
                usedWordRef.set({
                  lastWord: speakerAnswer.word,
                  usedWords: usedWordList
                });
                // clearTimeout(alertTimer);
                // clearTimeout(closeTimer);
                // alertTimer = setTimeout(() => {app.ask('\n残り5秒です。')}, 15000);
                // closeTimer = setTimeout(() => {app.ask('\n時間オーバーです。わたしの勝ちです。')}, 20000);
                break;
            }
            break;
          case 'retry':
            app.ask(checkedInput.response);
            break;
          case 'lose':
            app.tell(checkedInput.response);
            // clearTimeout(alertTimer);
            // clearTimeout(closeTimer);
            break;
          }
          return 0;
      })
      .catch('error');
      // usedWords = usedWordsRef.once("value", (snap) => {
      //   console.log(snap.val());
      //   test.values = snap.val();
      //   resolve(snap.val())
      // }).then(console.log(test)).catch('error');


    }
  }

const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(SHIRITORI_INTENT, shiritoriIntent);
  app.handleRequest(actionMap);
});

const builder = new kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict/' });
builder.build((err, tokenizer) => {
  if (err) {
    throw new Error('kuromojiのエラーです');
  }
  builder.tokenizer = tokenizer;
});

const reading = (input) => {
  kanaList = [];
  path = builder.tokenizer.tokenize(input);
  for (i = 0; i < path.length; i++) {
    kanaList.push(path[i]['reading']);
  }
  return path[0]['reading'] ? kanaToHira(kanaList.join('')) : kanaToHira(input);
};

const kanaToHira = (str) => {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

const userWordCheck = (input, speakerLastWord, usedWordList) => {
  //ひらがなチェック
  if (!input.match(/^[ぁ-ん]+$/)) {
    return {status: 'retry', response: '日本語で入力してください。'};
  }
  //一文字チェック
  if (input.length <= 1) {
    return {status: 'retry', response: '二文字以上にしてください。'}
  }
  //小文字、長音の処理
  convertedSpeakerLastChar = smallToLarge(macronToVowel(speakerLastWord));
  //接続チェック
  if (input.slice(0,1) !== convertedSpeakerLastChar) {
    return {status: 'retry', response: `「${convertedSpeakerLastChar}」から始まる単語ではありません。別の単語にしてください。`}
  }
  //「ん」で終了
  if (input.slice(-1) === 'ん') {
    return {status: 'lose', response: `「${input}」ですね。「ん」で終わりました。私の勝ちです。`}
  }
  //重複チェック
  if (usedWordList.some((usedWord) => {return usedWord === input})) {
    return {status: 'retry', response: `「${input}」ですね。重複してます。別の単語にしてください。`}
  }
  //問題なし
  return {status: 'continue', response: ''};
};

const decideNextWord = (userLastWord, usedWordList) => {
  convertedUserLastChar = smallToLarge(macronToVowel(userLastWord));
  selectedWordList = wordList[convertedUserLastChar];
  notUsedWordList = differenceOfList(usedWordList, selectedWordList);
  nextWord = notUsedWordList[getRandomInt(notUsedWordList.length)];
  if (!selectedWordList || notUsedWordList.length === 0) {
    return {status: 'no_word_exist', word: ''};
  } else if (nextWord.slice(-1) === 'ん') {
    return {status: 'bad_word', word: nextWord};
  } else {
    return {status: 'word_exist', word: nextWord};
  }
};

const differenceOfList = (usedWordList, wordPool) => {
  newList = [];
  for (i = 0; i < wordPool.length; i++) {
    if (usedWordList.indexOf(wordPool[i]) === -1) {
      newList.push(wordPool[i]);
    }
  }
  return newList;
};

const smallToLarge = (char) => {
  charMap = {'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お', 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ'};
  if (char in charMap) {
    return charMap[char];
  } else {
    return char;
  }
};

const macronToVowel = (word) => {
  charMap = {'あ': 'あ', 'か': 'あ', 'さ': 'あ', 'た': 'あ', 'な': 'あ', 'は': 'あ', 'ま': 'あ', 'や': 'あ', 'ら': 'あ', 'わ': 'あ',
             'が': 'あ', 'ざ': 'あ', 'だ': 'あ', 'ば': 'あ', 'ぱ': 'あ', 'ぁ': 'あ', 'ゃ': 'あ',
             'い': 'い', 'き': 'い', 'し': 'い', 'ち': 'い', 'に': 'い', 'ひ': 'い', 'み': 'い', 'り': 'い',
             'ぎ': 'い', 'じ': 'い', 'ぢ': 'い', 'び': 'い', 'ぴ': 'い', 'ぃ': 'い',
             'う': 'う', 'く': 'う', 'す': 'う', 'つ': 'う', 'ぬ': 'う', 'ふ': 'う', 'む': 'う', 'ゆ': 'う', 'る': 'う',
             'ぐ': 'う', 'ず': 'う', 'づ': 'う', 'ぶ': 'う', 'ぷ': 'う', 'ぅ': 'う', 'ゅ': 'う',
             'え': 'え', 'け': 'え', 'せ': 'え', 'て': 'え', 'ね': 'え', 'へ': 'え', 'め': 'え', 'れ': 'え',
             'げ': 'え', 'ぜ': 'え', 'で': 'え', 'べ': 'え', 'ぺ': 'え', 'ぇ': 'え',
             'お': 'お', 'こ': 'お', 'そ': 'お', 'と': 'お', 'の': 'お', 'ほ': 'お', 'も': 'お', 'よ': 'お', 'ろ': 'お',
             'ご': 'お', 'ぞ': 'お', 'ど': 'お', 'ぼ': 'お', 'ぽ': 'お', 'ぉ': 'お', 'ょ': 'お'};
  if (word.slice(-1) === 'ー') {
    return charMap[word.slice(-2,-1)];
  } else {
    return word.slice(-1);
  }
};
