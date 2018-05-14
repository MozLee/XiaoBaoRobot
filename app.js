//引入核心Wechaty
const {
  Wechaty,
  Contact,
  Room
} = require("wechaty");

//fs模块
const fs = require('fs')

//随机ID
const rdId = require('crypto-random-string');

//引入qrcode-terminal用于生成二维码
const qrcodeTerminal = require("qrcode-terminal");

//引入mongoose
const mongoose = require("mongoose");
//引入数据库连接
const dbconnection = require("./router/dbconnect");
//引入User模型 Xbstate模型
const User = require("./model/user");
const XbState = require('./model/xbstate');
//引入时间模块
const dateTime = require('date-time');

//引入server酱 微信提示错误以及登录等相关消息
const serverChan = require('./server/ServerChan')

let weatherService = false //初始天气服务
let timer = null;
//wechaty初始化
Wechaty.instance()

  //扫描二维码阶段
  .on("scan", async (url, code) => {
    if (!/200|201/.test(String(code))) {
      const loginUrl = url.replace(/\/qrcode\//, "/l/");
      qrcodeTerminal.generate(loginUrl, {
        small: true
      }); //生成Terminal二维码

      //server酱推送二维码
      serverChan.login(url);
      console.log("数据库连接中")      
      await dbconnection();
      updateXbstate(0,'已掉线(小宝扫描登录中)');
    }
    console.log(`${url}\n[${code}]扫描此url二维码登录`);
  })

  //成功登录阶段
  .on("login", async user => {
    console.log("---------------------------------------");
    console.log(user.obj);
    console.log(`用户[${user.name()}]成功登录`);
    //连接数据库
    console.log("---------------------------------------");
    updateXbstate(1,'正常');    
    //天气
    const weather = require('./router/weather/weatherTask')
    if (weatherService) {
      console.log('天气服务已经开启，无须再次开启');
      return
    } else {
      weather.sendWeatherInfo({
        time: '0 * * * * *',
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
    mes.say('小宝还在建设中，请耐心等待，当前提供天气服务。')
    console.log(`[${dateTime()}][${sender.name()}]:[${text}]`);
    console.log(`---------------------`);    
  })
  .on('heartbeat', (data) => {

  })
  .on('friend', async (contact, req) => {
    if (req) {
      if (req.hello === 'moz') {
        //新用户加好友处理数据后 写入数据库 注意 头像 与 备注 ID的问题        
        await req.accept();
        let name = contact.name();
        let newUser = await Contact.find({name:name});
        console.log('oldAlias'+newUser.alias());
        let xbId = rdId(5);        
        await newUser.alias(`xb${xbId}`)
        let userInfo = newUser.obj;
        console.log(userInfo);
        console.log('新加好友'+contact.name());
        console.log('更改alias为xb'+xbId);
        //将用户信息写入数据库
        let cacheUser = new User({
          name:userInfo.name,//微信昵称
          alias:`xb${xbId}`,//备注昵称
          sex:userInfo.sex,//性别 1男 0女
          province:userInfo.province,//省
          city:userInfo.city,//城市
          nowcity:'beijing',//当前所在城市
          signature:userInfo.signature,//个性签名
          address:userInfo.address,//地址
          star:userInfo.star,//星标好友
          stranger:userInfo.stranger,//陌生人
          avatar:userInfo.avatar,//头像地址
          official:userInfo.official,//官方？？？？？
          special:userInfo.special,//特别关心????
          weatherSevice:true
        })    
        cacheUser.save(); 
        const fileName = await newUser.alias()+'.jpg';
        const readFile = await newUser.avatar();
        const saveFile = fs.createWriteStream('./avatar/'+fileName);
        readFile.pipe(saveFile);
        console.log(newUser.name()+newUser.alias()+'头像保存成功');   
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

  //HTTP服务
  const express = require('express');
  const app = express();
  const cors = require('cors');
  app.use(cors({credentials: true, origin: 'http://localhost:8080'}))
  //api
  app.get('/updateall',async (req,res,next) => {
      const getAllUsers = require('./router/getAllUsers')
      let a = await getAllUsers(5,5000)
      // let info = a.obj;
         // 获取头像
      a.forEach(async(item) => {
        const fileName = await item.alias()+'.jpg';
        const readFile = await item.avatar();
        const saveFile = fs.createWriteStream('./avatar/'+fileName);
        readFile.pipe(saveFile);
        console.log(item.name()+'头像保存成功');
      });
      res.json({data:a,code:0,message:"获取全部用户信息成功"})
  })
  app.listen(3001,() => {
    console.log('HTTP服务开启成功，监听3001');
  })



 //更新小宝的登录状态
 
/**
 * 
 * 
 * @param {Number} code 
 * @param {String} state 
 */
function updateXbstate(code,state) {
  XbState.findOne({
    id:'xbstate'
  },(err,doc) => {
    if(err){
      console.log('Error'+err);
      return
    }
    doc.code = code;
    doc.state = state;
    doc.save()
  }) 
}    