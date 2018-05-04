const schedule = require("node-schedule"); //时间任务管理 node-schedule
const dbconection = require("../dbconnect");
const User = require("../../model/user");
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
    User.find({}, (err, doc) => {
      if (err) {
        console.log(`【数据库ERR】:${err}`);
        reject(err);
        return;
      }
      doc.forEach(item => {
        city.push(item.nowcity);
      });
      city = unique(city);
      resolve(city);
    });
  });
}

//用户分区
function getUsersClassify(weatherUsers) {
    if(!weatherUsers){
        console.log('请检查！！getUsersClassify()的参数');
        return;
    }
    return new Promise((resolve, reject) => {
      User.find({}, (err, doc) => {
        if (err) {
          console.log(`【数据库ERR】:${err}`);
          reject(err);
          return;
        }
        doc.forEach(item => {
          weatherUsers.forEach((item2) => {
              if(item2.city==item.nowcity&&item.alias!==''){
                  item2.user.push(item.alias);
              }
          })
        });
        // console.log(weatherUsers);
        resolve('成功');
      });
    });
  }
dbconection();

/**
 * 发送天气
 * 参数为一个对象
 * time:时间间隔
 * Contact 必须传入，为wecahty Contact实例
 * @param {Object} {time="0 * * * * *",Contact} 
 */
function sendWeatherInfo({time="0 * * * * *",Contact}) {
    console.log('天气服务开启成功');
    console.log('天气推送时间间隔'+time);
    schedule.scheduleJob(time, async () => {
        let citys = await getCity();
        let weatherUsers = [];
        await(() => {
            return new Promise((resolve, reject) => {
              let n = 0;  
              citys.forEach(async item => { 
                  let { data } = await $http.get(baseURL + item);
                  if(data) n++;
                  weatherUsers.push({ city: item, user: [] ,data});
                  if(n==citys.length){
                      resolve('数据请求成功')
                  }
                });
            })    
        })()
        await getUsersClassify(weatherUsers);
        console.log(weatherUsers);
        weatherUsers.forEach((item) => {
            item.user.forEach(async (user) => {
                let a = await Contact.find({
                    alias:user
                })
                a.say('您的城市是'+item.city)
                console.log(`向用户昵称${a.name},ID:${a.alias}推送天气成功`);
            })
        })
      });
}
module.exports.sendWeatherInfo=sendWeatherInfo;
