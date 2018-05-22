# 小宝微信机器人
## 技术栈
Node.js + Wechaty + Express + MongoDB
## 目前功能
- 智能对话
- 指定回复内容
- 根据口令自动加好友
- 根据口令自动拉入群聊
- 加好友后自动修改备注为唯一ID
- 定时推送天气服务

## 功能预览
![此处输入图片的描述][1]

## 所遇问题及解决方案

**问题1**:启动应用时，需要手动复制登录url到浏览器，然后进行扫码登录。
**解决方案**:使用 qrcode-terminal 包将url转换成终端二维码直接在终端扫描登录。
![](http://mozlee.com/githubimg/WX20180522-111836@2x.webp)

**问题2**:每次小宝掉线重新登录都需要登录到远程服务器进行扫码登录。
**解决方案**:利用Server酱,将登陆二维码直接发送到管理员的微信上。

![](http://mozlee.com/githubimg/WechatIMG29.webp)

**问题3**:小宝频繁掉线
**解决方案**:模拟心跳,向一个指定微信群发送心跳包,维持在线。


## 为小宝后台管理提供的接口
- updateall
从微信端更新最新的数据到小宝数据库
- updateid
从小宝数据库更新ID备注到微信端
## 加好友体验
> 加好友的口令为 moz

![二维码](http://mozlee.com/githubimg/xbewm.jpeg)

## 小宝系统
- [小宝管理系统--前端(移动端)][2] 技术栈 vue+vue-router+vuex+vux

- [小宝管理系统--后端][3技术栈 Nodejs+Express+MongoDB

- 核心依赖 [Wechaty](https://github.com/Chatie/wechaty)

  [1]: http://mozlee.com/githubimg/xbrobot.jpg
  [2]: https://github.com/MozLee/XiaoBaoManagement
  [3]: https://github.com/MozLee/XiaoBaoSystem