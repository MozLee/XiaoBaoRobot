const {
    Wechaty,
    Contact
} = require('wechaty') //核心网页版微信 wechaty
const weather = require('./router/weather')
let weatherTips = false;
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
        const contact = message.from();
        const content = message.content();
        if (message.self()) {
            return
        }
        if (/在/.test(content)) {
            message.say('我还在线哦~')
            return
        }
        if (/开启APP/.test(content)) {
            //定时任务函数
            const contact = await Contact.find({
                name: 'MozLee'
            });
            const contact2 = await Contact.find({
                alias: '英妹儿'
            });
            const contact3 = await Contact.find({
                alias:'杨春'
            })
            const contact4 = await Contact.find({
                alias:'Lucia'
            })
            if(!weatherTips){
                weatherTips=true;
                weather.timeSentInfo(contact, contact2,contact3,contact4);
                message.say('天气提醒开启成功奥~')
            }else{
                weatherTips=false;
                message.say('天气服务已经开启了哦，不要重复操作~')
            }
            return
        }
        if(/[\w\W]*/.test(content)){
            message.say('小宝还在开发学习中哦~您可以联系MozLee激活天气提醒功能哦~')
        }
        console.log(`${message.from()}发送消息: ${message.content()}`)
    })
    .init();

