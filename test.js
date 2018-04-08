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
        //console.log(`${message.from()}发送消息: ${message.content()}`)
    })
    .on('friend', async (contact, request) => {
        let logMsg;
        if (request) {
            /**
             *
             * 1. New Friend Request
             *
             * when request is set, we can get verify message from `request.hello`,
             * and accept this request by `request.accept()`
             */
            if (request.hello === '李鑫最帅') {
                logMsg = 'accepted because verify messsage is "ding"'
                request.accept(); 
                console.log(logMsg);                

            } else {
                logMsg = 'not auto accepted, because verify message is: ' + request.hello;
                console.log(logMsg);
            }
        } else {
            /**
             *
             * 2. Friend Ship Confirmed
             *
             */
            logMsg = 'friend ship confirmed with ' + contact.get('name');
            console.log(logMsg);            
        }
    })
    .init();