const mongoose = require('mongoose');
function dbconnect (){
    return new Promise(function(resolve, reject) {
        mongoose.connect(require('../keys/dburi.js'),(err) => {
            if(err){
                console.log('数据库连接失败'+err);
                reject(err);
                return;
            }
            resolve();
            console.log('数据库连接成功');
        })
    });
}

module.exports = dbconnect

