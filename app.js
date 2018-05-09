//引入核心Wechaty
const {
  Wechaty,
  Contact,
  Room
} = require("wechaty");

// const fs = require('fs')
//随机ID
const rdId = require('crypto-random-string');
//引入qrcode-terminal用于生成二维码
const qrcodeTerminal = require("qrcode-terminal");

//引入mongoose
const mongoose = require("mongoose");
//引入数据库连接
const dbconnection = require("./router/dbconnect");
//引入User模型
const User = require("./model/user");

//引入时间模块
const dayjs = require("dayjs");
const dateTime = require('date-time');

//引入server酱 微信提示错误以及登录等相关消息
const serverChan = require('./server/ServerChan')

let weatherService = false //初始天气服务
let timer = null;
//wechaty初始化
Wechaty.instance()

  //扫描二维码阶段
  .on("scan", (url, code) => {
    if (!/200|201/.test(String(code))) {
      const loginUrl = url.replace(/\/qrcode\//, "/l/");
      qrcodeTerminal.generate(loginUrl, {
        small: true
      }); //生成Terminal二维码

      //server酱推送二维码
      serverChan.login(url);
    }
    console.log(`${url}\n[${code}]扫描此url二维码登录`);
  })

  //成功登录阶段
  .on("login", async user => {
    console.log("---------------------------------------");
    console.log(`用户[${user.name()}]成功登录`);

    //连接数据库
    console.log("---------------------------------------");
    console.log("数据库连接中")
    await dbconnection();

    //天气
    const weather = require('./router/weather/weatherTask')
    if (weatherService) {
      return
    } else {
      weather.sendWeatherInfo({
        time: '0 0 7 * * *',
        Contact
      })
      weatherService = true;
    };
    // 获取所有用户
    // const getAllUsers = require('./router/getAllUsers')
    // let a = await getAllUsers(5);
    // 获取头像
    // a.forEach(async(item) => {
    //   const fileName = await item.alias()+'.jpg';
    //   const readFile = await item.avatar();
    //   const saveFile = fs.createWriteStream('./avatar/'+fileName);
    //   readFile.pipe(saveFile);
    //   console.log(item.name()+'头像保存成功');
    // });
    //心跳信息防止掉线
    const FDX = await Room.find({
      topic: 'FDX',
    })
    if (timer) return
    timer = setInterval(() => {
      FDX.say('XiaoBaoHeartBeat\n' + dateTime());
      console.log(`[${dateTime()}]` + '发送心跳信息');
    }, 1000 * 60 * 30) //每隔30分钟发一次
  })
  .on('message', async mes => {
    let sender = await mes.from();
    let text = await mes.content();
    if (mes.self()) {
      return
    };
    console.log(`---------------------`);
    console.log(`---------------------`);
    mes.say('小宝还在建设中，请耐心等待，当前提供天气服务。')
    console.log(`[${dateTime()}][${sender.name()}]:[${text}]`);
  })
  .on('heartbeat', (data) => {

  })
  .on('friend', async (contact, req) => {
    if (req) {
      if (req.hello === '李鑫最帅') {
        req.accept();
        //将用户信息写入数据库
        //TODO:新用户加好友处理数据后 写入数据库 注意 头像 与 备注 ID的问题
        // let friend = new User({
        //   name: contact.name(), //微信昵称
        //   alias: 'nc'+rdId(5), //备注昵称
        //   sex: contact.sex(), //性别 1男 0女
        //   province: contact.province(), //省
        //   city: contact.city, //城市
        //   signature: contact.signature, //个性签名
        //   address: contact.address, //地址
        //   star: contact.star, //星标好友
        //   stranger: contact.stranger, //陌生人
        //   avatar: contact.avatar, //头像地址
        //   official: contact.official, //官方？？？？？
        //   special: contact.special //特别关心
        // })
      } else {
        console.log(`小宝没有同意${contact.name()}加为好友，口令不正确`);
        let mozlee = await Contact.find({
          name: 'MozLee'
        });
        mozlee.say(`${contact.name()}请求小宝为好友,但是口令不正确，口令为${req.hello}`)
      }
    } else {
      console.log(`请求确认好友+${contact.name()}`);
    }
  })
  .on('logout', (user) => {
    console.log(`${user.name()}登出${dateTime()}`);
    serverChan.logout();
  })
  .start();