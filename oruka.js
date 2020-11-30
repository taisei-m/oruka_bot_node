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
let members = keys.MEMBERS;
let macs = [];

///////////////////////部屋におる人のmacアドレスを取得
async function get_mac() {
   exist_members = [];
   let ids = new Array(30)
   ids.fill(0);

   const promiseArray = ids.map(function (value, index) {
      return new Promise((resolve, reject) => {
         index = index + 1
         narp.getMAC(keys.IPA + index,
            function (err, gotmac) {
               if (!err) {
                  macs.push(gotmac);
                  resolve()
               } else {
                  resolve()
               }
            })
      });
   })
   await Promise.all(promiseArray);
   return;
}


////////////////////////部屋におる人の名前を取得
async function set_exist_member() {
   for (var member in members) {
      for (var mac of macs) {
         if (mac == member) {
            exist_members.push(members[member]);
         }
      }
   }
   console.log("exist_members", exist_members);
}


///////////////////////firebaseに置く
function push_firebase() {
   var exist_hard = "";
   var exist_person = "";

   exist_members.forEach(function (value) {
      exist_hard += value + ", ";
   });

   db.collection('exist').doc('arp')
      .update({
         exist_arp: exist_members,
         exist_hard: exist_hard,
         exist_person: exist_person,
         arp_time: admin.firestore.FieldValue.serverTimestamp()
      });
}



async function teiki() {
   let date = new Date().toString();
   console.log(date);
   macs = [];
   const value1 = await get_mac();
   console.log(macs);
   const value2 = await set_exist_member();
   const value3 = push_firebase();
   
   setTimeout(teiki, 10000);
}

teiki();




