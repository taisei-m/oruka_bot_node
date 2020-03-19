var narp = require('node-arp');
var admin = require('firebase-admin');
var keys = require('./keys.js');

/////////////////////////////認証・初期化
let serviceAccount = require(keys.SERVICE_ACCOUNT_PATH);
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();





// do_arp().then(function (value) {
//    console.log("value = " + value);
//    set_exist_member();
//    return;
// }).then(function () {
//    push_firebase();
//    return;
// })



////////////////////////////////////arpで拾ったmacadressの人のexist_arpにtrueを入れる
var members = {
   "44:85:00:20:f0:5d": "高木pc",
   "f0:9f:fc:3d:4d:f2": "高木android",
   "44:85:00:1e:98:21": "大海1",
   "00:28:f8:cf:d2:03": "川瀬pc",
   "e4:9a:dc:0f:7e:6b": "大海2",
   "3c:28:6d:fd:92:b9": "川瀬pixel",
   "18:f1:d8:64:84:16": "峻吾携帯",
   "00:28:f8:a5:b0:04": "峻吾pc",
   "9c:5c:f9:36:82:69": "遼携帯",
   "00:28:f8:a9:de:6d": "遼pc",
   "44:91:60:5a:50:c8": "奥瀬android",
   "00:28:f8:a9:32:92": "奥瀬pc",
   "b4:86:55:86:2c:0f": "大誠huawei",
   "00:28:f8:a5:b3:4c": "大誠pc",
   "34:41:5d:c7:7f:ef": "小塚pc",
   "b8:41:a4:aa:b1:c5": "たかひろ"
}
var got_macs = ["0", 0];
var exist_members = [];

//////////部屋におる人のmacアドレスを取得
async function get_mac() {
   return new Promise(function (resolve) {
      console.log("get_mac");
      var wakus = [];
      for (var i = 1; i < 30; i++) {
         wakus.push(i);
      }
      var promiseArray = [];

      const do_arp = async i => {
         narp.getMAC(keys.IPA + i, function (err, gotmac) {
            if (!err) {
               got_macs.push(gotmac);
               console.log(gotmac);
            }
         });
      }
      // let i = 0;
      // for await (let item of wakus) {
      //    promiseArray.push(do_arp(i));
      // }

      // (async () => {
      //    await Promise.all(promiseArray).then(function () {

      //       console.log(promiseArray);
      //       console.log("promise.all")
      //    })

      const testFunc = async () => {
         await Promise.all(wakus.map(async item => await do_arp(item)))
         console.log('done!')
      };
   })
}

/////////部屋におる人の名前を取得
function set_exist_member() {
   console.log("set_exist_memger");
   return new Promise(function (resolve) {
      for (var got_mac of got_macs) {
         for (var member in members) {
            if (got_mac == member) {
               exist_members.push(members.member);
            }
         }
      }
      resolve();
   })
}

//////////firebaseに置く
function push_firebase() {
   return new Promise(function (resolve) {
      console.log("push_firebase");
      db.collection('exist').doc('arp')
         .update({
            exist_arp: exist_members
         });
      resolve();
   });
}



teiki();
async function teiki() {
   var value1 = await get_mac();
   console.log("value1 = " + value1)
   var value2 = await set_exist_member();
   console.log("value2 = " + value2)
   push_firebase();
}

// setInterval(set_arp_exist, 5000);