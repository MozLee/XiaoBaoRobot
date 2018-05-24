 //时间任务管理 node-schedule
 const schedule = require("node-schedule");
 //连接数据库
 const dbconection = require("../dbconnect");
 //数据库User模型
 const User = require("../../model/user");
 const weatherTime = require("../../model/weathertime"); 
 
 //axios 发送ajax
 const axios = require("axios");
 const baseURL = `https://api.seniverse.com/v3/weather/daily.json?key=9wf1etjmyn8kasuw&language=zh-Hans&unit=c&start=0&days=5&location=`;
 let $http = axios.create({
     timeout: 10000
 });

 //数组去重
 function unique(arr) {
     return Array.from(new Set(arr));
 }

 //获取用户所在位置
 function getCity() {
     let city = [];
     return new Promise((resolve, reject) => {
         User.find({
             weatherService: true
         }, (err, doc) => {
             if (err) {
                 console.log(`【数据库ERR】:${err}`);
                 reject(err);
                 return;
             }
             doc.forEach(item => {
                 console.log(item.name + '天气服务' + item.weatherService);
                 city.push(item.nowcity);
             });
             city = unique(city);
             resolve(city);
         });
     });
 }

 //用户按数据中的实际所在地区分组
 function getUsersClassify(weatherUsers) {
     if (!weatherUsers) {
         console.log('请检查！！getUsersClassify()的参数');
         return;
     }
     return new Promise((resolve, reject) => {
         User.find({
             weatherService: true
         }, (err, doc) => {
             if (err) {
                 console.log(`【数据库ERR】:${err}`);
                 reject(err);
                 return;
             }
             doc.forEach(item => {
                 weatherUsers.forEach((item2) => {
                     if (item2.city == item.nowcity && item.alias !== '') {
                         item2.user.push(item.alias);
                     }
                 })
             });
             // console.log(weatherUsers);
             resolve('成功');
         });
     });
 }
 //连接一下数据库
 dbconection();



 /**
  * 发送天气
  * 参数为一个对象
  * time:时间间隔
  * Contact 必须传入，为wecahty Contact实例
  * @param {Object} {time="0 * * * * *",Contact} 
  */
 function sendWeatherInfo({
     time = "0 * * * * *",
     Contact
 }) {
     console.log('天气服务开启成功');
     console.log('天气推送时间间隔' + time);
     let s = schedule.scheduleJob(time, async () => {
         //获取相关信息，citys用户有哪些城市['Beijing','Dalian']
         let citys = await getCity();
         let weatherUsers = [];
         //获取天气数据
         await (() => {
             return new Promise((resolve, reject) => {
                 let n = 0;
                 citys.forEach(async item => {
                     let {
                         data
                     } = await $http.get(baseURL + item);
                     if (data) n++;
                     weatherUsers.push({
                         city: item,
                         user: [],
                         data
                     });
                     if (n == citys.length) {
                         resolve('数据请求成功')
                     }
                 });
             })
         })()

         //将用户以不同的地区分类
         await getUsersClassify(weatherUsers);
         // console.log(weatherUsers);

         //处理天气
         let baseText = ``;
         weatherUsers.forEach((item) => {
             //处理数据
             let weCity = item.data.results[0].location.name;
             let weData = item.data.results[0].daily[0];
             // console.log(weData);
             //解构数据
             let {
                 date,
                 text_day,
                 text_night,
                 high,
                 low,
                 wind_direction,
                 wind_direction_degree,
                 wind_speed,
                 wind_scale
             } = weData;
             //获取eomoj
             let {
                 getEmoj
             } = require('./getEmoj'); //TODO:完善emoji内容
             let dayEmoj = getEmoj(text_day);
             let nightEmoj = getEmoj(text_night);
             let normalText = `${weCity}今日白天${text_day}${dayEmoj}\n今日夜间${text_night}${nightEmoj}\n最高气温${high}°C,最低气温${low}°C\n${wind_direction}风,💨指数${wind_scale}`;
             // console.log(item.user); 
             item.user.forEach(async (user) => {
                 let a = await Contact.find({
                     alias: user
                 })
                 if (a.star()) { //是否为星标用户，名字高亮
                     await a.say(`亲爱哒/:rose✨${a.name()}✨\n${normalText}`)
                     console.log(`向【VIP】用户昵称${a.name()},ID:${a.alias()}推送天气成功`);
                 } else {
                     //普通用户，无名字
                     await a.say(normalText);
                     console.log(`向【普通】用户昵称${a.name()},ID:${a.alias()}推送天气成功`);
                 }
             })
         })
         s.cancel();
         //TODO:递归查询数据库时间 更新新的推送天气时间
         weatherTime.findOne({
            id: 'newtime'
        }, (err, doc) => {
           console.log('doc-time'+doc.time);
            sendWeatherInfo({
                time: doc.time,
                Contact
            })
        })

     });
 }
 module.exports.sendWeatherInfo = sendWeatherInfo;