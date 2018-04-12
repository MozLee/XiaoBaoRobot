const schedule = require('node-schedule');//时间控制器
const axios = require('axios');//发送 Http 请求
//定义天气对应图标
let [sun,cloud,dark] = ['☀','⛅️','☁️']
let url = 'https://api.seniverse.com/v3/weather/daily.json?key=9wf1etjmyn8kasuw&location=beijing&language=zh-Hans&unit=c&start=0&days=5'
axios.get(url).then(({data}) => {
    let {results} = data;
    let {location,daily,last_update} = results[0];
}).catch((err) => {
  console.error('天气数据源请求错误',err);
})
