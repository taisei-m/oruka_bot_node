var admin = require('firebase-admin');
var keys = require('./keys.js');
const fs = require('fs');
//////////////////////認証・初期化
let serviceAccount = require(keys.SERVICE_ACCOUNT_PATH);
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();


const jsonObject = JSON.parse(fs.readFileSync('./migration/person.json', 'utf8'));
jsonObject.results.forEach(obj => {
   db
      .collection('person')
      .doc()
      .set({
         display_name: obj.display_name,
         exist_arp: false,
         exist_room: false,
         exist_beacon: false,
         mac_pc: "",
         mac_phone: "",
         userId: obj.userId,
         setting: {
            receive_notifications: false,
            send_notifications: true,
            check_connection: false
         }
      })
      .then(doc => {
         console.log('追加に成功しました' + doc);
      })
      .catch(error => {
         console.log(error);
      });
});