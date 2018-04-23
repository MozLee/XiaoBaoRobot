const {
    Wechaty
} = require('wechaty')

Wechaty.instance()
.on('scan',(url,code) => {
    console.log(code);
    console.log(url);

    let loginUrl = url.replace(/\/qrcode\//, '/l/')
    require('qrcode-terminal').generate(loginUrl, { //qrcode-terminal将url转成二维码
        small: true //二维码大小
    });
            
      
})
.on('login',(user) => {
    console.log(`用户${user}登录成功`);
})
.on('message',(message) => {
    let user = message.from();
    let userContent = message.content();
})
.start();