//引入核心Wechaty
const { Wechaty, Contact } = require("wechaty");

//引入qrcode-terminal用于生成二维码
const qrcodeTerminal = require("qrcode-terminal");

//引入mongoose
const mongoose = require("mongoose");
//引入数据库连接
const dbconnection = require("./router/dbconnect");
//引入User模型
const User = require("./model/user");

//wechaty初始化
Wechaty.instance()
  //扫描二维码阶段
  .on("scan", (url, code) => {
    if (!/200|201/.test(String(code))) {
      const loginUrl = url.replace(/\/qrcode\//, "/l/");
      qrcodeTerminal.generate(loginUrl, {
        small: true
      }); //生成Terminal二维码
    }
    console.log(`${url}\n[${code}]扫描此url二维码登录`);
  })
  //成功登录阶段
  .on("login", async user => {
    console.log("---------------------------------------");
    console.log(`用户[${user.name()}]成功登录`);
    console.log("---------------------------------------");
    console.log("数据库连接中");
    await dbconnection();
    let allUsers = await Contact.findAll();
    // console.log( allUsers[0].weixin());
    let result = [];
    console.log(allUsers);
    allUsers.forEach(item => {
      result.push(item.obj);
    });
    result.forEach(item => {
      User.findOne({
        alias: item.alias
      }).then(result => {
        if (result) {
          console.log("已经存在" + item.id);
        } else {
          console.log(`未查询到ID${item.id}`);
          let xbUser = new User({
            name: item.name, //微信昵称
            alias: item.alias, //备注昵称
            sex: item.sex, //性别 1男 0女
            province: item.province, //省
            city: item.city, //城市
            signature: item.signature, //个性签名
            address: item.address, //地址
            star: item.star, //星标好友
            stranger: item.stranger, //陌生人
            avatar: item.avatar, //头像地址
            official: item.official, //官方？？？？？
            special: item.special //特别关心
          });
          xbUser.save((err) => {
            console.log('保存状态',err?'失败':'成功 name'+item.alias);
          })
        }
      });
    });
  })
  .start();
