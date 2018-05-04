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

let n = 0;
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
    //连接数据库
    console.log("---------------------------------------");
    console.log("数据库连接中")
    await dbconnection();
    //天气
    const weather = require('./router/weather/weatherTask')
    weather.sendWeatherInfo({
        time:'0 0 7 * * *',
        Contact
    })
    //获取所有用户
    // const getAllUsers = require('./router/getAllUsers')
    // let a = await getAllUsers()
    // console.log(a.length);
  })
  .on('message',async mes=>{
      let sender = await mes.from();
      let text = await mes.content();
      if(mes.self()){
          return
      };      
      console.log(`[${sender.name()}]:[${text}]`);
  })
  .on('heartbeat',(data) => {
        n++;
        console.log('心跳包，我已经跳动'+n+'次');
  })
  .start();
