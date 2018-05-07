//依赖模块
var fs = require('fs');
var request = require("request");
var mkdirp = require('mkdirp');
var path = require('path');

//本地存储目录
var dir = path.join(__dirname + '/../avatars');

//创建目录
mkdirp(dir, function(err) {
if(err){
console.log(err);
}
});

// 主要方法，用于下载文件
var download = function(url, dir, filename){
request.head(url, function(err, res, body){
request(url).pipe(fs.createWriteStream(dir + "/" + filename));
});
};

module.exports.download = download;

 