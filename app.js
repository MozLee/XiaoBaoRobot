
const {
    Wechaty,
    Contact
} = require('wechaty') //核心网页版微信 wechaty
const schedule = require('node-schedule') //时间任务管理 node-schedule
const request = require('request');
Wechaty.instance()
    .on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            let loginUrl = url.replace(/\/qrcode\//, '/l/')
            require('qrcode-terminal').generate(loginUrl, {
                small: true
            })
        }
        console.log(`${url}\n[${code}] 扫描屏幕二维码登录: `)
    })
    .on('login', user => console.log(`User ${user.name()} logined`))
    .on('message', async (message) => {
        if (message.self()) {
            return
        }
        const contact = await Contact.find({
            name: 'MozLee'
        });
        const contact2 = await Contact.find({
            alias: '英妹儿'
        });
        timeSentInfo(contact,contact2);
        console.log(`${message.from()}发送消息: ${message.content()}`)
    })
    .init();
    //定时任务函数
    function timeSentInfo(contact,contact2) {
        schedule.scheduleJob('0 0 7 * * *',() => {
            let data =null;
            let url = 'https://api.seniverse.com/v3/weather/daily.json?key=9wf1etjmyn8kasuw&location=beijing&language=zh-Hans&unit=c&start=0&days=5'
            let p = new Promise((resolve,reject) => {
                request(url,(err,res,body) => {
                    if(body) resolve(body);
                });
            });
            p.then((data) => {
                data = JSON.parse(data);
                let w = data.results[0].daily[0];
                contact2.say(`亲爱哒~/:rose/:rose早上好~~\n北京今日天气${w.text_day}\n最高气温${w.high}℃,最低气温${w.low}℃\n/:skip风力指数${w.wind_scale}\n千万不要忘记吃药奥~多喝热水，病就好拉~`);
                contact.say(`亲爱哒~/:rose/:rose早上好~~\n北京今日天气${w.text_day}\n最高气温${w.high}℃,最低气温${w.low}℃\n/:skip风力指数${w.wind_scale}`);
            })
            // console.log(data);
            // let weather = data.results[0].daily[0];
            // contact.say(`北京今日天气${weather.text_day}`);
            console.log('定时任务'+new Date());
        })
    };
    
   
