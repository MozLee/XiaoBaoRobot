const {Contact} = require('wechaty');
/**
 * 获取所用用户列表
 * 
 * @param {number} [MAX_USER_NUM=5] 最大用户数量 默认5 请务必根据根据实际填写
 * @param {number} [RETRY_TIME=1000]  获取列表数量不足时，重新获取的间隔时间
 * @returns Promise:userList
 */
function getAllUsers(MAX_USER_NUM=5,RETRY_TIME=1000) {
  return new Promise((resolve, reject) => {
    initUsers();
    async function initUsers() {
      console.log("开始获取所有Users");
      const userList = await Contact.findAll();
      if (userList.length < MAX_USER_NUM) {
        console.warn(
          `获取用户数量不足，将在10s之后重新尝试请等待 当前获取到的用户数量:【 ${  userList.length}】`
        );
        setTimeout(initUsers, RETRY_TIME);
        return;
      }
      console.log(`成功获取所有用户，数量:【${userList.length}】`);
      resolve(userList);
      return;
    }
  });
}
module.exports = getAllUsers;