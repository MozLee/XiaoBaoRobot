//TODO:完善Emoji库
/**
 * @param {String} str 
 * @returns emoji
 */
function getEmoj(str){
    if(/晴/.test(str)){
        return '☀️'
    }
    if(/阴/.test(str)){
        return '☁️'
    }
    if(/多云/.test(str)){
        return '⛅️'
    }
    return '/::)'
}
module.exports.getEmoj = getEmoj;