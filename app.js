const {
    Wechaty,
    Contact
} = require('wechaty') //核心网页版微信 wechaty
const weather = require('./router/weather'); //处理天气
const dateTime = require('date-time'); //时间格式化
const Tuling123 = require('tuling123-client'); //图灵机器API
const tuling = new Tuling123('c8bb5553bfc84de4940f50fbff15bf52') //图灵API key
const routerAdmin = require('./router/admin.js')
let weatherTips = false; //判断天气
Wechaty.instance()
    .on('scan', (url, code) => { //获取二维码登录事件
        if (!/201|200/.test(String(code))) {
            let loginUrl = url.replace(/\/qrcode\//, '/l/')
            require('qrcode-terminal').generate(loginUrl, { //qrcode-terminal将url转成二维码
                small: true //二维码大小
            })
        }
        console.log(`${url}\n[${code}] 扫描屏幕二维码登录: `)
    })
    .on('login', user => console.log(`用户 ${user.name()} 成功登录`))
    .on('message', async (message) => { //收到消息事件
        //获取发送消息的用户
        const contactUser = message.from();
        const content = message.content();
        if (message.self()) { //自己发送消息给自己 return
            return
        }

        if (/开启APP/.test(content)) { //定时推送天气功能
            if (contactUser.name() === 'MozLee') { //判断管理员账号
                //定时任务函数
                const wu1 = await Contact.find({ //wu = WeatherUser 
                    name: 'MozLee'
                });
                const wu2 = await Contact.find({
                    alias: '英妹儿'
                });
                const wu3 = await Contact.find({
                    alias: '杨春'
                });
                const wu4 = await Contact.find({
                    alias: 'Lucia'
                });
                const wu5 = await Contact.find({
                    alias:'qiyang'
                })
                if (!weatherTips) {
                    weatherTips = true;
                    weather.timeSentInfo([wu1,wu2,wu3,wu4,wu5]);
                    message.say('天气提醒开启成功奥~');
                    console.log(dateTime(), '天气服务开启成功');
                    console.log(`${dateTime()}${message.from()}发送消息: ${message.content()}`)
                } else {
                    message.say('天气服务已经开启了哦，不要重复操作~');
                }
            }else{
                message.say('您没有权限开启APP,请联系管理员,');
                message.say('微信号:68879747')                    
            }

            return
        }
        //接入图灵机器人API
        try {
            const {
                text: reply
            } = await tuling.ask(message.content(), {
                userid: message.from()
            })
            message.say(reply)
        } catch (e) {
            console.log(e)
        }
        console.log(`${dateTime()}${message.from()}发送消息: ${message.content()} \n`)
    })
    .start();