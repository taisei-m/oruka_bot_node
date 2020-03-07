var narp = require('node-arp');
var NCMB = require("ncmb");
var keys = require('./keys.js');

/////////////////////////////ニフクラの設定
var application_key = keys.APPLICATION_KEY;
var client_key = keys.CLIENT_KEY;
var ncmb = new NCMB(application_key, client_key);
var Arp = ncmb.DataStore("arp");
var Person = ncmb.DataStore("person");
var Send_list = ncmb.DataStore("send_list");
var arp = new Arp();
var person = new Person();
var send_list = new Send_list();


setInterval(set_exist, 20000);

function set_exist() {
   //////////////////////////////arp ：とりあえず全員exsitにfalse入れる
   Arp.fetchAll()
      .then(function (arp) {
         for (i = 0; i < arp.length; i++) {
            arp[i].set("exist", "false")
            arp[i].update();
         }
      })


   ////////////////////////////////////arp: arpで拾ったmacadressの人はexistにtrue入れる
   for (i = 1; i < 30; i++) {
      narp.getMAC(keys.IPA + i, function (err, gotmac) {
         if (!err) {
            console.log(gotmac + " i=" + i);
            try {
               Arp.equalTo("mac", gotmac)
                  .fetch()
                  .then(function (gyo) {
                     console.log("gyo");
                     console.log(gyo);
                     gyo.set("exist", "true")
                     gyo.update();
                  })
            } catch (e) {
               console.log(e);
            }
         }
      });
   }
   Arp.equalTo("userId", "0000")
      .fetch()
      .then(function (gyo) {
         gyo.set("exist", "false")
         gyo.update();
      })


   ///////////////////////////////////////////send_list: send_trueを全部falseにする
   try {
      Send_list.fetchAll()
         .then(function (items) {
            for (var i = 0; i < items.length; i++) {
               items[i].set("send_true", "false")
               items[i].update();
            };
         })
   } catch (e) {
      outputLog(e);
   }


   /////////////arp: なんか知らんけどレコードの一番下のexistの値に勝手にtrueが入るから強制的にfalseを入れる
   Arp.equalTo("userId", "0000")
      .fetch()
      .then(function (item) {
         item.set("exist", "false");
         item.update();
      })



   ////////////////arp: exsit==trueのuserIdをsend_listに代入
   Arp.equalTo("exist", "true")
      .fetchAll()
      .then(function (items) {
         for (var i = 0; i < items.length; i++) {
            var userId_list = items[i].userId;
            set_send_true(userId_list);
         }
      })


   ///////////person: exsit_room==trueのuserIdをsend_listに代入　
   Person.equalTo("exist_room", "true")
      .fetchAll()
      .then(function (items) {
         for (var i = 0; i < items.length; i++) {
            var userId_list = items[i].userId;
            set_send_true(userId_list);
         }
      })


} ///set_exist()　終わり



/////////////////////////////////////////関数
function set_send_true(id) {
   Send_list.equalTo("userId", id)
      .fetch()
      .then(function (item) {
         item.set("send_true", "true");
         item.update();
      })
}