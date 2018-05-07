//引入核心Wechaty
const { Wechaty, Contact ,Room} = require("wechaty");

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
    if(weatherService)return;
    weather.sendWeatherInfo({
        time:'0 0 7 * * *',
        Contact
    })
    weatherService = true;

    //获取所有用户
    // const getAllUsers = require('./router/getAllUsers')
    // let a = await getAllUsers()
    // console.log(a.length);

    //心跳信息防止掉线
    const FDX = await Room.find({
      topic:'FDX',
    })
    if(timer)return
    timer = setInterval(() => {
      FDX.say('XiaoBaoHeartBeat\n'+dateTime());
      console.log(`[${dateTime()}]`+'发送心跳信息');
    },1000*60*30) //每隔30分钟发一次
  })
  .on('message',async mes=>{
      let sender = await mes.from();
      let text = await mes.content();
      if(mes.self()){
          return
      }; 
      mes.say('小宝还在建设中，请耐心等待，当前提供天气服务。')     
      console.log(`[${dateTime()}][${sender.name()}]:[${text}]`);
  })
  .on('heartbeat',(data) =>  {

  })
  .on('logout',(user) => {
     console.log(`${user.name()}登出${dateTime()}`);
     serverChan.logout ();
  })
  .start();
