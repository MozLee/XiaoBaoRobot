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

## 为小宝后台管理提供的接口
- updateall
从微信端更新最新的数据到小宝数据库
- updateid
从小宝数据库更新ID备注到微信端
## 加好友体验
> 加好友的口令为 moz

![二维码](http://mozlee.com/githubimg/xbewm.jpeg)

## 小宝系统
[小宝管理系统--前端(移动端)][2] 技术栈 vue+vue-router+vuex+vux
[小宝管理系统--后端][3]技术栈 Nodejs+Express+MongoDB


  [1]: http://mozlee.com/githubimg/xbrobot.jpg
  [2]: https://github.com/MozLee/XiaoBaoManagement
  [3]: https://github.com/MozLee/XiaoBaoSystem