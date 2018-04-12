const schedule = require('node-schedule') //时间任务管理 node-schedule
const request = require('request');
const dateTime = require('date-time');
let tips = '小宝提醒您:北京春如四季,适当增减衣服，小心感冒哦~'
function timeSentInfo(users) {
    if(!users instanceof Array){
        console.error('天气ERR,用户信息出错');
        return;
    }
    //FIXME:修复获取数据失败后不推送消息,处理无法请求数据后发送给用户相关错误信息
    schedule.scheduleJob('0 0 7 * * *', () => {
        let data = null;
        let url = 'https://api.seniverse.com/v3/weather/daily.json?key=9wf1etjmyn8kasuw&location=beijing&language=zh-Hans&unit=c&start=0&days=5'
        let p = new Promise((resolve, reject) => {
            request(url, (err, res, body) => {
                if (body) resolve(body);
                if (err) reject(err,res);
            });
        });
        let sun = '☀';
        let cloud = '⛅️';
        let dark = '☁️'
        p.then((data) => {
            data = JSON.parse(data);
            let w = data.results[0].daily[0];
            let emj;
            if(/晴/.test(w.text_day)){
                emj=sun;
            }else if(/多云/.test(w.text_day)){
                emj=cloud;
            }else if(/阴/.test(w.text_day)){
                emj=dark;
            }else{
                emj='/::~';
            }
          let weatherModel = `亲爱哒~/:rose早上好[爱心]\n北京今日天气${emj}${w.text_day}\n最高气温${w.high}℃,最低气温${w.low}℃\n${w.wind_direction}💨指数${w.wind_scale}\n[Smart]${tips}`
          users.forEach(user => {
            user.say(`${weatherModel}`)
          });           
        //   users[0].say(weatherModel) 
            // contact2.say(`亲爱哒~/:rose早上好[爱心]\n北京今日天气${emj}${w.text_day}\n最高气温${w.high}℃,最低气温${w.low}℃\n${w.wind_direction}💨指数${w.wind_scale}\n[Smart]${tips}\n千万不要忘记吃药奥~多喝热水，病就好拉~`);
            // contact.say(`${weatherModel}`);
            // contact3.say(`${weatherModel}`);
            // contact4.say(`${weatherModel}`);
            console.log('定时发送天气任务' + dateTime());
        }),((e,res) => {  //TODO:修复无法接收到错误
            console.log(e,res);
            users[0].say(`很抱歉，小宝今天出现了一些小状况，无法向您提供天气`)
        })
        // console.log(data);
        // let weather = data.results[0].daily[0];
        // contact.say(`北京今日天气${weather.text_day}`);
        
    })
};
module.exports.timeSentInfo=timeSentInfo;