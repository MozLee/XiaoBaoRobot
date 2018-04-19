const {
    Wechaty
} = require('wechaty')

Wechaty.instance()
.on('scan',(url,code) => {
    console.log(code);
    console.log(url);
})
.on('login',(user) => {
    console.log(`用户${user}登录成功`);
})
.on('message',(message) => {
    let user = message.from();
    let userContent = message.content();
})
.start();