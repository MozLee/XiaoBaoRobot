const {
    Wechaty,
    Contact
} = require('wechaty') //核心网页版微信 wechaty
const weather = require('./router/weather')
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
        const contact = message.from();
        const content = message.content();
        if (message.self()) {
            return
        }
        if (/在/.test(content)) {
            message.say('我还在线哦~')
        }
        if (/开启APP/.test(content)) {
            //定时任务函数
            const contact = await Contact.find({
                name: 'MozLee'
            });
            const contact2 = await Contact.find({
                alias: '英妹儿'
            });
            weather.timeSentInfo(contact, contact2);
            message.say('提醒开启成功奥~')
        }
        console.log(`${message.from()}发送消息: ${message.content()}`)
    })
    .init();

