var narp = require('node-arp');
var admin = require('firebase-admin');
var keys = require('./keys.js');

//////////////////////認証・初期化
let serviceAccount = require(keys.SERVICE_ACCOUNT_PATH);
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();


////////////////////////////////////////////////////////////
var members = {
   "00:28:f8:cf:d2:03": "川瀬pc",
   "3c:28:6d:fd:92:b9": "川瀬pixel",
   "44:85:00:20:f0:5d": "高木pc",
   "f0:9f:fc:3d:4d:f2": "高木android",
   "44:85:00:1e:98:21": "大海1",
   "e4:9a:dc:0f:7e:6b": "大海2",
   "00:28:f8:a5:b0:04": "峻吾pc",
   "18:f1:d8:64:84:16": "峻吾iPhone",
   "00:28:f8:a9:de:6d": "遼pc",
   "9c:5c:f9:36:82:69": "遼android",
   "00:28:f8:a9:32:92": "奥瀬pc",
   "44:91:60:5a:50:c8": "奥瀬android",
   "00:28:f8:a5:b3:4c": "大誠pc",
   "b4:86:55:86:2c:0f": "大誠huawei",
   "34:41:5d:c7:7f:ef": "小塚pc",
   "b8:41:a4:aa:b1:c5": "たかひろ"
}

///////////////////////部屋におる人のmacアドレスを取得
async function get_mac() {
   macs = [];
   exist_members = [];
   let ids = new Array(30)
   ids.fill(0);

   const promiseArray = ids.map(function (value, index) {
      return new Promise((resolve, reject) => {
         index = index + 1
         narp.getMAC("192.168.11." + index,
            function (err, gotmac) {
               if (!err) {
                  macs.push(gotmac);
                  console.log(gotmac);
                  resolve()
               } else {
                  resolve()
               }
            })
      });
   })
   await Promise.all(promiseArray);
   console.log("finished")
}


////////////////////////部屋におる人の名前を取得
async function set_exist_member() {
   console.log("set_exist_member");
   for (var member in members) {
      for (var mac of macs) {
         if (mac == member) {
            exist_members.push(members[member]);
         }
      }
   }
   console.log(exist_members);
}


///////////////////////firebaseに置く
function push_firebase() {
   var exist_hard = "";
   var exist_person = "";

   exist_members.forEach(function (value) {
      exist_hard += value + ", ";
   });
   console.log("push_firebase");

   db.collection('exist').doc('arp')
      .update({
         exist_arp: exist_members,
         exist_hard: exist_hard,
         exist_person: exist_person
      });
}




async function teiki() {
   const value1 = await get_mac();
   const value2 = await set_exist_member();
   const value3 = push_firebase();
}

setInterval(teiki, 10000);